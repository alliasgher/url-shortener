import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { neon } from "@neondatabase/serverless";
import { UAParser } from "ua-parser-js";

/**
 * Short-link redirects run at the edge, close to the visitor, because the
 * redirect *is* the product. Two consequences shape this file:
 *
 *  - The edge runtime has no TCP, so `pg` cannot be used here. Neon's HTTP
 *    driver can, which is why this is the one place using it.
 *  - The click insert must not delay the redirect, but must still finish.
 *    `event.waitUntil` keeps the invocation alive after the response is sent —
 *    the fire-and-forget the Fastify version used would simply be dropped.
 */

const sql = neon(process.env.DATABASE_URL!);

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function recordClick(req: NextRequest, linkId: number) {
  // Vercel resolves geolocation at the edge and passes it as headers, on every
  // plan. This replaces geoip-lite, whose bundled database was ~153MB.
  const country = req.headers.get("x-vercel-ip-country");
  const city = decodeHeader(req.headers.get("x-vercel-ip-city"));
  const region = decodeHeader(req.headers.get("x-vercel-ip-country-region"));

  const ua = req.headers.get("user-agent") || "";
  const parser = new UAParser(ua);
  const browser = parser.getBrowser().name || null;
  const os = parser.getOS().name || null;
  const deviceType = parser.getDevice().type || "desktop";

  const referer = req.headers.get("referer");
  let referrerDomain: string | null = null;
  if (referer) {
    try {
      referrerDomain = new URL(referer).hostname;
    } catch {
      referrerDomain = referer;
    }
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || null;

  await sql`
    INSERT INTO clicks (link_id, country, city, region, device_type, browser, os, referrer, ip)
    VALUES (${linkId}, ${country}, ${city}, ${region}, ${deviceType}, ${browser}, ${os}, ${referrerDomain}, ${ip})
  `;
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  // The matcher lets "/" through; it is the homepage, not a short code.
  if (pathname === "/") return NextResponse.next();

  const code = pathname.slice(1);
  if (!code || code.includes("/")) return NextResponse.next();

  try {
    const rows = (await sql`
      SELECT id, original_url FROM links WHERE code = ${code}
    `) as { id: number; original_url: string }[];

    const link = rows[0];
    if (!link) return NextResponse.next(); // falls through to the 404 page

    event.waitUntil(
      recordClick(req, link.id).catch((err) => console.error("Failed to record click:", err))
    );

    return NextResponse.redirect(link.original_url, 302);
  } catch (err) {
    // A analytics/database failure must never swallow a visitor's redirect,
    // but with no destination resolved the only honest outcome is the 404 page.
    console.error("Redirect lookup failed:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Everything except the API, Next internals, the dashboard, and static files.
    "/((?!api/|_next/static|_next/image|dashboard|favicon.ico|robots.txt|.*\\.).*)",
  ],
};
