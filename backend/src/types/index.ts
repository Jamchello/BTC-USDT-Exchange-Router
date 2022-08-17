import OrderBook from "../classes/OrderBooks/OrderBook";
import {
  BinanceOrder,
  BinanceSnapshot,
  ProcessUpdateParamsBinance,
} from "./binance";
import {
  CoinbaseOrder,
  CoinbaseSnapshot,
  ProcessUpdateParamsCoinbase,
} from "./coinbase";

export type Dictionary<x> = { [key: string]: x };

export type PriceLevel = string;
export type Quantity = string;

export type Order = BinanceOrder | CoinbaseOrder;

export type Asks = Array<Order>;

export type Bids = Array<Order>;

export interface OrderBookData<OrderFormat> {
  symbol: string;
  ask: Array<OrderFormat>;
  lastUpdateId: string;
  lastUpdated: number;
  site: string;
}

export type OrderBookDataCoinbase = OrderBookData<Order>;

export interface OrderBookParams {
  orderBook: OrderBook;
}

export type ProcessUpdateParams =
  | ProcessUpdateParamsBinance
  | ProcessUpdateParamsCoinbase;

export type Snapshot = BinanceSnapshot | CoinbaseSnapshot;
