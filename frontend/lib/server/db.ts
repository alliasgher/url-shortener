import "server-only";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Each serverless instance gets its own pool and instances scale out, so keep
// it small and point DATABASE_URL at Neon's pooled (-pooler) endpoint.
// In dev, hang it off globalThis so HMR doesn't leak a pool per reload.
const globalForPg = globalThis as unknown as { snipPool?: pg.Pool };

export const pool =
  globalForPg.snipPool ??
  new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") globalForPg.snipPool = pool;
