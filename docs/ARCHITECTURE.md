# System architecture

Flutter (Riverpod, Dio, GoRouter) calls an Express REST API through Nginx. Firebase authenticates end users; the API verifies Firebase ID tokens and maps them to PostgreSQL users. Admins use short-lived, API-issued JWTs after bcrypt password verification. Only the `/api/admin/videos` route accepts a multipart upload and it requires an admin role.

```text
Flutter ──HTTPS──> Nginx ──> Express ──> PostgreSQL
                              ├──> Redis (cache)
                              ├──> Firebase Admin (token / FCM)
                              └──> FFmpeg ──> Cloudflare R2 ──> Cloudflare CDN ──> HLS player
```

Upload processing is deliberately asynchronous: a video enters `PROCESSING`, FFmpeg creates four HLS variants and a thumbnail, R2 receives immutable assets, then the record becomes `READY`. A worker queue (BullMQ) is the recommended next deployment step for durable, multi-replica jobs; the current in-process job is appropriate for a single API worker and has an explicit status model.

Redis keys are namespaced (`videos:*`, `categories:*`, `search:*`). Any video/category mutation invalidates affected namespaces; TTLs provide protection if invalidation is missed. CDN playlists use a short cache; segments, thumbnails, and versioned media use one-year immutable caching.

PostgreSQL tables and important constraints/indexes are defined in `backend/prisma/schema.prisma`. Prisma maps all database names to the requested snake_case schema.
