import SocketClient from "../WebSockets/SocketClient";
import OrderBook from "./OrderBook";
import logger from "../../logger";
import { getOrderBook, getOrderBookSnapshot } from "../../services/binance";
import processUpdate from "../../helpers/binance/processUpdate";
import BinanceClient from "../WebSockets/BinanceClient";
import { BinanceOrder } from "../../types/binance";

export default class BinanceOrderBook extends OrderBook {
  public lastUpdateId: number = 0;
  public orders: Array<BinanceOrder> = [];
  public justInitialized = () => this.lastUpdateId === 0;
  private socketApi: SocketClient;
  processUpdate = processUpdate;
  updateFromSnapshot = () => {
    logger.info("Updating from snapshot");
    getOrderBookSnapshot(this.symbol).then((snapshot) =>
      // this.updateOrderBookWithSnapshot(data)
      this.processUpdate({
        orderBook: this,
        snapshot,
      })
    );
  };

  getAllOrders = () =>
    getOrderBook(this.symbol).then((snapshot) => snapshot.asks);

  cleanData = (lastUpdateId: number) => {
    this.orders = this.orders.filter((order) => order[2] > lastUpdateId);
  };

  constructor(symbol: string) {
    super(symbol, "binance");
    this.socketApi = new BinanceClient(symbol, this);
    setTimeout(() => {
      this.updateFromSnapshot();
    }, 3000);
  }
}
