import { Card, CardBody } from 'reactstrap'

function formatChange(value) {
  if (!Number.isFinite(value)) {
    return 'Pending'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

function getBarWidth(value, maxAbsValue) {
  if (!Number.isFinite(value) || maxAbsValue <= 0) {
    return 0
  }

  return Math.max(5, Math.min(100, (Math.abs(value) / maxAbsValue) * 100))
}

function PerformanceComparison({ comparisonPerformance }) {
  if (!Array.isArray(comparisonPerformance) || !comparisonPerformance.length) {
    return null
  }

  const maxAbsValue = Math.max(
    ...comparisonPerformance.flatMap((row) => [
      Math.abs(Number(row.change7d) || 0),
      Math.abs(Number(row.change30d) || 0),
    ]),
    1
  )

  return (
    <Card className="performance-comparison-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">Performance Comparison</div>
            <p className="mb-0">Relative 7D and 30D performance across tracked assets.</p>
          </div>
        </div>

        <div className="comparison-list">
          {comparisonPerformance.map((row) => (
            <div className={`comparison-bar-row ${row.selected ? 'comparison-selected' : ''}`} key={row.symbol}>
              <div className="comparison-symbol">
                <strong>{row.symbol}</strong>
                <span>{row.name}</span>
              </div>
              <div className="comparison-bars">
                <div className="comparison-bar-line">
                  <span>7D</span>
                  <div className="comparison-bar-track">
                    <div
                      className={`comparison-bar-fill ${row.change7d >= 0 ? 'performance-positive-bg' : 'performance-negative-bg'}`}
                      style={{ width: `${getBarWidth(row.change7d, maxAbsValue)}%` }}
                    />
                  </div>
                  <strong className={row.change7d >= 0 ? 'performance-positive' : 'performance-negative'}>
                    {formatChange(row.change7d)}
                  </strong>
                </div>
                <div className="comparison-bar-line">
                  <span>30D</span>
                  <div className="comparison-bar-track">
                    <div
                      className={`comparison-bar-fill ${row.change30d >= 0 ? 'performance-positive-bg' : 'performance-negative-bg'}`}
                      style={{ width: `${getBarWidth(row.change30d, maxAbsValue)}%` }}
                    />
                  </div>
                  <strong className={row.change30d >= 0 ? 'performance-positive' : 'performance-negative'}>
                    {formatChange(row.change30d)}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default PerformanceComparison
