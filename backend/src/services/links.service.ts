import { nanoid } from "nanoid";
import { pool } from "../db/client.js";
import { config } from "../config.js";
import type { Link } from "../types/index.js";

export async function createLink(originalUrl: string): Promise<Link & { short_url: string }> {
  let normalized = originalUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  // Validate URL
  try {
    new URL(normalized);
  } catch {
    throw new Error("Invalid URL provided");
  }

  // Reject dangerous schemes
  const scheme = new URL(normalized).protocol;
  if (!["http:", "https:"].includes(scheme)) {
    throw new Error("Invalid URL provided");
  }

  const code = nanoid(7);

  const result = await pool.query<Link>(
    `INSERT INTO links (code, original_url) VALUES ($1, $2)
     RETURNING id, code, original_url, created_at`,
    [code, normalized]
  );

  const link = result.rows[0];
  return {
    ...link,
    short_url: `${config.baseUrl}/${link.code}`,
  };
}

export async function resolveCode(code: string): Promise<Link | null> {
  const result = await pool.query<Link>(
    `SELECT id, code, original_url, created_at FROM links WHERE code = $1`,
    [code]
  );
  return result.rows[0] || null;
}
