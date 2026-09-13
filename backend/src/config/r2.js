import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { env } from './env.js';
const configured = Boolean(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET);
export const r2 = configured ? new S3Client({ region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY } }) : null;
export async function uploadObject(key, body, contentType, cacheControl = 'public, max-age=31536000, immutable') {
  if (!r2) throw new Error('Cloudflare R2 is not configured');
  await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: key, Body: body, ContentType: contentType, CacheControl: cacheControl }));
  return `${env.CDN_BASE_URL.replace(/\/$/, '')}/${key}`;
}
export async function deletePrefix(prefix) { if (!r2) return; await r2.send(new DeleteObjectsCommand({ Bucket: env.R2_BUCKET, Delete: { Objects: [{ Key: prefix }] } })); }
