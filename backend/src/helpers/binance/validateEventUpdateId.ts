import DataLostException from "../../classes/DataLostException";
import BinanceOrderBook from "../../classes/OrderBooks/Binance";

export default (id: number) => (orderBook: BinanceOrderBook) => {
  const { lastUpdateId } = orderBook;
  if (id - Number(lastUpdateId) !== 1 && !orderBook.justInitialized()) {
    throw new DataLostException(
      `Event id is not continued, lastUpdateId: ${lastUpdateId}, Event Id: ${id}`
    );
  }
};
