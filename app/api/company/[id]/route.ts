import { NextRequest, NextResponse } from "next/server";
import { resolveCompanyDetail } from "@/lib/api/detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const detail = await resolveCompanyDetail(params.id);
  if (!detail) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(
    { company: detail },
    { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
