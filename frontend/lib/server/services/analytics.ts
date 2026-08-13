import "server-only";
import { pool } from "../db";
import type { AnalyticsResponse, RecentClick } from "../types";

export async function getAnalytics(
  linkId: number,
  link: { code: string; original_url: string; created_at: string }
): Promise<AnalyticsResponse> {
  const [
    totalResult,
    timeResult,
    countryResult,
    browserResult,
    osResult,
    deviceResult,
    referrerResult,
    recentResult,
  ] = await Promise.all([
    pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM clicks WHERE link_id = $1`,
      [linkId]
    ),
    // TO_CHAR keeps the day as a plain 'YYYY-MM-DD' string. DATE() returns a
    // `date`, which node-postgres parses into a Date at *local* midnight — that
    // shifts every bucket by a day whenever the server is not running in UTC.
    pool.query<{ date: string; clicks: string }>(
      `SELECT TO_CHAR(clicked_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') as date, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1 AND clicked_at > NOW() - INTERVAL '30 days'
       GROUP BY 1 ORDER BY 1`,
      [linkId]
    ),
    pool.query<{ country: string; clicks: string }>(
      `SELECT country, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1 AND country IS NOT NULL
       GROUP BY country ORDER BY clicks DESC LIMIT 10`,
      [linkId]
    ),
    pool.query<{ browser: string; clicks: string }>(
      `SELECT browser, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1 AND browser IS NOT NULL
       GROUP BY browser ORDER BY clicks DESC LIMIT 10`,
      [linkId]
    ),
    pool.query<{ os: string; clicks: string }>(
      `SELECT os, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1 AND os IS NOT NULL
       GROUP BY os ORDER BY clicks DESC LIMIT 10`,
      [linkId]
    ),
    pool.query<{ device_type: string; clicks: string }>(
      `SELECT device_type, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1 AND device_type IS NOT NULL
       GROUP BY device_type ORDER BY clicks DESC`,
      [linkId]
    ),
    pool.query<{ referrer: string; clicks: string }>(
      `SELECT COALESCE(referrer, 'Direct') as referrer, COUNT(*) as clicks
       FROM clicks WHERE link_id = $1
       GROUP BY referrer ORDER BY clicks DESC LIMIT 10`,
      [linkId]
    ),
    pool.query<RecentClick>(
      `SELECT clicked_at, country, city, browser, os, device_type, referrer
       FROM clicks WHERE link_id = $1
       ORDER BY clicked_at DESC LIMIT 20`,
      [linkId]
    ),
  ]);

  return {
    link: { code: link.code, original_url: link.original_url, created_at: link.created_at },
    total_clicks: parseInt(totalResult.rows[0].count, 10),
    clicks_over_time: timeResult.rows.map((r) => ({ date: r.date, clicks: parseInt(r.clicks, 10) })),
    countries: countryResult.rows.map((r) => ({ country: r.country, clicks: parseInt(r.clicks, 10) })),
    browsers: browserResult.rows.map((r) => ({ browser: r.browser, clicks: parseInt(r.clicks, 10) })),
    os: osResult.rows.map((r) => ({ os: r.os, clicks: parseInt(r.clicks, 10) })),
    devices: deviceResult.rows.map((r) => ({ device_type: r.device_type, clicks: parseInt(r.clicks, 10) })),
    referrers: referrerResult.rows.map((r) => ({ referrer: r.referrer, clicks: parseInt(r.clicks, 10) })),
    recent_clicks: recentResult.rows,
  };
}
