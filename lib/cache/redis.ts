import { Redis } from "@upstash/redis";
import { logger } from "@/lib/utils/logger";

// Guard against missing env vars -- create Redis client only if configured
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

interface CacheConfig {
  ttl: number; // Time to live in seconds
}

export class Cache {
  get isAvailable(): boolean {
    return redis !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      logger.error("Cache get error", {
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  async set<T>(key: string, value: T, config: CacheConfig): Promise<void> {
    if (!redis) return;
    try {
      await redis.set(key, value, { ex: config.ttl });
    } catch (error) {
      logger.error("Cache set error", {
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async delete(key: string): Promise<void> {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch (error) {
      logger.error("Cache delete error", {
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!redis) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error("Cache delete pattern error", {
        pattern,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const cache = new Cache();
