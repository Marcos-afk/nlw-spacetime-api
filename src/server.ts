import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import { Signale } from "signale";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { uploadRoutes } from "./routes/upload";
import { resolve } from "node:path";

const app = fastify();
const log = new Signale();

app.register(cors, {
  origin: true,
});

app.register(multipart);
app.register(fastifyStatic, {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(jwt, {
  secret: String(process.env.JWT_SECRET_KEY),
});

app.register(memoriesRoutes);
app.register(authRoutes);
app.register(uploadRoutes);

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
