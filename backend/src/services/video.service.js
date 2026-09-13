import { prisma } from '../prisma/client.js';
import { cache } from '../config/redis.js';
import { videoRepository } from '../repositories/video.repository.js';
import { AppError } from '../utils/app-error.js';
const keys = { featured: 'videos:featured', trending: 'videos:trending', home: 'videos:home' };
export const videoService = {
  async list({ page, limit, categoryId, q }) { const where = { status: 'READY', ...(categoryId && { categoryId }), ...(q && { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }) }; const [items, total] = await videoRepository.list(where, (page - 1) * limit, limit); return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } }; },
  async featured() { const hit = await cache.get(keys.featured); if (hit) return hit; const videos = await prisma.video.findMany({ where: { status: 'READY', featured: true }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: 20 }); await cache.set(keys.featured, videos, 300); return videos; },
  async trending() { const hit = await cache.get(keys.trending); if (hit) return hit; const videos = await videoRepository.trending(); await cache.set(keys.trending, videos, 300); return videos; },
  async details(id, userId) { const video = await videoRepository.findReady(id); if (!video) throw new AppError(404, 'Video not found', 'VIDEO_NOT_FOUND'); const history = userId ? await prisma.watchHistory.findUnique({ where: { userId_videoId: { userId, videoId: id } } }) : null; return { ...video, resumePosition: history?.currentPosition ?? 0 }; },
  async invalidate() { await Promise.all([cache.delPattern('videos:*'), cache.delPattern('categories:*'), cache.delPattern('search:*')]); },
  async recordView(videoId, userId) { await prisma.$transaction([prisma.videoView.create({ data: { videoId, userId } }), videoRepository.incrementViews(videoId)]); await cache.delPattern('videos:trending*'); },
  async analytics() { const [totalViews, videos, users] = await Promise.all([prisma.videoView.count(), prisma.video.findMany({ orderBy: { views: 'desc' }, take: 10, select: { id: true, title: true, views: true } }), prisma.user.count()]); return { totalViews, users, topVideos: videos }; }
};
