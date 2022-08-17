import { OrderBookParams, PriceLevel, Quantity } from ".";

export type CoinbaseBids = Array<CoinbaseOrder>;

export type CoinbaseAsks = Array<CoinbaseOrder>;

export enum ChangeType {
  BUY = "buy",
  SELL = "sell",
}

export type CoinbaseOrderBookChange = [ChangeType, PriceLevel, Quantity];

export type CoinbaseOrderBookChanges = Array<CoinbaseOrderBookChange>;

export interface CoinbaseSnapshot {
  asks: Array<CoinbaseOrder>;
  sequence?: number;
}

export type CoinbaseOrder = [PriceLevel, Quantity];

export interface ProcessOrderbookUpdateParamsCoinbase extends OrderBookParams {
  ask: Array<CoinbaseOrder>;
}

export interface ProcessOrderbookSnapshotParamsCoinbase
  extends OrderBookParams {
  snapshot: CoinbaseSnapshot;
}

export type ProcessUpdateParamsCoinbase =
  | ProcessOrderbookSnapshotParamsCoinbase
  | ProcessOrderbookUpdateParamsCoinbase;
