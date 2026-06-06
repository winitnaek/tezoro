# Tezoro

Tezoro is a React/Vite crypto market intelligence dashboard with a small Express API foundation.

## Tech Stack

- Frontend: React 18, Vite 5, JavaScript, Bootstrap, Reactstrap, Axios, Recharts
- Backend: Node.js, Express, Axios, dotenv, helmet, cors, morgan
- No TypeScript
- No authentication
- No routing
- No database

## Frontend

```bash
npm install
copy .env.example .env
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Frontend env:

```text
VITE_API_URL=http://localhost:3000
```

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

Backend env:

```text
PORT=3000
CLIENT_URL=http://localhost:5173
COINMARKETCAP_API_KEY=<optional primary live price provider key>
```

## API

- `GET /health`
- `GET /market/outlook/:symbol`

Supported symbols:

- `BTC`
- `ETH`
- `AVAX`
- `DOGE`
- `XRP`
- `LTC`

Example:

```text
http://localhost:3000/market/outlook/BTC
```

The API attempts live pricing in this order:

1. Coinbase spot price.
2. CoinMarketCap, when `COINMARKETCAP_API_KEY` is configured.
3. CoinGecko.
4. Local fallback dashboard data.

Coinbase is used for current spot price and does not require an API key. CoinMarketCap and CoinGecko can provide 24h change when they are the active provider. If live providers fail or rate-limit requests, Tezoro continues to work with fallback data.

