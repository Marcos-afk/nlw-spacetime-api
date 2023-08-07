import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import { Signale } from "signale";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";

const app = fastify();
const log = new Signale();

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: String(process.env.JWT_SECRET_KEY),
});

app.register(memoriesRoutes);
app.register(authRoutes);

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
