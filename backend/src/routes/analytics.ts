import { FastifyInstance } from "fastify";
import { resolveCode } from "../services/links.service.js";
import { getAnalytics } from "../services/analytics.service.js";

export async function analyticsRoutes(app: FastifyInstance) {
  app.get<{ Params: { code: string } }>("/api/analytics/:code", async (request, reply) => {
    const link = await resolveCode(request.params.code);
    if (!link) {
      return reply.status(404).send({ error: "Link not found" });
    }

    const analytics = await getAnalytics(link.id, link);
    return analytics;
  });
}
