import { FastifyReply, FastifyRequest } from "fastify";
import priceEngine from "../price-engine";
export const statusHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.code(200).send({
    alive: true,
    lastUpdates: priceEngine.getUpdateTimes(),
    cachedPrices: priceEngine.getCacheDetails(),
  });
};
