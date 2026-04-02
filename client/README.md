# Personal portfolio (Angular)

Standalone Angular app with SCSS and route-based pages: Home, About, **Studio** (in-browser step sequencer / Web Audio DAW), and Favorites.

## Studio (DAW)

- Route: `/studio` (legacy `/projects` redirects here).
- Audio is synthesized in the browser via Web Audio API (`DawAudioService`); no audio files required.
- Optional save/load calls `GET/POST /api/daw-patterns` on the Express server. Apply the `daw_patterns` table from `../supabase/schema.sql` and run the API so persistence works.

## Configuration

API base URL is defined in:

- `src/environments/environment.ts` — local development uses **`/api`** (same origin). `ng serve` loads **`proxy.conf.json`**, which forwards `/api` → `http://localhost:3000` so the browser does not hit CORS issues. **Run the Express server on port 3000** when you want highlights, search, and Studio pattern save/load.
- `src/environments/environment.prod.ts` — production; **update `apiUrl`** to your deployed Express URL (for example `https://your-api.up.railway.app/api`) before running `ng build`.

### Home highlights

`GET /api/favorites/highlights` is used for the “From my favorites” album preview. If the API is unreachable or Supabase is misconfigured, the client falls back to **empty lists** so the home page still loads (you’ll see “No albums to preview” until data exists).

### Studio patterns (optional)

Persisting patterns needs the **`daw_patterns`** table from `../supabase/schema.sql` applied in Supabase, plus valid `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the server `.env`. If the table is missing, the API still returns an empty list so the Studio page loads; **Save** will fail until the migration is applied.

## Scripts

```bash
npm install
npm start
npm run build
```

If the workspace has multiple projects, use:

```bash
ng serve client
ng build client
```

## Structure

- `src/app/pages/*` — routed pages.
- `src/app/shared/*` — navbar, footer, hero, cards, section header.
- `src/app/services/*` — HTTP services calling the Express API.

Ensure the backend is running and CORS allows this origin (see server `FRONTEND_URL`).
