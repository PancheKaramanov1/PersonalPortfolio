# Personal portfolio — Angular + Express + Supabase

Monorepo layout:

- `client/` — Angular frontend (SCSS, standalone components, REST calls).
- `server/` — Express API using the official Supabase JS client (service role key).
- `supabase/` — SQL schema and seed data for albums and projects.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- (Optional) [Railway](https://railway.app/) account for hosting the API

## 1. Supabase setup

1. Create a project in Supabase.
2. Open **SQL Editor** and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Under **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only; never commit or ship to the browser)

The service role bypasses Row Level Security and is appropriate for a trusted backend. Do not use the anon key on the server for this MVP if you rely on protected writes later.

## 2. Run the API locally

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your Supabase values and:

```env
FRONTEND_URL=http://localhost:4200
PORT=3000
```

Start:

```bash
npm run dev
```

Verify: [http://localhost:3000/api/health](http://localhost:3000/api/health) should show `"ok": true` and `"supabase": true`.

## 3. Run the Angular app locally

```bash
cd client
npm install
npm start
```

Or: `ng serve client` if your CLI asks for a project name.

Open [http://localhost:4200](http://localhost:4200). The app calls `http://localhost:3000/api` from `src/environments/environment.ts`.

## 4. Production build (frontend)

1. Set `apiUrl` in `client/src/environments/environment.prod.ts` to your **public API base** (must include `/api`), e.g. `https://your-api.up.railway.app/api`.
2. Build:

```bash
cd client
npm run build
```

Output: `client/dist/client/browser/` (static files you can host on Netlify, Vercel, Cloudflare Pages, or Railway static hosting).

## 5. Deploy the API to Railway

Recommended: treat **`server/` as its own Railway service** (or set **Root Directory** to `server` in Railway).

1. Create a new project → **Deploy from GitHub** (or CLI) pointing at this repo.
2. Set **Root Directory** to `server` so Railway runs `npm install` and `npm start` from there.
3. Add environment variables in Railway (same names as `server/.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL` — your deployed Angular site origin, e.g. `https://your-site.netlify.app` (no trailing slash). This value is used for **CORS**.
   - `NODE_ENV=production`
4. Railway injects `PORT` automatically; do not hardcode it.

After deploy, note the public URL (e.g. `https://xxxx.up.railway.app`). Your API lives at `https://xxxx.up.railway.app/api/...`.

### Connecting Supabase on Railway

Add the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` you use locally. No extra Supabase-side step is required for the server client beyond valid keys and network access.

## 6. Frontend deployment options

**Recommended for clarity:** host the **Angular static build** and the **Express API** as **two separate services**:

- **API:** Railway (or Render/Fly.io) running `server/`.
- **Frontend:** Netlify, Vercel, Cloudflare Pages, or GitHub Pages serving `client/dist/client/browser/`.

Then set `environment.prod.ts` `apiUrl` to the Railway API base and set `FRONTEND_URL` on the server to the frontend origin for CORS.

**Alternative:** a single Railway service could serve both (e.g. Express `express.static` for Angular build). That requires extra wiring; the two-service model keeps this MVP easy to reason about.

## Customization checklist

- Replace placeholder copy in `client/src/app/pages/home/home.component.ts` (name, role, intro).
- Edit About page content in `about.component.ts`.
- Update GitHub/demo URLs in Supabase `projects` rows or in `supabase/seed.sql`.
- Adjust colors in `client/src/styles.scss` CSS variables.

## License

Use and modify freely for your personal site.
