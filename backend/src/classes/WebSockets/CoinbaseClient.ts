import { MessageEvent } from "ws";
import logger from "../../logger";
import {
  ChangeType,
  CoinbaseOrder,
  CoinbaseOrderBookChanges,
} from "../../types/coinbase";
import CoinbaseOrderBook from "../OrderBooks/Coinbase";
import SocketClient from "./SocketClient";

const coinbaseSubscribePayload = (symbol: string) => ({
  type: "subscribe",
  product_ids: [symbol.toUpperCase()],
  channels: ["level2_batch"],
});

export default class CoinbaseClient extends SocketClient {
  orderBook: CoinbaseOrderBook;
  private changesHandler = (
    changes: CoinbaseOrderBookChanges,
    time: string
  ) => {
    const ask: Array<CoinbaseOrder> = [];
    const bid: Array<CoinbaseOrder> = [];

    changes.forEach((change) =>
      change[0] == ChangeType.BUY
        ? bid.push([change[1], change[2]])
        : ask.push([change[1], change[2]])
    );
    this.orderBook.processUpdate({
      orderBook: this.orderBook,
      ask,
    });
    this.orderBook.lastUpdated = new Date(time).getTime();
  };
  private snapshotHandler = (asks: Array<CoinbaseOrder>) => {
    this.orderBook.lastUpdated = Date.now();
    this.orderBook.processUpdate({
      orderBook: this.orderBook,
      snapshot: {
        asks,
      },
    });
  };
  onMessage = (msg: MessageEvent) => {
    try {
      const message = JSON.parse(msg.data as string);
      // logger.debug(message);
      if (message.type === "l2update" && message.changes && message.time) {
        this.changesHandler(message.changes, message.time);
      } else if (message.type === "snapshot" && message.asks && message.bids) {
        this.snapshotHandler(message.asks);
      } else if (message.type === "subscriptions") {
        logger.info("Coinbase l2 channel subscription complete");
      } else {
        logger.warn("Unknown message type", message);
      }
    } catch (e) {
      logger.warn("Parse message failed", e);
    }
  };
  constructor(symbol: string, orderBook: CoinbaseOrderBook) {
    super(
      "",
      "wss://ws-feed.exchange.coinbase.com",
      coinbaseSubscribePayload(symbol)
    );

    this.orderBook = orderBook;
  }
}
