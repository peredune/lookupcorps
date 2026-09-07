import type { CompanyDetail } from "@/lib/types";
import { edgarDetail, parseEdgarId } from "@/lib/api/edgar";
import { opencorporatesDetail, parseOcId } from "@/lib/api/opencorporates";
import { companiesHouseDetail, parseChId } from "@/lib/api/companies-house";
import { wikipediaSummary } from "@/lib/api/wikipedia";
import { finnhubSnapshot } from "@/lib/api/finnhub";
import { clearbitLogoUrl } from "@/lib/api/clearbit";
import { domainFor } from "@/lib/api/logo-map";
import { cached } from "@/lib/cache";
import { domainFromWebsite } from "@/lib/utils";

/**
 * Resolve a company id to a fully-hydrated CompanyDetail.
 * The id encodes the source; we then enrich with wiki + logo + snapshot.
 */
export async function resolveCompanyDetail(
  id: string,
): Promise<CompanyDetail | null> {
  return cached(
    `detail:${id}`,
    async () => {
      const base = await fetchBase(id);
      if (!base) return null;

      // Enrichment in parallel — every one is best-effort.
      const [wiki, snapshot] = await Promise.all([
        wikipediaSummary(base.name),
        base.ticker ? finnhubSnapshot(base.ticker) : Promise.resolve(null),
      ]);

      // Order-of-preference logo candidates. First one that loads on the client wins.
      const candidates = buildLogoCandidates({
        ticker: base.ticker,
        name: base.name,
        website: base.website,
        wikiWebsite: null, // Wikipedia summary API doesn't return the infobox website
        wikiImage: wiki?.imageUrl ?? null,
      });

      const primaryDomain =
        domainFor({ ticker: base.ticker, name: base.name }) ??
        domainFromWebsite(base.website ?? null) ??
        guessDomainFromName(base.name);

      const sources = new Set(base.sources);
      if (wiki) sources.add("Wikipedia");
      if (snapshot) sources.add("Finnhub");
      if (candidates.some((c) => c.includes("logo.clearbit.com"))) sources.add("Clearbit");

      return {
        ...base,
        domain: primaryDomain,
        website: base.website ?? (primaryDomain ? `https://${primaryDomain}` : null),
        logoCandidates: candidates,
        // Kept for backward compat with anything reading logoUrl:
        logoUrl: candidates[0] ?? null,
        wiki: wiki ?? null,
        publicSnapshot: snapshot ?? null,
        sources: Array.from(sources),
      } as CompanyDetail & { logoUrl: string | null };
    },
    60 * 60 * 6,
  );
}

/** Build an ordered list of logo URLs to try (client falls back on error). */
function buildLogoCandidates({
  ticker,
  name,
  website,
  wikiWebsite,
  wikiImage,
}: {
  ticker?: string | null;
  name: string;
  website?: string | null;
  wikiWebsite?: string | null;
  wikiImage?: string | null;
}): string[] {
  const urls: string[] = [];
  const push = (u: string | null | undefined) => {
    if (u && !urls.includes(u)) urls.push(u);
  };

  // 1. Curated brand map (most accurate for known brands)
  const curated = domainFor({ ticker, name });
  if (curated) push(clearbitLogoUrl(curated, 128));

  // 2. Explicit website on the record
  const websiteDomain = domainFromWebsite(website ?? wikiWebsite ?? null);
  if (websiteDomain) push(clearbitLogoUrl(websiteDomain, 128));

  // 3. Wikipedia's page image (usually the logo for well-known companies)
  if (wikiImage) push(wikiImage);

  // 4. Naive guess: strip corporate suffix from name → .com
  const guessed = guessDomainFromName(name);
  if (guessed) push(clearbitLogoUrl(guessed, 128));

  return urls;
}

async function fetchBase(id: string): Promise<CompanyDetail | null> {
  const edgar = parseEdgarId(id);
  if (edgar) return edgarDetail(edgar);

  const oc = parseOcId(id);
  if (oc) return opencorporatesDetail(oc.jurisdiction, oc.number);

  const ch = parseChId(id);
  if (ch) return companiesHouseDetail(ch);

  return null;
}

/**
 * Very light heuristic: for well-known single-word brands, guessing
 * `${name}.com` gets us a valid Clearbit logo most of the time.
 * Falls through to null (and hence a nice initials tile) if wrong.
 */
function guessDomainFromName(name: string): string | null {
  const clean = name
    .toLowerCase()
    .replace(/,?\s+(inc\.?|corp\.?|corporation|llc|ltd\.?|limited|plc|s\.?a\.?|holdings|group)\.?$/gi, "")
    .replace(/[^a-z0-9]/g, "");
  if (clean.length < 3 || clean.length > 20) return null;
  return `${clean}.com`;
}
