import { NextRequest, NextResponse } from "next/server";
import { unifiedSearch } from "@/lib/api/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const jurisdiction = req.nextUrl.searchParams.get("jurisdiction")?.trim();
  const status = req.nextUrl.searchParams.get("status")?.trim();
  if (!q) return NextResponse.json({ hits: [] });

  let hits = await unifiedSearch(q, 30);

  if (jurisdiction && jurisdiction !== "all") {
    hits = hits.filter((h) => (h.jurisdiction ?? "").split("_")[0] === jurisdiction);
  }
  if (status && status !== "all") {
    hits = hits.filter((h) => h.status === status);
  }

  return NextResponse.json(
    { hits },
    { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=600" } },
  );
}
