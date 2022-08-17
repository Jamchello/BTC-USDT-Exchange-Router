import Big from "big.js";
import CoinbaseOrderBook from "../../classes/OrderBooks/Coinbase";
import { ProcessUpdateParamsCoinbase } from "../../types/coinbase";
import { CoinbaseOrder } from "../../types/coinbase";
const snapshotSize = Number(process.env.SNAPSHOT_SIZE || 500);
const processUpdate = (params: ProcessUpdateParamsCoinbase) => {
  let orderBook = params.orderBook as CoinbaseOrderBook;
  let ask: Array<CoinbaseOrder> = [];
  if ("snapshot" in params) {
    const { snapshot } = params;
    const { asks: snapshotAsks } = snapshot;
    orderBook.orders = snapshotAsks.slice(0, snapshotSize);
    orderBook.highestAsk = Big(
      orderBook.orders[orderBook.orders.length - 1][0]
    );
    orderBook.amount = orderBook.orders.reduce(
      (acc, currentOrder) => acc.plus(currentOrder[1]),
      Big(0)
    );
  } else if (!("snapshot" in params)) {
    ask = params.ask;
    const unsortedOrders = [...ask, ...orderBook.orders];
    orderBook.ingestOrders(unsortedOrders);
  }
};

export default processUpdate;
