import { FastifyInstance } from "fastify";
import { resolveCode } from "../services/links.service.js";
import { recordClick } from "../services/analytics.service.js";

export async function redirectRoutes(app: FastifyInstance) {
  app.get<{ Params: { code: string } }>("/:code", async (request, reply) => {
    const { code } = request.params;

    // Skip favicon and other non-code requests
    if (code === "favicon.ico" || code === "robots.txt") {
      return reply.status(404).send();
    }

    const link = await resolveCode(code);
    if (!link) {
      return reply.status(404).send({ error: "Link not found" });
    }

    // Extract metadata
    const forwarded = request.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : request.ip;
    const userAgent = request.headers["user-agent"] || "";
    const referer = request.headers["referer"] || null;

    // Fire-and-forget: record click without blocking redirect
    recordClick(link.id, ip, userAgent, referer).catch((err) => {
      request.log.error({ err }, "Failed to record click");
    });

    return reply.redirect(link.original_url);
  });
}
