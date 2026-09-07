import type { SearchHit } from "@/lib/types";
import { edgarSearch } from "@/lib/api/edgar";
import { opencorporatesSearch } from "@/lib/api/opencorporates";
import { companiesHouseSearch } from "@/lib/api/companies-house";

/**
 * Unified search: fires the free sources in parallel, deduplicates by
 * (name, jurisdiction), and orders EDGAR public-company hits first when
 * the query matches a ticker.
 */
export async function unifiedSearch(query: string, limit = 20): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length === 0) return [];

  const [edgar, oc, ch] = await Promise.allSettled([
    edgarSearch(q, 8),
    opencorporatesSearch(q, 12),
    companiesHouseSearch(q, 6),
  ]);

  const hits: SearchHit[] = [];
  if (edgar.status === "fulfilled") hits.push(...edgar.value);
  if (oc.status === "fulfilled") hits.push(...oc.value);
  if (ch.status === "fulfilled") hits.push(...ch.value);

  const dedup = new Map<string, SearchHit>();
  for (const h of hits) {
    if (!h?.name) continue; // defensive: skip malformed hits from any source
    const key = `${h.name.toLowerCase()}::${h.jurisdiction ?? ""}`;
    const existing = dedup.get(key);
    // Prefer EDGAR (has ticker) over OC/CH when they name the same entity in the same jurisdiction.
    if (!existing || sourceWeight(h.source) > sourceWeight(existing.source)) {
      dedup.set(key, h);
    }
  }
  return Array.from(dedup.values()).slice(0, limit);
}

function sourceWeight(s: SearchHit["source"]): number {
  switch (s) {
    case "edgar":
      return 3;
    case "companies-house":
      return 2;
    case "opencorporates":
      return 1;
    default:
      return 0;
  }
}
