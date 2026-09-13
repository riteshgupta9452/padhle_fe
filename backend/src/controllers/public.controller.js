import { videoService } from '../services/video.service.js';
import { categoryService } from '../services/category.service.js';
export const publicController = {
  listVideos: async (req, res) => res.json(await videoService.list({ ...req.validated.query, categoryId: req.query.categoryId, q: req.query.q })),
  video: async (req, res) => res.json(await videoService.details(req.params.id, req.user?.id)),
  featured: async (req, res) => res.json({ items: await videoService.featured() }),
  trending: async (req, res) => res.json({ items: await videoService.trending() }),
  categories: async (req, res) => res.json({ items: await categoryService.list() }),
  search: async (req, res) => res.json(await videoService.list({ page: Number(req.query.page || 1), limit: Number(req.query.limit || 20), q: req.query.q }))
};
