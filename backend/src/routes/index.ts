import { FastifyInstance } from "fastify";
import { exchangeRoutingHandler } from "./get-exchange-routing";
import { statusHandler } from "./get-status";

export default async (instance: FastifyInstance) => {
  instance.get("/status", statusHandler);
  instance.get("/exchange-routing", exchangeRoutingHandler);
};
