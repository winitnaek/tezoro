import { Card, CardBody } from 'reactstrap'

function formatValue(value) {
  if (!value) {
    return 'Unavailable'
  }

  const normalized = String(value).toLowerCase()
  const displayValues = {
    'alternative-me': 'Alternative.me',
    coinmarketcap: 'CoinMarketCap',
    coingecko: 'CoinGecko',
    coinbase: 'Coinbase',
    fallback: 'Fallback',
  }

  return displayValues[normalized] || String(value)
}

function formatFreshness(value) {
  const normalized = String(value || '').toLowerCase()
  const displayValues = {
    hit: 'Recent',
    miss: 'Live',
    fallback: 'Fallback',
  }

  return displayValues[normalized] || formatValue(value)
}

function SystemStatusCard({ providerDiagnostics }) {
  if (!providerDiagnostics) {
    return null
  }

  const rows = [
    { label: 'Price Source', value: providerDiagnostics.price },
    { label: 'Premium Source', value: providerDiagnostics.premium },
    { label: 'Sentiment Source', value: providerDiagnostics.sentiment },
    { label: 'Data Freshness', value: formatFreshness(providerDiagnostics.cache) },
  ]

  return (
    <Card className="system-status-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">System Status</div>
            <p className="mb-0">Current provider diagnostics for this dashboard view.</p>
          </div>
        </div>

        <div className="system-status-grid">
          {rows.map((row) => (
            <div className="system-status-row" key={row.label}>
              <span>{row.label}</span>
              <strong>{formatValue(row.value)}</strong>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default SystemStatusCard
