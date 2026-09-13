# Deployment guide

1. Create PostgreSQL, Redis, an R2 bucket, and a Cloudflare custom domain that points at the bucket. Set `CDN_BASE_URL` to that domain.
2. Create a least-privilege R2 API token (object read/write only for the bucket) and a Firebase service account. Put the compact JSON in `FIREBASE_SERVICE_ACCOUNT_JSON` through your secret manager.
3. Copy `backend/.env.example` to `backend/.env`, replace every secret, then run `docker compose -f backend/docker-compose.yml up --build`.
4. Run migrations in CI or let the API startup command run `prisma migrate deploy`. Never use `prisma db push` in production.
5. Terminate TLS at Cloudflare or a managed load balancer. Restrict `CORS_ORIGINS`, use long random JWT secrets, back up PostgreSQL, and monitor API/FFmpeg failures and `FAILED` video records.

For horizontally scaled production, separate API and a BullMQ video worker, mount ephemeral worker storage, and run at least two API replicas. Object delivery must remain direct from Cloudflare CDN, never proxied through Express.
