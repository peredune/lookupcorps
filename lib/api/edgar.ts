import { fetchJson, secUserAgent } from "@/lib/http";
import { cached } from "@/lib/cache";
import type { CompanyDetail, Filing, Officer, SearchHit } from "@/lib/types";
import { slugify } from "@/lib/utils";

// SEC returns ticker-list as { "0": {cik_str, ticker, title}, "1": {...}, ... }
type TickerRow = { cik_str: number; ticker: string; title: string };
type TickerFile = Record<string, TickerRow>;

const TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";

function pad10(n: number | string): string {
  return String(n).padStart(10, "0");
}

async function loadTickers(): Promise<TickerRow[]> {
  return cached(
    "edgar:tickers",
    async () => {
      const data = await fetchJson<TickerFile>(TICKERS_URL, {
        headers: { "User-Agent": secUserAgent() },
        timeoutMs: 12_000,
      });
      if (!data) return [];
      return Object.values(data);
    },
    60 * 60 * 24, // 1 day
  );
}

export async function edgarSearch(query: string, limit = 8): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const rows = await loadTickers();

  const scored = rows
    .map((r) => {
      const name = r.title;
      const nameLower = name.toLowerCase();
      const tickerLower = r.ticker.toLowerCase();
      let score = 0;
      if (tickerLower === q) score += 100;
      else if (tickerLower.startsWith(q)) score += 60;
      if (nameLower === q) score += 90;
      else if (nameLower.startsWith(q)) score += 50;
      else if (nameLower.includes(q)) score += 20;
      return { r, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ r }) => ({
    id: edgarId(r.ticker),
    name: r.title,
    ticker: r.ticker,
    cik: pad10(r.cik_str),
    jurisdiction: "us",
    jurisdictionLabel: "United States",
    status: "active",
    snippet: "US public company · SEC EDGAR",
    source: "edgar",
  }));
}

export function edgarId(ticker: string): string {
  return `us-${ticker.toLowerCase()}`;
}

export function parseEdgarId(id: string): string | null {
  if (!id.startsWith("us-")) return null;
  return id.slice(3).toUpperCase();
}

type SubmissionsResponse = {
  cik?: string;
  entityType?: string;
  sic?: string;
  sicDescription?: string;
  name?: string;
  tickers?: string[];
  exchanges?: string[];
  ein?: string;
  description?: string;
  website?: string;
  category?: string;
  fiscalYearEnd?: string;
  stateOfIncorporation?: string;
  addresses?: {
    business?: { street1?: string; city?: string; stateOrCountry?: string; zipCode?: string };
    mailing?: { street1?: string; city?: string; stateOrCountry?: string; zipCode?: string };
  };
  formerNames?: Array<{ name: string; from: string; to: string }>;
  filings?: {
    recent?: {
      accessionNumber?: string[];
      form?: string[];
      filingDate?: string[];
      reportDate?: string[];
      primaryDocument?: string[];
      primaryDocDescription?: string[];
    };
  };
};

async function fetchSubmissions(cik: string): Promise<SubmissionsResponse | null> {
  const url = `https://data.sec.gov/submissions/CIK${pad10(cik)}.json`;
  return fetchJson<SubmissionsResponse>(url, {
    headers: { "User-Agent": secUserAgent() },
    timeoutMs: 12_000,
  });
}

export async function edgarDetail(ticker: string): Promise<CompanyDetail | null> {
  const rows = await loadTickers();
  const row = rows.find((r) => r.ticker.toLowerCase() === ticker.toLowerCase());
  if (!row) return null;

  return cached(
    `edgar:detail:${row.ticker}`,
    async () => {
      const s = await fetchSubmissions(pad10(row.cik_str));
      if (!s) {
        // Even without submissions, return the ticker-level shell so the page renders.
        return baseFromTickerRow(row);
      }
      const filings: Filing[] = [];
      const recent = s.filings?.recent;
      if (recent?.form && recent.filingDate && recent.accessionNumber) {
        for (let i = 0; i < Math.min(recent.form.length, 20); i++) {
          const acc = recent.accessionNumber[i]?.replace(/-/g, "");
          const primary = recent.primaryDocument?.[i];
          const form = recent.form[i];
          filings.push({
            id: `${row.ticker}-${recent.accessionNumber[i]}`,
            title: recent.primaryDocDescription?.[i] || `${form} filing`,
            date: recent.filingDate[i],
            form,
            url:
              acc && primary
                ? `https://www.sec.gov/Archives/edgar/data/${row.cik_str}/${acc}/${primary}`
                : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${pad10(row.cik_str)}&type=${form}`,
            source: "edgar",
          });
        }
      }

      const addr = s.addresses?.business ?? s.addresses?.mailing;
      const address = addr
        ? [addr.street1, addr.city, addr.stateOrCountry, addr.zipCode]
            .filter(Boolean)
            .join(", ") || null
        : null;

      // SEC submissions doesn't expose officers directly; we surface the entity's
      // former names and industry as auxiliary signals but keep officers empty here.
      const officers: Officer[] = [];

      const detail: CompanyDetail = {
        id: edgarId(row.ticker),
        name: s.name || row.title,
        jurisdiction: s.stateOfIncorporation ? `us-${s.stateOfIncorporation.toLowerCase()}` : "us",
        jurisdictionLabel: s.stateOfIncorporation
          ? `United States (${s.stateOfIncorporation})`
          : "United States",
        status: "active",
        companyNumber: pad10(row.cik_str),
        cik: pad10(row.cik_str),
        ticker: row.ticker,
        address,
        website: s.website || null,
        officers,
        filings,
        sources: ["SEC EDGAR"],
      };
      return detail;
    },
    60 * 60 * 6, // 6h
  );
}

function baseFromTickerRow(row: TickerRow): CompanyDetail {
  return {
    id: edgarId(row.ticker),
    name: row.title,
    jurisdiction: "us",
    jurisdictionLabel: "United States",
    status: "active",
    cik: pad10(row.cik_str),
    ticker: row.ticker,
    officers: [],
    filings: [],
    sources: ["SEC EDGAR"],
  };
}

export function edgarSlugForName(name: string): string {
  return `us-${slugify(name)}`;
}
