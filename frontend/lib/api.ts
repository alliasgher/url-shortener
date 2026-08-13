import type { LinkResponse, AnalyticsResponse } from "./types";

// The API is served by this same Next app under /api — requests are same-origin.
export async function shortenUrl(url: string): Promise<LinkResponse> {
  const res = await fetch(`/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to shorten URL" }));
    throw new Error(err.error || "Failed to shorten URL");
  }
  return res.json();
}

export async function getAnalytics(code: string): Promise<AnalyticsResponse> {
  const res = await fetch(`/api/analytics/${code}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Link not found");
    throw new Error("Failed to load analytics");
  }
  return res.json();
}

export async function getLink(code: string): Promise<{ code: string; original_url: string; created_at: string }> {
  const res = await fetch(`/api/links/${code}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Link not found");
    throw new Error("Failed to load link");
  }
  return res.json();
}
