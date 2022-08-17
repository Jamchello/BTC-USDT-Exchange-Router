import cors from "@fastify/cors";
import routes from "./routes";
import fastify from "fastify";
const app = fastify({ logger: true });

app.register(cors, { origin: "*" });
app.register(routes);

export default app;
