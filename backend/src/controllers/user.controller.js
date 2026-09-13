import { prisma } from '../prisma/client.js';
import { videoService } from '../services/video.service.js';
import { AppError } from '../utils/app-error.js';
export const userController = {
  favorites: async (req, res) => res.json({ items: await prisma.favorite.findMany({ where: { userId: req.user.id }, include: { video: { include: { category: true } } }, orderBy: { createdAt: 'desc' } }) }),
  addFavorite: async (req, res) => { const { videoId } = req.validated.body; await prisma.favorite.upsert({ where: { userId_videoId: { userId: req.user.id, videoId } }, update: {}, create: { userId: req.user.id, videoId } }); res.status(201).json({ ok: true }); },
  deleteFavorite: async (req, res) => { const result = await prisma.favorite.deleteMany({ where: { id: req.params.id, userId: req.user.id } }); if (!result.count) throw new AppError(404, 'Favorite not found', 'NOT_FOUND'); res.status(204).end(); },
  history: async (req, res) => res.json({ items: await prisma.watchHistory.findMany({ where: { userId: req.user.id }, include: { video: { include: { category: true } } }, orderBy: { updatedAt: 'desc' }, take: 100 }) }),
  saveHistory: async (req, res) => { const data = req.validated.body; await prisma.watchHistory.upsert({ where: { userId_videoId: { userId: req.user.id, videoId: data.videoId } }, update: { currentPosition: data.currentPosition, watchedPercentage: data.watchedPercentage }, create: { ...data, userId: req.user.id } }); res.status(204).end(); },
  view: async (req, res) => { await videoService.recordView(req.params.id, req.user?.id); res.status(204).end(); }
};
