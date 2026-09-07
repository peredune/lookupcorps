import { fetchJson } from "@/lib/http";
import { cached } from "@/lib/cache";
import type { CompanyDetail, Officer, SearchHit, CompanyStatus } from "@/lib/types";

type OCSearchResponse = {
  results?: {
    companies?: Array<{
      company: {
        name: string;
        company_number: string;
        jurisdiction_code: string;
        incorporation_date?: string | null;
        dissolution_date?: string | null;
        company_type?: string | null;
        registry_url?: string | null;
        current_status?: string | null;
        opencorporates_url?: string | null;
        registered_address_in_full?: string | null;
      };
    }>;
  };
};

type OCCompanyResponse = {
  results?: {
    company?: {
      name: string;
      company_number: string;
      jurisdiction_code: string;
      incorporation_date?: string | null;
      dissolution_date?: string | null;
      current_status?: string | null;
      registry_url?: string | null;
      opencorporates_url?: string | null;
      registered_address_in_full?: string | null;
      officers?: Array<{
        officer: {
          name: string;
          position?: string | null;
          start_date?: string | null;
          end_date?: string | null;
        };
      }>;
    };
  };
};

const ROOT = "https://api.opencorporates.com/v0.4";

function tokenParam(): string {
  const t = process.env.OPENCORPORATES_API_TOKEN;
  return t ? `&api_token=${encodeURIComponent(t)}` : "";
}

function statusFromString(s: string | null | undefined): CompanyStatus {
  if (!s) return "unknown";
  const low = s.toLowerCase();
  if (low.includes("active")) return "active";
  if (low.includes("dissolv") || low.includes("terminated") || low.includes("removed"))
    return "dissolved";
  if (low.includes("inactive") || low.includes("suspended")) return "inactive";
  return "unknown";
}

const JURIS_LABELS: Record<string, string> = {
  us: "United States",
  gb: "United Kingdom",
  ca: "Canada",
  au: "Australia",
  fr: "France",
  de: "Germany",
  nl: "Netherlands",
  ie: "Ireland",
  sg: "Singapore",
  hk: "Hong Kong",
  jp: "Japan",
  in: "India",
  br: "Brazil",
  mx: "Mexico",
};

function labelForJurisdiction(code: string | null | undefined): string | null {
  if (!code) return null;
  const [country, region] = code.split("_");
  const base = JURIS_LABELS[country] ?? country.toUpperCase();
  return region ? `${base} (${region.toUpperCase()})` : base;
}

export function ocId(jurisdiction: string, number: string): string {
  return `oc-${jurisdiction}-${number.replace(/\s+/g, "")}`;
}

export function parseOcId(id: string): { jurisdiction: string; number: string } | null {
  if (!id.startsWith("oc-")) return null;
  const rest = id.slice(3);
  const idx = rest.indexOf("-");
  if (idx <= 0) return null;
  return { jurisdiction: rest.slice(0, idx), number: rest.slice(idx + 1) };
}

export async function opencorporatesSearch(
  query: string,
  limit = 12,
): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  return cached(
    `oc:search:${q.toLowerCase()}:${limit}`,
    async () => {
      const url = `${ROOT}/companies/search?q=${encodeURIComponent(q)}&per_page=${limit}&order=score${tokenParam()}`;
      const data = await fetchJson<OCSearchResponse>(url, { timeoutMs: 8_000 });
      const companies = data?.results?.companies ?? [];
      return companies
        .filter((row) => row?.company?.name && row.company.jurisdiction_code && row.company.company_number)
        .map(({ company: c }) => ({
          id: ocId(c.jurisdiction_code, c.company_number),
          name: c.name,
          jurisdiction: c.jurisdiction_code,
          jurisdictionLabel: labelForJurisdiction(c.jurisdiction_code),
          status: statusFromString(c.current_status),
          companyNumber: c.company_number,
          snippet: c.registered_address_in_full ?? c.company_type ?? null,
          source: "opencorporates" as const,
        }));
    },
    60 * 60, // 1h — search results can shift as OC re-indexes
  );
}

export async function opencorporatesDetail(
  jurisdiction: string,
  number: string,
): Promise<CompanyDetail | null> {
  return cached(
    `oc:detail:${jurisdiction}:${number}`,
    async () => {
      const url = `${ROOT}/companies/${jurisdiction}/${encodeURIComponent(number)}?${tokenParam().slice(1)}`;
      const data = await fetchJson<OCCompanyResponse>(url, { timeoutMs: 10_000 });
      const c = data?.results?.company;
      if (!c) return null;
      const officers: Officer[] = (c.officers ?? []).slice(0, 20).map((o) => ({
        name: o.officer.name,
        role: o.officer.position ?? null,
        appointedOn: o.officer.start_date ?? null,
        resignedOn: o.officer.end_date ?? null,
      }));
      return {
        id: ocId(jurisdiction, number),
        name: c.name,
        jurisdiction: c.jurisdiction_code,
        jurisdictionLabel: labelForJurisdiction(c.jurisdiction_code),
        status: statusFromString(c.current_status),
        companyNumber: c.company_number,
        incorporationDate: c.incorporation_date ?? null,
        address: c.registered_address_in_full ?? null,
        officers,
        filings: [],
        sources: ["OpenCorporates"],
      };
    },
    60 * 60 * 24,
  );
}
