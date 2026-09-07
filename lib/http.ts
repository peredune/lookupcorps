/**
 * Small fetch helper: sensible timeout, JSON default, no throw on 404
 * (returns null so callers can render empty states cleanly).
 */
export async function fetchJson<T = unknown>(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T | null> {
  const { timeoutMs = 10_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(rest.headers ?? {}),
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      console.warn(`[http] timeout: ${url}`);
      return null;
    }
    console.warn(`[http] ${url}: ${(err as Error).message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function secUserAgent(): string {
  const email = process.env.SEC_USER_AGENT_EMAIL || "hello@lookupcorps.dev";
  return `LookupCorps ${email}`;
}
