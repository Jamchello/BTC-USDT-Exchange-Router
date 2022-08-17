import { MessageEvent } from "ws";
import appendUpdatedId from "../../helpers/binance/appendUpdatedId";
import validateEventUpdateId from "../../helpers/binance/validateEventUpdateId";
import logger from "../../logger";
import { BinanceDepthData } from "../../types/binance";
import DataLostException from "../DataLostException";
import SocketClient from "./SocketClient";
import BinanceOrderBook from "../OrderBooks/Binance";

export default class BinanceClient extends SocketClient {
  orderBook: BinanceOrderBook;
  private depthWsHandler = (params: BinanceDepthData) => {
    try {
      // has to be uppcase 'U'
      validateEventUpdateId(params.U)(this.orderBook);
      const ask = appendUpdatedId(params.u, params.a);
      this.orderBook.lastUpdateId = params.u;
      this.orderBook.lastUpdated = params.E;

      this.orderBook.processUpdate({
        orderBook: this.orderBook,
        ask,
      });
    } catch (e) {
      if (e instanceof DataLostException) {
        // if lastUpdateId is not continued, fetch the snapshot
        logger.warn(e.message);
        this.orderBook.updateFromSnapshot();
      } else {
        throw e;
      }
    }
  };
  _handlers = new Map(
    Object.entries({
      depthUpdate: [this.depthWsHandler],
    })
  );

  constructor(symbol: string, orderBook: BinanceOrderBook) {
    super(`ws/${symbol.toLowerCase()}@depth`, "wss://stream.binance.com/");
    this.orderBook = orderBook;
  }
  onMessage = (msg: MessageEvent) => {
    try {
      const message = JSON.parse(msg.data as string);
      if (message.e && this._handlers.has(message.e)) {
        this._handlers.get(message.e)?.forEach((cb) => {
          cb(message);
        });
      } else {
        logger.warn("Unknown method", message);
      }
    } catch (e) {
      logger.warn("Parse message failed", e);
    }
  };
}
