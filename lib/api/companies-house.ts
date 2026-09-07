import { fetchJson } from "@/lib/http";
import { cached } from "@/lib/cache";
import type { CompanyDetail, Filing, Officer, SearchHit, CompanyStatus } from "@/lib/types";

const ROOT = "https://api.company-information.service.gov.uk";

function authHeader(): Record<string, string> | null {
  const key = process.env.COMPANIES_HOUSE_API_KEY;
  if (!key) return null;
  const encoded = Buffer.from(`${key}:`).toString("base64");
  return { Authorization: `Basic ${encoded}` };
}

function statusFromString(s: string | null | undefined): CompanyStatus {
  if (!s) return "unknown";
  const low = s.toLowerCase();
  if (low === "active") return "active";
  if (low.includes("dissolved") || low.includes("removed")) return "dissolved";
  return "inactive";
}

export function chId(number: string): string {
  return `gb-${number.replace(/\s+/g, "")}`;
}
export function parseChId(id: string): string | null {
  return id.startsWith("gb-") ? id.slice(3) : null;
}

type CHSearch = {
  items?: Array<{
    company_name: string;
    company_number: string;
    company_status?: string;
    address_snippet?: string;
    date_of_creation?: string;
    company_type?: string;
  }>;
};

export async function companiesHouseSearch(
  query: string,
  limit = 8,
): Promise<SearchHit[]> {
  const q = query.trim();
  const headers = authHeader();
  if (!q || !headers) return [];
  return cached(
    `ch:search:${q.toLowerCase()}:${limit}`,
    async () => {
      const url = `${ROOT}/search/companies?q=${encodeURIComponent(q)}&items_per_page=${limit}`;
      const data = await fetchJson<CHSearch>(url, { headers, timeoutMs: 8_000 });
      return (data?.items ?? []).map((i) => ({
        id: chId(i.company_number),
        name: i.company_name,
        jurisdiction: "gb",
        jurisdictionLabel: "United Kingdom",
        status: statusFromString(i.company_status),
        companyNumber: i.company_number,
        snippet: i.address_snippet ?? i.company_type ?? null,
        source: "companies-house" as const,
      }));
    },
    60 * 60,
  );
}

type CHCompany = {
  company_name: string;
  company_number: string;
  company_status?: string;
  date_of_creation?: string;
  jurisdiction?: string;
  registered_office_address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  sic_codes?: string[];
};

type CHOfficers = {
  items?: Array<{
    name: string;
    officer_role?: string;
    appointed_on?: string;
    resigned_on?: string;
  }>;
};

type CHFilingHistory = {
  items?: Array<{
    transaction_id?: string;
    date?: string;
    type?: string;
    description?: string;
    category?: string;
    links?: { self?: string };
  }>;
};

function formatAddress(a: CHCompany["registered_office_address"]): string | null {
  if (!a) return null;
  return [a.address_line_1, a.address_line_2, a.locality, a.postal_code, a.country]
    .filter(Boolean)
    .join(", ") || null;
}

export async function companiesHouseDetail(
  number: string,
): Promise<CompanyDetail | null> {
  const headers = authHeader();
  if (!headers) return null;
  return cached(
    `ch:detail:${number}`,
    async () => {
      const [company, officersRes, filingsRes] = await Promise.all([
        fetchJson<CHCompany>(`${ROOT}/company/${encodeURIComponent(number)}`, {
          headers,
          timeoutMs: 8_000,
        }),
        fetchJson<CHOfficers>(
          `${ROOT}/company/${encodeURIComponent(number)}/officers?items_per_page=20`,
          { headers, timeoutMs: 8_000 },
        ),
        fetchJson<CHFilingHistory>(
          `${ROOT}/company/${encodeURIComponent(number)}/filing-history?items_per_page=20`,
          { headers, timeoutMs: 8_000 },
        ),
      ]);
      if (!company) return null;

      const officers: Officer[] = (officersRes?.items ?? []).map((o) => ({
        name: o.name,
        role: o.officer_role ?? null,
        appointedOn: o.appointed_on ?? null,
        resignedOn: o.resigned_on ?? null,
      }));

      const filings: Filing[] = (filingsRes?.items ?? []).map((f, idx) => ({
        id: f.transaction_id ?? `${number}-${idx}`,
        title: f.description ?? f.type ?? "Filing",
        date: f.date ?? "",
        form: f.type ?? null,
        url: f.links?.self ? `https://find-and-update.company-information.service.gov.uk${f.links.self}` : null,
        source: "companies-house" as const,
      })).filter((f) => f.date);

      return {
        id: chId(number),
        name: company.company_name,
        jurisdiction: company.jurisdiction ?? "gb",
        jurisdictionLabel: "United Kingdom",
        status: statusFromString(company.company_status),
        companyNumber: company.company_number,
        incorporationDate: company.date_of_creation ?? null,
        address: formatAddress(company.registered_office_address),
        officers,
        filings,
        sources: ["Companies House"],
      };
    },
    60 * 60 * 24,
  );
}
