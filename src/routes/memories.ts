import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export const memoriesRoutes = async (app: FastifyInstance) => {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
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

  app.get("/memories/:id", async (request) => {
    const { id } = request.params as { id: string };

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

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

    await prisma.memory.create({
      data: {
        content,
        cover_url,
        is_public,
        userId: "40a8814a-b066-4f3e-8892-e84576529033",
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

    await prisma.memory.update({
      where: {
        id,
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

    await prisma.memory.delete({
      where: {
        id,
      },
    });

    return {
      message: "Successfully deleted memory",
    };
  });
};
