import { Card, CardBody, Col, Row } from 'reactstrap'

const takeawayCards = [
  {
    key: 'trendExpectation',
    label: 'Trend Expectation',
  },
  {
    key: 'bestStrategy',
    label: 'Best Strategy',
  },
  {
    key: 'riskNote',
    label: 'Risk Note',
  },
]

function QuickTakeaways({ takeaways }) {
  return (
    <Row className="g-3">
      {takeawayCards.map((card) => (
        <Col key={card.key} md="4">
          <Card className="takeaway-card h-100">
            <CardBody>
              <div className="snapshot-label">{card.label}</div>
              <p className="mb-0">{takeaways[card.key]}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default QuickTakeaways
