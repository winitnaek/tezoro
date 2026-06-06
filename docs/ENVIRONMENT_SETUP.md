# Tezoro Environment Setup

Do not commit real `.env` files with secrets.

## Frontend

Example file:

- `.env.example`
- `frontend/.env.example`

Variables:

```bash
VITE_API_URL=http://localhost:3000
VITE_PREMIUM_FEATURE_ENABLED=false
```

`VITE_API_URL` should point to the Express backend.

`VITE_PREMIUM_FEATURE_ENABLED` controls frontend-only premium asset gating:

- `true`: BTC is free; ETH, AVAX, DOGE, XRP, and LTC show lock icons and open the upgrade modal.
- `false`: all supported cryptos behave like free assets and switch normally.

## Backend

Example file:

- `backend/.env.example`

Variables:

```bash
PORT=3000
CLIENT_URL=http://localhost:5173
COINMARKETCAP_API_KEY=
COINGECKO_PING_URL=https://api.coingecko.com/api/v3/ping
COINBASE_SPOT_URL=https://api.coinbase.com/v2/prices/BTC-USD/spot
SENTIMENT_API_URL=https://api.alternative.me/fng/
```

Cache TTL reference:

```bash
CACHE_TTL_PRICE_SECONDS=120
CACHE_TTL_CHART_SHORT_SECONDS=600
CACHE_TTL_CHART_LONG_SECONDS=1800
CACHE_TTL_COMPARISON_SECONDS=600
CACHE_TTL_PREMIUM_SECONDS=120
CACHE_TTL_SENTIMENT_SECONDS=600
```

Current cache TTLs are implemented in code. These values document production expectations for operators.

## Required For Local Run

Frontend:

```bash
VITE_API_URL=http://localhost:3000
VITE_PREMIUM_FEATURE_ENABLED=false
```

Backend:

```bash
PORT=3000
CLIENT_URL=http://localhost:5173
```

CoinMarketCap is optional. If `COINMARKETCAP_API_KEY` is not set, Tezoro still uses Coinbase, CoinGecko, and fallback data.
