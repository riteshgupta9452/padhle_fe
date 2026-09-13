import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './prisma/client.js';
import { redis } from './config/redis.js';
import { initializeFirebase } from './config/firebase.js';
import { logger } from './config/logger.js';
if (env.FIREBASE_SERVICE_ACCOUNT_JSON) initializeFirebase();
const server = createApp().listen(env.PORT, () => logger.info({ port: env.PORT }, 'API listening'));
async function shutdown(signal) { logger.info({ signal }, 'Shutting down'); server.close(async () => { await Promise.all([prisma.$disconnect(), redis.quit()]); process.exit(0); }); }
process.on('SIGTERM', () => shutdown('SIGTERM')); process.on('SIGINT', () => shutdown('SIGINT'));
