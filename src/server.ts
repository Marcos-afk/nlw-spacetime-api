import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import { Signale } from "signale";
import { memoriesRoutes } from "./routes/memories";

const app = fastify();
const log = new Signale();

app.register(cors, {
  origin: true,
});

app.register(memoriesRoutes);

try {
  app.listen({
    port: Number(process.env.API_PORT),
  });

  log.success(`Successfully started server on port ${process.env.API_PORT}`);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Error starting server";
  log.error(message);
}
