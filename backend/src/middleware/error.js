import { AppError } from '../utils/app-error.js';
import { logger } from '../config/logger.js';
export function notFound(req, res) { res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` } }); }
export function errorHandler(error, req, res, next) { const known = error instanceof AppError; const status = known ? error.status : error.name === 'ZodError' ? 422 : 500; if (!known && error.name !== 'ZodError') logger.error({ error, requestId: req.id }, 'Unhandled request error'); res.status(status).json({ error: { code: known ? error.code : error.name === 'ZodError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR', message: known || error.name === 'ZodError' ? error.message : 'An unexpected error occurred', requestId: req.id } }); }
