// Unified types across data sources so components don't have to think about origin.

export type CompanyStatus = "active" | "dissolved" | "inactive" | "unknown";

export type SearchHit = {
  id: string; // canonical id used in /company/[id] URLs
  name: string;
  jurisdiction?: string | null; // e.g. "United States", "United Kingdom", "us_de"
  jurisdictionLabel?: string | null;
  status: CompanyStatus;
  ticker?: string | null;
  cik?: string | null; // SEC identifier
  companyNumber?: string | null; // registry number
  snippet?: string | null;
  domain?: string | null;
  source: "opencorporates" | "edgar" | "companies-house" | "curated";
};

export type Officer = {
  name: string;
  role?: string | null;
  appointedOn?: string | null;
  resignedOn?: string | null;
};

export type Filing = {
  id: string;
  title: string;
  date: string; // ISO
  form?: string | null;
  url?: string | null;
  source: "edgar" | "companies-house";
};

export type PublicSnapshot = {
  ticker: string;
  exchange?: string | null;
  price?: number | null;
  currency?: string | null;
  changePct?: number | null;
  marketCap?: number | null;
  peRatio?: number | null;
  weekHigh52?: number | null;
  weekLow52?: number | null;
  updatedAt?: string | null;
};

export type WikiSummary = {
  extract?: string | null;
  extractHtml?: string | null;
  founded?: string | null;
  hq?: string | null;
  employees?: string | null;
  industry?: string | null;
  website?: string | null;
  wikipediaUrl?: string | null;
  imageUrl?: string | null;
};

export type NewsItem = {
  title: string;
  url: string;
  source?: string | null;
  publishedAt?: string | null;
};

export type CompanyDetail = {
  id: string;
  name: string;
  jurisdiction?: string | null;
  jurisdictionLabel?: string | null;
  status: CompanyStatus;
  companyNumber?: string | null;
  incorporationDate?: string | null;
  address?: string | null;
  domain?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  ticker?: string | null;
  cik?: string | null;
  /** Ordered list of logo URLs to try; the first that loads wins. */
  logoCandidates?: string[];
  officers: Officer[];
  filings: Filing[];
  publicSnapshot?: PublicSnapshot | null;
  wiki?: WikiSummary | null;
  news?: NewsItem[];
  sources: string[]; // human-readable list of contributing sources
};
