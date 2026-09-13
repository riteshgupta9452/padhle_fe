import { rm } from 'node:fs/promises';
import { prisma } from '../prisma/client.js';
import { transcodeAndUpload } from '../services/transcode.service.js';
import { videoService } from '../services/video.service.js';
import { logger } from '../config/logger.js';
export async function processVideo({ videoId, filePath }) { try { const output = await transcodeAndUpload(filePath, videoId); await prisma.video.update({ where: { id: videoId }, data: { ...output, status: 'READY' } }); await videoService.invalidate(); } catch (error) { logger.error({ error, videoId }, 'Video processing failed'); await prisma.video.update({ where: { id: videoId }, data: { status: 'FAILED' } }); } finally { await rm(filePath, { force: true }); } }
