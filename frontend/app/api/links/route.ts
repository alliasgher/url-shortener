import { NextResponse } from "next/server";
import { createLink } from "@/lib/server/services/links";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { url } = (await request.json().catch(() => ({}))) as { url?: string };

  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  if (url.length > 2048) {
    return NextResponse.json({ error: "URL is too long" }, { status: 400 });
  }

  try {
    // Short links live on this app's own domain now.
    const link = await createLink(url, new URL(request.url).origin);
    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid URL provided") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Failed to create link:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
