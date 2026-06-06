import { Card, CardBody } from 'reactstrap'

function formatPrice(value) {
  if (!Number.isFinite(value)) {
    return '-'
  }

  if (value < 1) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 4,
    })}`
  }

  if (value < 100) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return `$${Math.round(value).toLocaleString('en-US')}`
}

function getPosition(value, low, high) {
  if (!Number.isFinite(value) || !Number.isFinite(low) || !Number.isFinite(high) || high <= low) {
    return 50
  }

  return Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100))
}

function KeyPriceZonesChart({ keyPriceZones, symbol }) {
  if (!keyPriceZones) {
    return null
  }

  const {
    currentPrice,
    rangeLow,
    rangeHigh,
    baseLow,
    baseHigh,
    supportLevels = [],
    resistanceLevels = [],
  } = keyPriceZones
  const baseLeft = getPosition(baseLow, rangeLow, rangeHigh)
  const baseWidth = Math.max(4, getPosition(baseHigh, rangeLow, rangeHigh) - baseLeft)
  const currentLeft = getPosition(currentPrice, rangeLow, rangeHigh)

  return (
    <Card className="key-price-zones-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">{symbol} Key Price Zones</div>
            <p className="mb-0">Calculated from recent market structure.</p>
          </div>
          <strong>{formatPrice(currentPrice)}</strong>
        </div>

        <div className="key-zone-chart" aria-label={`${symbol} key price zones`}>
          <div className="key-zone-scale">
            <span>{formatPrice(rangeLow)}</span>
            <span>{formatPrice(rangeHigh)}</span>
          </div>
          <div className="key-zone-track">
            <div className="key-zone-full-range" />
            <div
              className="key-zone-base-range"
              style={{ left: `${baseLeft}%`, width: `${baseWidth}%` }}
            />
            {supportLevels.map((level) => (
              <div
                key={`support-${level}`}
                className="key-zone-level key-zone-support"
                style={{ left: `${getPosition(level, rangeLow, rangeHigh)}%` }}
              >
                <span>{formatPrice(level)}</span>
              </div>
            ))}
            {resistanceLevels.map((level) => (
              <div
                key={`resistance-${level}`}
                className="key-zone-level key-zone-resistance"
                style={{ left: `${getPosition(level, rangeLow, rangeHigh)}%` }}
              >
                <span>{formatPrice(level)}</span>
              </div>
            ))}
            <div
              className="key-zone-current"
              style={{ left: `${currentLeft}%` }}
            >
              <span>Current</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default KeyPriceZonesChart
