import { fetchJson } from "@/lib/http";
import { cached } from "@/lib/cache";
import type { PublicSnapshot } from "@/lib/types";

const ROOT = "https://finnhub.io/api/v1";

function tokenParam(): string | null {
  const t = process.env.FINNHUB_API_KEY;
  return t ? `token=${encodeURIComponent(t)}` : null;
}

type Quote = {
  c?: number; // current
  d?: number; // change
  dp?: number; // change percent
  h?: number; // high (day)
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
};

type Profile = {
  name?: string;
  ticker?: string;
  exchange?: string;
  currency?: string;
  marketCapitalization?: number; // millions
  weburl?: string;
  logo?: string;
  finnhubIndustry?: string;
};

type MetricResponse = {
  metric?: {
    "peBasicExclExtraTTM"?: number;
    "peInclExtraTTM"?: number;
    "peNormalizedAnnual"?: number;
    "52WeekHigh"?: number;
    "52WeekLow"?: number;
  };
};

export async function finnhubSnapshot(
  ticker: string,
): Promise<PublicSnapshot | null> {
  const token = tokenParam();
  if (!token) return null;
  return cached(
    `finnhub:snapshot:${ticker.toUpperCase()}`,
    async () => {
      const [quote, profile, metric] = await Promise.all([
        fetchJson<Quote>(`${ROOT}/quote?symbol=${ticker}&${token}`, { timeoutMs: 6_000 }),
        fetchJson<Profile>(`${ROOT}/stock/profile2?symbol=${ticker}&${token}`, { timeoutMs: 6_000 }),
        fetchJson<MetricResponse>(`${ROOT}/stock/metric?symbol=${ticker}&metric=all&${token}`, { timeoutMs: 6_000 }),
      ]);
      // Finnhub returns c=0 for unknown tickers rather than 404, so guard on that.
      if (!quote || !quote.c || quote.c === 0) return null;
      const m = metric?.metric ?? {};
      const marketCap = profile?.marketCapitalization
        ? profile.marketCapitalization * 1_000_000
        : null;
      const snap: PublicSnapshot = {
        ticker: ticker.toUpperCase(),
        exchange: profile?.exchange ?? null,
        price: quote.c ?? null,
        currency: profile?.currency ?? "USD",
        changePct: quote.dp ?? null,
        marketCap,
        peRatio:
          m.peBasicExclExtraTTM ??
          m.peInclExtraTTM ??
          m.peNormalizedAnnual ??
          null,
        weekHigh52: m["52WeekHigh"] ?? null,
        weekLow52: m["52WeekLow"] ?? null,
        updatedAt: quote.t ? new Date(quote.t * 1000).toISOString() : null,
      };
      return snap;
    },
    60 * 15, // 15 min — price data
  );
}
