import { NextRequest, NextResponse } from "next/server";
import { edgarSearch } from "@/lib/api/edgar";
import { opencorporatesSearch } from "@/lib/api/opencorporates";
import { companiesHouseSearch } from "@/lib/api/companies-house";

// Autocomplete: keep it snappy — EDGAR + a lightweight OC call, no CH by default.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ hits: [] });

  const [edgar, oc, ch] = await Promise.allSettled([
    edgarSearch(q, 4),
    opencorporatesSearch(q, 4),
    companiesHouseSearch(q, 2),
  ]);

  const hits = [
    ...(edgar.status === "fulfilled" ? edgar.value : []),
    ...(ch.status === "fulfilled" ? ch.value : []),
    ...(oc.status === "fulfilled" ? oc.value : []),
  ]
    .filter((h) => h && typeof h.name === "string" && h.name.length > 0 && h.id)
    .slice(0, 8);

  return NextResponse.json(
    { hits },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } },
  );
}
