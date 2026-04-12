import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { migrate } from "./db/migrate.js";
import { healthRoutes } from "./routes/health.js";
import { linkRoutes } from "./routes/links.js";
import { redirectRoutes } from "./routes/redirect.js";
import { analyticsRoutes } from "./routes/analytics.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [
    config.frontendUrl,
    /\.vercel\.app$/,
  ],
  methods: ["GET", "POST"],
});

await app.register(healthRoutes);
await app.register(linkRoutes);
await app.register(analyticsRoutes);
// Register redirect last — its /:code wildcard must not match /api/* routes
await app.register(redirectRoutes);

try {
  await migrate();
  await app.listen({ port: config.port, host: "0.0.0.0" });
  console.log(`Server running on port ${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
