import "server-only";
import pg from "pg";

/**
 * The pool is created on first query, never at import time.
 *
 * `next build` imports every route module to collect page data, so throwing at
 * module scope turns a missing DATABASE_URL into a failed build rather than a
 * failed request — which is exactly what broke the first deploy of this app.
 * Builds legitimately run without database credentials (preview deployments,
 * CI); only serving a request actually needs them.
 *
 * In dev the pool hangs off globalThis so HMR doesn't leak one per reload.
 */
const globalForPg = globalThis as unknown as { snipPool?: pg.Pool };

function getPool(): pg.Pool {
  if (globalForPg.snipPool) return globalForPg.snipPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Each serverless instance gets its own pool and instances scale out, so keep
  // it small and point DATABASE_URL at Neon's pooled (-pooler) endpoint.
  const created = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10_000,
  });

  globalForPg.snipPool = created;
  return created;
}

export const pool = {
  query: ((text: unknown, params?: unknown) =>
    getPool().query(text as string, params as unknown[])) as pg.Pool["query"],
};
