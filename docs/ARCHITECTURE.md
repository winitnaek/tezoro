# Tezoro Architecture

Tezoro is a standalone crypto market intelligence dashboard.

## Frontend

- React 18
- Vite 5
- JavaScript and JSX only
- Bootstrap and Reactstrap
- Recharts for charting
- Custom styling in `src/styles/app.css`

The main dashboard lives in `src/components/CryptoMarketDashboard.jsx`.

Current dashboard order:

1. Brand Header
2. Market Outlook Card
3. Calculated Market Signal Card
4. Current Snapshot
5. Historical Performance
6. Market Structure
7. Technical Analysis
8. Key Price Zones
9. Price History Chart
10. AI Intelligence Center
11. Key Levels & Outlook
12. Performance Comparison
13. Quick Takeaways
14. System Status Card
15. Disclaimer

## Backend

- Node.js 18+
- Express 4
- Axios
- In-memory cache

Main API entry:

- `backend/src/app.js`

Market API flow:

1. Route receives `/market/outlook/:symbol`.
2. Controller calls `buildMarketOutlook`.
3. Services fetch live price, chart, premium, sentiment, and diagnostics.
4. Engines calculate technical analysis, key zones, signal score, signal confidence, historical analytics, market structure, comparison performance, and deterministic AI narrative intelligence.
5. Fallback data is used whenever providers fail.

## Premium Gating Foundation

Phase 7 adds frontend-only premium gating:

- BTC is free and selectable.
- ETH, AVAX, DOGE, XRP, and LTC remain visible with a lock indicator.
- Clicking premium assets opens `UpgradeModal`.
- No Stripe, authentication, routing, or account creation is implemented.

## Provider Health

`GET /health/providers` checks:

- CoinGecko
- Coinbase
- Alternative.me sentiment
- In-memory cache

The provider health endpoint does not affect market APIs.
