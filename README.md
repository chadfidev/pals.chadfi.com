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

1. Push this repository to GitHub.
2. Add the GitHub Secret:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Connect your repo in the Azure portal and enable Static Web Apps deployment.
4. Use branch: `main`.
5. Ensure this workflow file exists:
   - `.github/workflows/azure-static-web-apps.yml`
6. Map custom domain in Azure:
   - Add `pals.chadfi.com`
   - Create a CNAME record in DNS: `pals` -> `<your-swa-hostname>.azurestaticapps.net`

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
