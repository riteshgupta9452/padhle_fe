import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import publicRoutes from './routes/public.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFound } from './middleware/error.js';
export function createApp() { const app = express(); app.set('trust proxy', 1); app.use((req, res, next) => { req.id = req.headers['x-request-id'] || randomUUID(); res.setHeader('x-request-id', req.id); next(); }); app.use(pinoHttp({ logger })); app.use(helmet({ crossOriginResourcePolicy: false })); app.use(cors({ origin: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : false, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] })); app.use(hpp()); app.use(express.json({ limit: '1mb' })); app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false })); app.get('/health', (req, res) => res.json({ status: 'ok' })); app.use('/api', publicRoutes); app.use('/api', userRoutes); app.use('/api/admin', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), adminRoutes); app.use(notFound); app.use(errorHandler); return app; }
