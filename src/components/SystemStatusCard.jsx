import { Card, CardBody } from 'reactstrap'

function formatValue(value) {
  if (!value) {
    return 'Unavailable'
  }

  return String(value)
}

function SystemStatusCard({ providerDiagnostics }) {
  if (!providerDiagnostics) {
    return null
  }

  const rows = [
    { label: 'Price Provider', value: providerDiagnostics.price },
    { label: 'Premium Provider', value: providerDiagnostics.premium },
    { label: 'Sentiment Provider', value: providerDiagnostics.sentiment },
    { label: 'Cache Status', value: providerDiagnostics.cache === 'hit' ? 'Healthy' : providerDiagnostics.cache },
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
