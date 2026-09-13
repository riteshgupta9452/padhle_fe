import { z } from 'zod';
const uuid = z.string().uuid();
export const pagination = z.object({ query: z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(20) }) });
export const categoryInput = z.object({ body: z.object({ name: z.string().trim().min(2).max(80), image: z.string().url().optional() }) });
export const videoUpdate = z.object({ params: z.object({ id: uuid }), body: z.object({ title: z.string().trim().min(2).max(200).optional(), description: z.string().max(5000).nullable().optional(), categoryId: uuid.optional(), featured: z.boolean().optional(), status: z.enum(['READY', 'ARCHIVED']).optional() }) });
export const favoriteInput = z.object({ body: z.object({ videoId: uuid }) });
export const historyInput = z.object({ body: z.object({ videoId: uuid, currentPosition: z.number().int().min(0), watchedPercentage: z.number().min(0).max(100) }) });
export const adminLogin = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8).max(128) }) });
