# API

Base path: `/api`. Responses use JSON; error responses are `{ "error": { "code", "message", "requestId" } }`. Send `Authorization: Bearer <Firebase ID token>` for user routes and an admin JWT for admin routes.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/videos?page=1&limit=20&categoryId=&q=` | public | Ready videos |
| GET | `/videos/:id` | public | Video details/resume position |
| GET | `/videos/featured`, `/videos/trending` | public | Curated/feed lists |
| GET | `/videos/category/:id` | public | Category feed |
| GET | `/search?q=` | public | Title/description search |
| GET | `/categories` | public | Categories |
| GET/POST/DELETE | `/favorites`, `/favorites/:id` | Firebase | Favorites |
| GET/POST | `/history` | Firebase | Watch progress |
| POST | `/videos/:id/view` | Firebase | View event |
| POST | `/admin/login` | public | `{email,password}` → admin JWT |
| POST | `/admin/videos` | admin | multipart `video`, `title`, `categoryId`, optional description/featured |
| PUT/DELETE | `/admin/videos/:id` | admin | Metadata/lifecycle |
| POST/PUT/DELETE | `/admin/categories[/:id]` | admin | Category management |
| GET | `/admin/analytics` | admin | Views, users, top videos |

`POST /admin/videos` returns `202` while processing. Poll the video record or use a future websocket/FCM event before rendering it to users.
