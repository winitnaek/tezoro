# Tezoro Deployment

Tezoro is a React/Vite frontend with a separate Express API backend.

## Local Development

Frontend:

```bash
cd D:\W\crypto-market-dashboard
npm install
npm run dev
```

Backend:

```bash
cd D:\W\crypto-market-dashboard\backend
npm install
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- Provider health: `http://localhost:3000/health/providers`
- Market API: `http://localhost:3000/market/outlook/BTC`

## Production Build

Frontend:

```bash
npm run build
```

Backend:

```bash
cd backend
npm start
```

## Deployment Notes

- Deploy the frontend `dist/` output to a static hosting provider.
- Deploy the backend as a Node.js service.
- Set `VITE_API_URL` to the production API URL before building the frontend.
- Set backend `CLIENT_URL` to the production frontend origin.
- Do not commit `.env` files containing secrets.

## Known Build Note

Vite may show a chunk-size warning because the dashboard uses Recharts and rich UI modules. The build succeeds. Phase 7 added lazy loading for larger chart sections to reduce initial bundle pressure.
