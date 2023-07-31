import "dotenv/config";
import fastify from "fastify";
import { Signale } from "signale";

const app = fastify();
const log = new Signale();

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
