import { Badge, Card, CardBody, Col, Row } from 'reactstrap'

const badgeColorByBias = {
  buy: 'success',
  sell: 'danger',
  neutral: 'warning',
  caution: 'info',
}

function formatTechnicalValue(value, prefix = '') {
  if (value === undefined || value === null || value === '') {
    return 'Pending'
  }

  if (typeof value === 'number') {
    return `${prefix}${value.toLocaleString('en-US', {
      maximumFractionDigits: value < 1 ? 4 : 2,
    })}`
  }

  return value
}

function TechnicalAnalysisCards({ technicalAnalysis }) {
  if (!technicalAnalysis) {
    return null
  }

  const cards = [
    {
      label: 'SMA 20',
      value: formatTechnicalValue(technicalAnalysis.sma20, '$'),
      note: technicalAnalysis.priceVsSma20 || 'Calculated from recent market structure.',
      bias: technicalAnalysis.trendBias || 'neutral',
    },
    {
      label: 'SMA 50',
      value: formatTechnicalValue(technicalAnalysis.sma50, '$'),
      note: technicalAnalysis.priceVsSma50 || 'Medium trend reference.',
      bias: technicalAnalysis.trendBias || 'neutral',
    },
    {
      label: 'Trend',
      value: technicalAnalysis.trend || 'Neutral',
      note: `${technicalAnalysis.momentum || 'Neutral'} momentum (${technicalAnalysis.momentumScore ?? 50}/100).`,
      bias: technicalAnalysis.trendBias || 'neutral',
    },
    {
      label: 'Volatility',
      value: technicalAnalysis.volatility || 'Moderate',
      note: `Range risk score: ${technicalAnalysis.volatilityScore ?? 50}/100.`,
      bias: technicalAnalysis.volatilityScore >= 70 ? 'sell' : technicalAnalysis.volatilityScore >= 35 ? 'caution' : 'buy',
    },
  ]

  return (
    <Row className="g-3 technical-analysis-grid">
      {cards.map((card) => (
        <Col key={card.label} sm="6" lg="3">
          <Card className="technical-analysis-card h-100">
            <CardBody>
              <div className="d-flex align-items-start justify-content-between gap-2">
                <div className="snapshot-label">{card.label}</div>
                <Badge color={badgeColorByBias[card.bias] || 'secondary'}>
                  {card.bias === 'sell' ? 'Risk' : card.bias === 'buy' ? 'Buy' : 'Watch'}
                </Badge>
              </div>
              <div className="technical-analysis-value">{card.value}</div>
              <p className="technical-analysis-note">{card.note}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default TechnicalAnalysisCards
