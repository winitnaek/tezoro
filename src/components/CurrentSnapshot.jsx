import { Badge, Card, CardBody, Col, Row } from 'reactstrap'
import MiniSparkline from './MiniSparkline.jsx'

const badgeColorByBias = {
  buy: 'success',
  sell: 'danger',
  neutral: 'warning',
  caution: 'info',
}

function CurrentSnapshot({ data }) {
  const premiumSourceLabel = data.premiumSource === 'live' ? 'Live Calculation' : 'Fallback Estimate'
  const cards = [
    {
      label: `${data.symbol} Price`,
      value: data.currentPrice,
      description: `${data.name} current market snapshot.`,
      badgeLabel: data.priceBias.badgeLabel,
      bias: data.priceBias.bias,
      trendLabel: data.snapshotTrend?.currentPriceChange,
      direction: data.snapshotTrend?.currentPriceDirection,
      sparkline: data.sparklines?.currentPrice,
    },
    {
      label: data.premiumIndexLabel,
      value: data.premiumIndex.value,
      description: data.premiumIndex.description,
      badgeLabel: data.premiumIndex.badgeLabel,
      bias: data.premiumIndex.bias,
      trendLabel: data.snapshotTrend?.premiumChangeLabel,
      direction: data.snapshotTrend?.premiumDirection,
      sparkline: data.sparklines?.premium,
      sourceLabel: premiumSourceLabel,
    },
    {
      label: 'Fear & Greed Index',
      value: `${data.fearGreedIndex.score}, ${data.fearGreedIndex.category}`,
      description: data.fearGreedIndex.description,
      badgeLabel: data.fearGreedIndex.badgeLabel,
      bias: data.fearGreedIndex.bias,
      trendLabel: data.snapshotTrend?.fearGreedChangeLabel,
      direction: data.snapshotTrend?.fearGreedDirection,
      sparkline: data.sparklines?.fearGreed,
    },
  ]

  return (
    <Row className="g-3">
      {cards.map((card) => (
        <Col key={card.label} md="4">
          <Card className="snapshot-card h-100">
            <CardBody>
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <div className="snapshot-label">{card.label}</div>
                  <div className="snapshot-value">{card.value}</div>
                </div>
                <Badge color={badgeColorByBias[card.bias] || 'secondary'}>{card.badgeLabel}</Badge>
              </div>
              <div className="snapshot-visual-row">
                {card.trendLabel && (
                  <div className={`snapshot-trend snapshot-trend-${card.direction || 'neutral'}`}>
                    <span className="snapshot-trend-dot" />
                    {card.trendLabel}
                  </div>
                )}
                {card.sourceLabel && (
                  <div className={`premium-source-pill premium-source-${data.premiumSource || 'fallback'}`}>
                    {card.sourceLabel}
                  </div>
                )}
                <MiniSparkline data={card.sparkline} direction={card.direction} />
              </div>
              <p className="snapshot-description">{card.description}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default CurrentSnapshot
