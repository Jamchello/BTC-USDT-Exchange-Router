import WebSocket from "ws";
import logger from "../../logger";
import { OrderBookEventHandlers } from "../../types/binance";
import OrderBook from "../OrderBooks/OrderBook";

export default abstract class SocketClient {
  private baseUrl;
  private path;
  private ws: WebSocket;
  protected abstract onMessage: (msg: WebSocket.MessageEvent) => void;
  protected abstract orderBook: OrderBook;
  constructor(path: string, baseUrl: string, args?: any) {
    this.baseUrl = baseUrl;
    this.path = path;
    this.ws = new WebSocket(`${this.baseUrl}${this.path}`);
    this.setupSocket(args);
  }

  private setupSocket(args?: any) {
    this.ws.onopen = () => {
      logger.info("ws connected");
      args && this.ws.send(JSON.stringify(args));
    };

    this.ws.onclose = () => {
      logger.warn("ws closed");
    };

    this.ws.onerror = (err) => {
      logger.warn("ws error", err);
    };
    this.ws.onmessage = (msg) => this.onMessage(msg);

    this.heartBeat();
  }

  heartBeat() {
    setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 5000);
  }
}
