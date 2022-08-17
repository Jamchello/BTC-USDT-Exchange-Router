import Big from "big.js";
import BinanceOrderBook from "../../classes/OrderBooks/Binance";
import logger from "../../logger";
import { ProcessUpdateParamsBinance } from "../../types/binance";
import { BinanceOrder } from "../../types/binance";
import appendUpdatedId from "./appendUpdatedId";
const processUpdate = (params: ProcessUpdateParamsBinance) => {
  let orderBook = params.orderBook as BinanceOrderBook;
  let unsortedOrders: Array<BinanceOrder> = [];
  if ("snapshot" in params && "lastUpdateId" in params.snapshot) {
    const { snapshot } = params;
    const { lastUpdateId, asks: snapshotAsks } = snapshot;
    orderBook.cleanData(lastUpdateId);
    const highestAskInSnapshot = snapshotAsks[snapshotAsks.length - 1][0];
    unsortedOrders = [
      ...orderBook.orders.filter((ask) =>
        Big(ask[0]).lte(highestAskInSnapshot)
      ),
      ...appendUpdatedId(lastUpdateId, snapshotAsks),
    ];
    orderBook.highestAsk = Big(highestAskInSnapshot);
  } else if (!("snapshot" in params)) {
    unsortedOrders = [
      ...(params.ask as Array<BinanceOrder>),
      ...orderBook.orders,
    ];
  }

  orderBook.ingestOrders(unsortedOrders);
};

export default processUpdate;
