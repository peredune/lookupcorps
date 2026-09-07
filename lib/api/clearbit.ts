import { domainFromWebsite } from "@/lib/utils";

/** No key required. Falls back gracefully — the URL is a redirect so a 404 shows the placeholder client-side. */
export function clearbitLogoUrl(
  websiteOrDomain: string | null | undefined,
  size = 128,
): string | null {
  const domain = domainFromWebsite(websiteOrDomain ?? "");
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}?size=${size}`;
}
