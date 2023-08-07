import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export const memoriesRoutes = async (app: FastifyInstance) => {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/memories", async (request) => {
    const { sub } = request.user;

    const memories = await prisma.memory.findMany({
      where: {
        userId: sub,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return {
      message: "Successfully retrieved memories",
      memories: memories.map((memory) => {
        return {
          id: memory.id,
          cover_url: memory.cover_url,
          is_public: memory.is_public,
          created_at: memory.created_at,
          excerpt: memory.content.substring(0, 100).concat("..."),
        };
      }),
    };
  });

  app.get("/memories/:id", async (request, response) => {
    const { id } = request.params as { id: string };

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const { sub } = request.user;
    if (memory.userId !== sub) {
      response.status(403).send();
    }

    return {
      message: "Successfully retrieved memory",
      memory,
    };
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string().nonempty(),
      cover_url: z.string().url(),
      is_public: z.coerce.boolean().default(false),
    });

    const { content, cover_url, is_public } = bodySchema.parse(request.body);
    const { sub } = request.user;

    await prisma.memory.create({
      data: {
        content,
        cover_url,
        is_public,
        userId: sub,
      },
    });

    return {
      message: "Successfully created memory",
    };
  });

  app.put("/memories/:id", async (request) => {
    const { id } = request.params as { id: string };

    const bodySchema = z.object({
      content: z.string().nonempty(),
      cover_url: z.string().url(),
      is_public: z.coerce.boolean().default(false),
    });

    const { content, cover_url, is_public } = bodySchema.parse(request.body);
    const { sub } = request.user;

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
        userId: sub,
      },
    });

    await prisma.memory.update({
      where: {
        id: memory.id,
      },
      data: {
        content,
        cover_url,
        is_public,
      },
    });

    return {
      message: "Successfully updated memory",
    };
  });

  app.delete("/memories/:id", async (request) => {
    const { id } = request.params as { id: string };

    const { sub } = request.user;

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
        userId: sub,
      },
    });

    await prisma.memory.delete({
      where: {
        id: memory.id,
      },
    });

    return {
      message: "Successfully deleted memory",
    };
  });
};
