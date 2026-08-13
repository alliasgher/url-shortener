import "server-only";
import { nanoid } from "nanoid";
import { pool } from "../db";
import type { Link } from "../types";

/**
 * @param origin where short links are served from. Previously this came from a
 * BASE_URL env var pointing at the separate API host, which produced short URLs
 * on the wrong domain. The app now serves its own redirects, so it is the
 * request's own origin.
 */
export async function createLink(originalUrl: string, origin: string): Promise<Link & { short_url: string }> {
  let normalized = originalUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error("Invalid URL provided");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid URL provided");
  }

  const code = nanoid(7);

  const result = await pool.query<Link>(
    `INSERT INTO links (code, original_url) VALUES ($1, $2)
     RETURNING id, code, original_url, created_at`,
    [code, normalized]
  );

  const link = result.rows[0];
  return { ...link, short_url: `${origin}/${link.code}` };
}

export async function resolveCode(code: string): Promise<Link | null> {
  const result = await pool.query<Link>(
    `SELECT id, code, original_url, created_at FROM links WHERE code = $1`,
    [code]
  );
  return result.rows[0] || null;
}
