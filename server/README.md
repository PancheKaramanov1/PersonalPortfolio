# Personal portfolio API (Express + Supabase)

REST API consumed by the Angular client. Data lives in Supabase (PostgreSQL).

## Scripts

- `npm start` — run in production mode (`NODE_ENV` respected).
- `npm run dev` — run with Node’s built-in `--watch` (Node 18+).

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Project URL from Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Service role** key (server only; never expose to the browser) |
| `PORT` | Listen port (Railway sets this automatically) |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:4200` or your deployed Angular URL) |
| `NODE_ENV` | `development` or `production` |

## API overview

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness + whether Supabase is configured |
| GET | `/api/albums` | List albums |
| GET | `/api/albums/:id` | Single album |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:id` | Single project |
| GET | `/api/favorites/highlights` | Featured rows for the home page |
| GET | `/api/search?q=` | Search albums and projects |

Album responses include optional YouTube metadata (`youtube_url`, `youtube_embed_url`, `youtube_type`, etc.). The API normalizes watch/playlist links into safe `youtube.com/embed/…` URLs before returning JSON. Apply the Supabase migration in `../supabase/migrations/002_albums_youtube.sql` so these columns exist.

If the database has no `youtube_url` yet, `src/data/albumYoutubeOverrides.js` can map album `id` → watch URL so embeds still work until you backfill Supabase.

## Local development

From `server/`:

```bash
npm install
cp .env.example .env
# edit .env
npm run dev
```

Run the Angular app separately (`../client`) so CORS matches `FRONTEND_URL`.
