import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';
export const redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 2, enableReadyCheck: true, lazyConnect: false });
redis.on('error', (error) => logger.error({ error }, 'Redis error'));
export const cache = {
  async get(key) { const raw = await redis.get(key); return raw ? JSON.parse(raw) : null; },
  set(key, value, seconds = 300) { return redis.set(key, JSON.stringify(value), 'EX', seconds); },
  async delPattern(pattern) { let cursor = '0'; do { const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100); cursor = next; if (keys.length) await redis.del(...keys); } while (cursor !== '0'); }
};
