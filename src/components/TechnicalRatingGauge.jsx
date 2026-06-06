import { Badge, Card, CardBody, Col, Row } from 'reactstrap'

const ratingOrder = [
  ['oscillators', 'Oscillators'],
  ['summary', 'Summary'],
  ['movingAverages', 'Moving Averages'],
]

function getRotation(score) {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0))
  return -90 + safeScore * 1.8
}

function getBadgeColor(posture) {
  if (posture === 'constructive') return 'success'
  if (posture === 'riskOff') return 'danger'
  return 'warning'
}

function TechnicalRatingGauge({ technicalRating }) {
  if (!technicalRating) {
    return null
  }

  return (
    <Card className="technical-rating-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <h2 className="market-section-title mb-0">Technical Rating Summary</h2>
            <p>Current market posture based on Tezoro technical, momentum, sentiment, and structure inputs.</p>
          </div>
        </div>

        <Row className="g-3 technical-rating-grid">
          {ratingOrder.map(([key, title]) => {
            const rating = technicalRating[key]

            if (!rating) {
              return null
            }

            return (
              <Col key={key} md="4">
                <div className={`technical-rating-panel technical-rating-${rating.posture || 'neutral'}`}>
                  <div className="technical-rating-title-row">
                    <h3>{title}</h3>
                    <Badge color={getBadgeColor(rating.posture)} className="technical-rating-badge">
                      {rating.label || 'Neutral'}
                    </Badge>
                  </div>

                  <div className="technical-gauge" aria-label={`${title} ${rating.label}`}>
                    <div className="technical-gauge-arc" />
                    <div
                      className="technical-gauge-needle"
                      style={{ transform: `translateX(-50%) rotate(${getRotation(rating.score)}deg)` }}
                    />
                    <div className="technical-gauge-pin" />
                    <div className="technical-gauge-label technical-gauge-left">Risk-Off</div>
                    <div className="technical-gauge-label technical-gauge-top">Neutral</div>
                    <div className="technical-gauge-label technical-gauge-right">Constructive</div>
                  </div>

                  <div className="technical-rating-result">
                    <span>{rating.score ?? 50}</span>
                    <strong>{rating.label || 'Neutral'}</strong>
                  </div>

                  <div className="technical-rating-counts">
                    <div>
                      <span>Risk-Off</span>
                      <strong>{rating.riskOff ?? 0}</strong>
                    </div>
                    <div>
                      <span>Neutral</span>
                      <strong>{rating.neutral ?? 0}</strong>
                    </div>
                    <div>
                      <span>Constructive</span>
                      <strong>{rating.constructive ?? 0}</strong>
                    </div>
                  </div>

                  <p>{rating.note}</p>
                </div>
              </Col>
            )
          })}
        </Row>
      </CardBody>
    </Card>
  )
}

export default TechnicalRatingGauge
