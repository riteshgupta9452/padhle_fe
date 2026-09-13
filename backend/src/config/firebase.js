import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { env } from './env.js';
export function initializeFirebase() { if (getApps().length) return; const credential = env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON)) : applicationDefault(); initializeApp({ credential }); }
