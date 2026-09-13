import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';
export const authService = { async adminLogin(email, password) { const admin = await prisma.admin.findUnique({ where: { email } }); if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS'); const token = jwt.sign({ sub: admin.id, role: admin.role, type: 'admin' }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN, issuer: 'padhle-api', audience: 'padhle-admin' }); return { token, admin: { id: admin.id, email: admin.email, role: admin.role } }; } };
