# Palworld Dashboard - Frontend (React + TypeScript + Tailwind)

Purpose-built dashboard for **pals.chadfi.com** with all requested pages:

- Home Dashboard
- Player Page (search + sortable table)
- Statistics
- Leaderboards
- Interactive World Map
- Activity Feed
- Server Information

It is designed to pull live data from:

- `/api/status`
- `/api/players`
- `/api/stats`
- `/api/events`
- `/api/leaderboards`
- `/api/map`
- `/api/server-info`

If live endpoints are unavailable, it automatically uses local mock JSON so the app still renders.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Chart.js + react-chartjs-2

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment variables

- `VITE_API_BASE_URL`: set to your API base URL (for example `https://api.pals.chadfi.com`). Leave blank to call same-origin `/api/*` routes.
- For Azure Static Web App API proxy mode, set these GitHub Action secrets (used by both workflows):
  - `PALWORLD_API_BASE` (example `http://palworld.chadfi.com:8212/v1/api`)
  - `PALWORLD_API_USERNAME` (commonly `admin`)
  - `PALWORLD_API_PASSWORD` (your server admin password)
  - `PALWORLD_CONNECT_HOST` (example `palworld.chadfi.com:8211`)
  - `PALWORLD_CONNECT_PASSWORD` (your desired connect password/help text)
  - `PALWORLD_GAME_PORT` (usually `8211`)

Live requests are attempted first; if a request fails, the app falls back to bundled mock JSON so the dashboard is still usable.

## Local mock API server (sample stub for local testing)

Run this when you want deterministic local responses before your backend is connected:

```bash
npm install
npm run mock:api
```

In a second terminal:

```bash
cp .env.example .env
npm run dev
```

The following local endpoints are provided at `http://localhost:4000`:

- `/api/status`
- `/api/players`
- `/api/stats`
- `/api/events`
- `/api/leaderboards`
- `/api/map`
- `/api/server-info`

## Azure Static Web Apps deployment

1. Push this repository to GitHub (branch `main`).
2. In GitHub repo settings → Secrets and variables → Actions, set:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` (deployment token from Azure).
3. In Azure Static Web App → **Configuration** (or **Settings**), add application settings:
   - `PALWORLD_API_BASE` (for example `http://20.98.102.132:8212`)
   - `PALWORLD_API_USERNAME` (`admin`)
   - `PALWORLD_API_PASSWORD` (Palword server admin password)
   - `PALWORLD_CONNECT_HOST` (`palworld.chadfi.com`)
   - `PALWORLD_CONNECT_PASSWORD` (`kefka`)
   - `PALWORLD_GAME_PORT` (`8211`)
4. Keep only this workflow for deploy: `.github/workflows/azure-static-web-apps-blue-meadow-00d0d531e.yml`.
5. Set domain `pals.chadfi.com` in Azure Static Web Apps and point DNS:
   - DNS `CNAME` for `pals` -> `<your-swa-hostname>.azurestaticapps.net`

## Cloudflare + Azure custom domain setup (for `pals.chadfi.com`)

Use these records in Cloudflare DNS:

- **CNAME** `pals` → `<your-swa-hostname>.azurestaticapps.net`
  - Set proxied status to **DNS only** while Azure validates the domain.
- **TXT** `_dnsauth.pals` → value provided by Azure custom-domain validation.
  - Keep TTL at **Auto** or 5 minutes for quick propagation.

After Azure validates ownership, you can switch the `pals` CNAME to **Proxied** if needed by your stack.

If you use SWA API routes later, keep the frontend on `/` and implement the matching API functions in `src/services/dashboardService.ts`.

## Files of interest

- `src/services/dashboardService.ts` → single service layer for future backend swap
- `src/data/mockData.ts` → immediate starter dataset
- `src/pages/*` → all required dashboard pages
