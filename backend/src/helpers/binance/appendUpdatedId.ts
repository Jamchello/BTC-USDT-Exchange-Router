import { Asks, Order } from "../../types";
import { BinanceOrder } from "../../types/binance";

export default (updateId: number, ask: Asks): Array<BinanceOrder> => {
  const insertUpdateId = (order: Order): BinanceOrder => {
    const [price, quantity] = order;
    return [price, quantity, updateId];
  };
  return ask.map(insertUpdateId);
};
