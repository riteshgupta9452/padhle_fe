import { prisma } from '../prisma/client.js';
import { authService } from '../services/auth.service.js';
import { videoRepository } from '../repositories/video.repository.js';
import { videoService } from '../services/video.service.js';
import { categoryService } from '../services/category.service.js';
import { processVideo } from '../jobs/video.job.js';
import { AppError } from '../utils/app-error.js';
export const adminController = {
  login: async (req, res) => res.json(await authService.adminLogin(req.validated.body.email, req.validated.body.password)),
  upload: async (req, res) => { if (!req.file) throw new AppError(400, 'A video file is required', 'VIDEO_REQUIRED'); const { title, description, categoryId, featured } = req.body; if (!title || !categoryId) throw new AppError(422, 'title and categoryId are required', 'VALIDATION_ERROR'); const category = await prisma.category.findUnique({ where: { id: categoryId } }); if (!category) throw new AppError(422, 'Invalid category', 'VALIDATION_ERROR'); const video = await videoRepository.create({ title, description, categoryId, featured: featured === 'true', status: 'PROCESSING' }); void processVideo({ videoId: video.id, filePath: req.file.path }); res.status(202).json({ data: video, message: 'Video accepted for processing' }); },
  updateVideo: async (req, res) => { const video = await videoRepository.update(req.params.id, req.validated.body); await videoService.invalidate(); res.json({ data: video }); },
  deleteVideo: async (req, res) => { await videoRepository.remove(req.params.id); await videoService.invalidate(); res.status(204).end(); },
  createCategory: async (req, res) => { const data = await prisma.category.create({ data: req.validated.body }); await categoryService.invalidate(); res.status(201).json({ data }); },
  updateCategory: async (req, res) => { const data = await prisma.category.update({ where: { id: req.params.id }, data: req.validated.body }); await categoryService.invalidate(); await videoService.invalidate(); res.json({ data }); },
  deleteCategory: async (req, res) => { await prisma.category.delete({ where: { id: req.params.id } }); await categoryService.invalidate(); await videoService.invalidate(); res.status(204).end(); },
  analytics: async (req, res) => res.json(await videoService.analytics())
};
