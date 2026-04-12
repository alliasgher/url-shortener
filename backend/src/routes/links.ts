import { FastifyInstance } from "fastify";
import { createLink, resolveCode } from "../services/links.service.js";

export async function linkRoutes(app: FastifyInstance) {
  app.post<{ Body: { url: string } }>("/api/links", async (request, reply) => {
    const { url } = request.body || {};

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return reply.status(400).send({ error: "URL is required" });
    }

    if (url.length > 2048) {
      return reply.status(400).send({ error: "URL is too long" });
    }

    try {
      const link = await createLink(url);
      return reply.status(201).send(link);
    } catch (err: any) {
      if (err.message === "Invalid URL provided") {
        return reply.status(400).send({ error: err.message });
      }
      throw err;
    }
  });

  app.get<{ Params: { code: string } }>("/api/links/:code", async (request, reply) => {
    const link = await resolveCode(request.params.code);
    if (!link) {
      return reply.status(404).send({ error: "Link not found" });
    }
    return { code: link.code, original_url: link.original_url, created_at: link.created_at };
  });
}
