import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import priceEngine from "../price-engine";

export const exchangeRoutingHandler = async (
  request: FastifyRequest<{
    Querystring: {
      amount: number;
    };
  }>,
  reply: FastifyReply
) => {
  const { amount } = request.query;
  if (!amount) {
    reply.send({
      error: "Must supply a valid `amount` parameter in query",
    });
  }
  const bestQuote = await priceEngine.getBestQuoute(amount);
  reply.code(200).send(bestQuote);
};
