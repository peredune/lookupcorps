import { fetchJson } from "@/lib/http";
import { cached } from "@/lib/cache";
import type { WikiSummary } from "@/lib/types";

type WikiSummaryResponse = {
  type?: string;
  title?: string;
  displaytitle?: string;
  description?: string;
  extract?: string;
  extract_html?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

type WikiSearchResponse = {
  pages?: Array<{
    id: number;
    key: string;
    title: string;
    excerpt?: string;
    description?: string | null;
    thumbnail?: { url?: string };
  }>;
};

const API_ROOT = "https://en.wikipedia.org/w/rest.php/v1";
const REST_ROOT = "https://en.wikipedia.org/api/rest_v1";

async function findBestPage(name: string): Promise<string | null> {
  const url = `${API_ROOT}/search/page?q=${encodeURIComponent(name)}&limit=3`;
  const data = await fetchJson<WikiSearchResponse>(url);
  if (!data?.pages?.length) return null;
  // Heuristic: prefer results whose description mentions company/corporation/inc
  const hint = /company|corporation|inc\.|holdings|group|technolog|bank|airline|automaker|maker of|manufacturer|retailer|platform|software/i;
  const preferred = data.pages.find((p) => (p.description ?? "").match(hint));
  return (preferred ?? data.pages[0]).key;
}

async function getSummary(pageKey: string): Promise<WikiSummaryResponse | null> {
  const url = `${REST_ROOT}/page/summary/${encodeURIComponent(pageKey)}`;
  return fetchJson<WikiSummaryResponse>(url);
}

/**
 * Best-effort infobox facts — Wikipedia's public REST API only returns the
 * summary text, not structured infobox rows, so we ignore founded/HQ/employee
 * counts for now and rely on the extract prose.
 */
export async function wikipediaSummary(name: string): Promise<WikiSummary | null> {
  if (!name) return null;
  return cached(
    `wiki:${name.toLowerCase()}`,
    async () => {
      const key = await findBestPage(name);
      if (!key) return null;
      const s = await getSummary(key);
      if (!s?.extract) return null;
      const wiki: WikiSummary = {
        extract: s.extract ?? null,
        extractHtml: s.extract_html ?? null,
        imageUrl: s.originalimage?.source ?? s.thumbnail?.source ?? null,
        wikipediaUrl: s.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${key}`,
      };
      return wiki;
    },
    60 * 60 * 24 * 7, // wiki summaries are stable — cache 7 days
  );
}
