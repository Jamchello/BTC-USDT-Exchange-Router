import axios from "axios";
import { BinanceSnapshot } from "../types/binance";
const snapshotSize = process.env.SNAPSHOT_SIZE || "500";

export const getOrderBookSnapshot = async (symbol: string) =>
  axios
    .get<BinanceSnapshot>(
      `https://api.binance.com/api/v1/depth?limit=${snapshotSize}&symbol=${symbol}`
    )
    .then(({ data }) => data);

export const getOrderBook = async (symbol: string) =>
  axios
    .get<BinanceSnapshot>(
      `https://api.binance.com/api/v1/depth?limit=5000&symbol=${symbol}`
    )
    .then(({ data }) => data);
