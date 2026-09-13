import { prisma } from '../prisma/client.js';
import { cache } from '../config/redis.js';
export const categoryService = { async list() { const key = 'categories:all'; const hit = await cache.get(key); if (hit) return hit; const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { videos: { where: { status: 'READY' } } } } } }); await cache.set(key, categories, 3600); return categories; }, async invalidate() { await cache.delPattern('categories:*'); } };
