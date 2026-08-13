import { NextResponse } from "next/server";
import { resolveCode } from "@/lib/server/services/links";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const link = await resolveCode(code);
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  return NextResponse.json({
    code: link.code,
    original_url: link.original_url,
    created_at: link.created_at,
  });
}
