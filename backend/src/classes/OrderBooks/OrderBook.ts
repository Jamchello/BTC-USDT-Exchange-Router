import Big from "big.js";
import logger from "../../logger";
import { Dictionary, Order } from "../../types";
abstract class OrderBook {
  public lastUpdated: number = 0;
  public site: string;
  public symbol: string;
  public amount: Big = Big(0);
  public highestAsk: Big = Big(0);

  public abstract orders: Array<Order>;

  protected abstract processUpdate: (params: any) => void;

  abstract getAllOrders: () => Promise<Array<Order>>;

  constructor(symbol: string, site: string) {
    this.symbol = symbol;
    this.site = site;
  }
  ingestOrders = (orders: Array<Order>) => {
    this.orders = [];
    const seen: Dictionary<Order> = {};
    let totalAmount = Big(0);
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const [price, amount] = order;
      const fromSeen = seen[price];
      if (!fromSeen) {
        seen[price] = order;
        const bigPrice = Big(price);
        if (
          (this.highestAsk.eq(0) || bigPrice.lte(this.highestAsk)) &&
          amount !== "0.00000000"
        ) {
          this.orders.push(order);
          totalAmount = totalAmount.plus(amount);
        }
      }
    }

    this.orders = this.orders.sort((a: Order, b: Order) =>
      Big(a[0]).minus(b[0]).toNumber()
    );
    this.highestAsk = this.orders.length
      ? Big(this.orders[this.orders.length - 1][0])
      : Big(0);
    this.amount = totalAmount;
  };

  getQuote = async (amount: string | number): Promise<number | null> => {
    try {
      let bigAmount = new Big(amount);
      const asks = await (bigAmount.gt(this.amount)
        ? this.getAllOrders()
        : [...this.orders]);
      let i = 0;
      let totalCost = new Big(0);
      while (bigAmount.gt(0)) {
        const order = asks[i];
        if (i >= asks.length) {
          logger.info(`Insufficient depth to facilitate order of ${amount}`);
          return null;
        }
        const amountToBuy = bigAmount.gte(order[1])
          ? new Big(order[1])
          : bigAmount;
        const cost = amountToBuy.mul(order[0]);
        bigAmount = bigAmount.minus(amountToBuy);
        totalCost = totalCost.plus(cost);
        i++;
      }
      return totalCost.toNumber();
    } catch (e) {
      logger.warn(e);
      return null;
    }
  };
}

export default OrderBook;
