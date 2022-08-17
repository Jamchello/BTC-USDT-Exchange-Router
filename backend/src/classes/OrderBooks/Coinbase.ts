import processUpdate from "../../helpers/coinbase/processUpdate";
import logger from "../../logger";
import { getOrderBookSnapshot } from "../../services/coinbase";
import { CoinbaseOrder } from "../../types/coinbase";
import CoinbaseClient from "../WebSockets/CoinbaseClient";
import OrderBook from "./OrderBook";

export default class CoinbaseOrderBook extends OrderBook {
  public orders: Array<CoinbaseOrder> = [];
  processUpdate = processUpdate;
  private socketApi: CoinbaseClient;
  // updateFromSnapshot = () =>
  //   getOrderBookSnapshot(this.symbol).then((snapshot) => {
  //     this.processUpdate({
  //       orderBook: this,
  //       snapshot,
  //     });
  //   });

  getAllOrders = async () => {
    logger.info("Cache not large enough - hitting coinbase API");
    return getOrderBookSnapshot(this.symbol).then((snapshot) => snapshot.asks);
  };

  constructor(symbol: string) {
    super(symbol, "coinbase");
    this.socketApi = new CoinbaseClient("BTC-USDT", this);
  }
}
