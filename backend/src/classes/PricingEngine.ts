import BinanceOrderBook from "./OrderBooks/Binance";
import Big from "big.js";
import CoinbaseOrderBook from "./OrderBooks/Coinbase";

export default class PricingEngine {
  orderBooks = {
    binance: new BinanceOrderBook("BTCUSDT"),
    coinbase: new CoinbaseOrderBook("BTC-USDT"),
  };

  getBestQuoute = async (amount: number) => {
    const quotes = (
      await Promise.all(
        Object.values(this.orderBooks).map(async (orderBook) => ({
          usdAmount: await orderBook.getQuote(amount),
          btcAmount: Number(amount),
          exchange: orderBook.site,
        }))
      )
    ).filter((quote) => quote.usdAmount);

    if (quotes.length === 0) {
      return { error: "No route found." };
    }
    return quotes.sort((q1, q2) => {
      const bigQ1 = new Big(q1.usdAmount as number);
      return bigQ1.minus(q2.usdAmount as number).toNumber();
    })[0];
  };

  getUpdateTimes = () =>
    Object.values(this.orderBooks).map((orderBook) => ({
      [`${orderBook.symbol}@${orderBook.site}`]: orderBook.lastUpdated,
    }));

  getCacheDetails = () =>
    Object.values(this.orderBooks).map((orderBook) => ({
      [`${orderBook.symbol}@${orderBook.site}`]: {
        highestAsk: orderBook.highestAsk,
        amount: orderBook.amount,
      },
    }));
}
