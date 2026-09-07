import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";

const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 24h

type CacheDriver = {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  driver: "upstash" | "memory";
};

// ---------- In-memory LRU (Node-scoped, per-process) ----------

const lru = new LRUCache<string, unknown>({
  max: 1000,
  ttl: DEFAULT_TTL_SECONDS * 1000,
  updateAgeOnGet: false,
});

const memoryDriver: CacheDriver = {
  driver: "memory",
  async get<T>(key: string) {
    const v = lru.get(key);
    return (v as T | undefined) ?? null;
  },
  async set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
    lru.set(key, value, { ttl: ttlSeconds * 1000 });
  },
};

// ---------- Upstash Redis driver ----------

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redisClient = new Redis({ url, token });
  return redisClient;
}

const upstashDriver: CacheDriver = {
  driver: "upstash",
  async get<T>(key: string) {
    const r = getRedis();
    if (!r) return null;
    try {
      const v = await r.get<T>(key);
      return v ?? null;
    } catch (err) {
      console.warn("[cache] Upstash get failed, falling back:", (err as Error).message);
      return null;
    }
  },
  async set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const r = getRedis();
    if (!r) return;
    try {
      await r.set(key, value, { ex: ttlSeconds });
    } catch (err) {
      console.warn("[cache] Upstash set failed:", (err as Error).message);
    }
  },
};

function pickDriver(): CacheDriver {
  return process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? upstashDriver
    : memoryDriver;
}

/**
 * cached() — run a loader and memoize its result under `key` for `ttl` seconds.
 * Uses Upstash if configured, otherwise falls back to in-process LRU.
 */
export async function cached<T>(
  key: string,
  loader: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<T> {
  const driver = pickDriver();
  const existing = await driver.get<T>(key);
  if (existing !== null && existing !== undefined) return existing;
  const fresh = await loader();
  // don't cache empty responses too aggressively
  if (fresh !== null && fresh !== undefined) {
    await driver.set(key, fresh, ttlSeconds);
  }
  return fresh;
}

export function cacheDriverName(): "upstash" | "memory" {
  return pickDriver().driver;
}
