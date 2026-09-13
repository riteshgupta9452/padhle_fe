import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(), REDIS_URL: z.string().url(), JWT_SECRET: z.string().min(32), JWT_EXPIRES_IN: z.string().default('15m'),
  CORS_ORIGINS: z.string().default(''), R2_ACCOUNT_ID: z.string().optional(), R2_ACCESS_KEY_ID: z.string().optional(), R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(), CDN_BASE_URL: z.string().url().optional(), FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(), UPLOAD_MAX_BYTES: z.coerce.number().positive().default(2147483648)
});
export const env = schema.parse(process.env);
