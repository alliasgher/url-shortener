import { config as loadEnv } from "dotenv";
import pg from "pg";

// Next reads .env.local automatically; plain tsx scripts do not.
loadEnv({ path: ".env.local" });
loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

export const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 5 });
