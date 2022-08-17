import axios from "axios";
import { CoinbaseSnapshot } from "../types/coinbase";

export const getOrderBookSnapshot = (symbol: string) =>
  axios
    .get<CoinbaseSnapshot>(
      `https://api.exchange.coinbase.com/products/${symbol}/book?level=2`
    )
    .then(({ data }) => data);
