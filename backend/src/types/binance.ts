import { PriceLevel, Quantity, Dictionary, OrderBookParams } from ".";

type UniqueId = number;

export interface BinanceProcessUpdateArgs {}

export interface BinanceSnapshot {
  lastUpdateId: number;
  bids: Array<BinanceOrder>;
  asks: Array<BinanceOrder>;
}
export interface BinanceDepthData {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: Array<BinanceOrder>;
  a: Array<BinanceOrder>;
}

export type OrderBookHandler = (params: BinanceDepthData) => void;
export type OrderBookEventHandlers = Dictionary<Array<OrderBookHandler>>;

export type BinanceOrder = [PriceLevel, Quantity, UniqueId];

export interface ProcessOrderbookUpdateParamsBinance extends OrderBookParams {
  ask: Array<BinanceOrder>;
}

export interface ProcessOrderbookSnapshotParamsBinance extends OrderBookParams {
  snapshot: BinanceSnapshot;
}

export type ProcessUpdateParamsBinance =
  | ProcessOrderbookSnapshotParamsBinance
  | ProcessOrderbookUpdateParamsBinance;
