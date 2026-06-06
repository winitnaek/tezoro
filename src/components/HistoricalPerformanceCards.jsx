import { Card, CardBody, Col, Row } from 'reactstrap'

function getPerformanceClass(value) {
  if (!Number.isFinite(value) || Math.abs(value) < 0.05) {
    return 'performance-neutral'
  }

  return value > 0 ? 'performance-positive' : 'performance-negative'
}

function formatChange(value) {
  if (!Number.isFinite(value)) {
    return 'Pending'
  }

  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

function HistoricalPerformanceCards({ historicalPerformance }) {
  if (!historicalPerformance) {
    return null
  }

  const cards = [
    { label: '24H', value: historicalPerformance.change24h },
    { label: '7D', value: historicalPerformance.change7d },
    { label: '30D', value: historicalPerformance.change30d },
    { label: '90D', value: historicalPerformance.change90d },
    { label: 'YTD', value: historicalPerformance.changeYtd },
  ]

  return (
    <Row className="g-3 historical-performance-grid">
      {cards.map((card) => (
        <Col key={card.label} xs="6" md="4" xl>
          <Card className="historical-performance-card h-100">
            <CardBody>
              <div className="snapshot-label">{card.label}</div>
              <div className={`historical-performance-value ${getPerformanceClass(card.value)}`}>
                {formatChange(card.value)}
              </div>
              <p>{Number.isFinite(card.value) ? `${card.label} performance snapshot.` : 'History unavailable.'}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default HistoricalPerformanceCards
