import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
const upload = multer({ storage: multer.diskStorage({ destination: '/tmp/padhle/uploads', filename: (req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: env.UPLOAD_MAX_BYTES, files: 1 }, fileFilter: (req, file, cb) => file.mimetype.startsWith('video/') ? cb(null, true) : cb(new AppError(415, 'Only video files are accepted', 'UNSUPPORTED_MEDIA')) });
export const videoUpload = upload.single('video');
