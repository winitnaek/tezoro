import { Badge, Card, CardBody, Col, Row } from 'reactstrap'

const badgeColorByBias = {
  buy: 'success',
  sell: 'danger',
  neutral: 'warning',
  caution: 'info',
}

function AIList({ items }) {
  if (!Array.isArray(items) || !items.length) {
    return null
  }

  return (
    <ul className="ai-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function AIIntelligenceCenter({
  intelligenceScore,
  aiOutlook,
  riskAssessment,
  opportunityAssessment,
  recommendedAction,
}) {
  if (!intelligenceScore && !aiOutlook && !riskAssessment && !opportunityAssessment && !recommendedAction) {
    return null
  }

  return (
    <Card className="ai-intelligence-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">AI Narrative Intelligence</div>
            <p className="mb-0">Rule-based market narrative generated from current dashboard signals.</p>
          </div>
          {intelligenceScore && (
            <div className="intelligence-score">
              <span>{intelligenceScore.score}</span>
              <strong>{intelligenceScore.label}</strong>
            </div>
          )}
        </div>

        <Row className="g-3">
          <Col lg="6">
            <div className="ai-block h-100">
              <div className="ai-block-title">
                <span>AI Outlook</span>
                {aiOutlook?.bias && (
                  <Badge className="intelligence-badge" color={badgeColorByBias[aiOutlook.bias] || 'secondary'}>
                    {aiOutlook.bias}
                  </Badge>
                )}
              </div>
              <h3>{aiOutlook?.headline || 'Outlook Pending'}</h3>
              <p>{aiOutlook?.summary || 'Narrative intelligence is being calculated.'}</p>
            </div>
          </Col>

          <Col lg="6">
            <div className="ai-block h-100">
              <div className="ai-block-title">
                <span>Recommended Action</span>
                <Badge className="intelligence-badge" color="warning">
                  {recommendedAction?.action || 'Pending'}
                </Badge>
              </div>
              <p>{recommendedAction?.summary || 'Action guidance is being calculated.'}</p>
            </div>
          </Col>

          <Col lg="6">
            <div className="ai-block h-100">
              <div className="ai-block-title">
                <span>Risk Assessment</span>
                <Badge className="intelligence-badge" color={riskAssessment?.level === 'High' ? 'danger' : riskAssessment?.level === 'Moderate' ? 'info' : 'success'}>
                  {riskAssessment?.level || 'Pending'}
                </Badge>
              </div>
              <p>{riskAssessment?.summary || 'Risk assessment is being calculated.'}</p>
              <AIList items={riskAssessment?.riskFactors} />
            </div>
          </Col>

          <Col lg="6">
            <div className="ai-block h-100">
              <div className="ai-block-title">
                <span>Opportunity Assessment</span>
                <Badge className="intelligence-badge" color={['Strong', 'Exceptional'].includes(opportunityAssessment?.level) ? 'success' : opportunityAssessment?.level === 'Limited' ? 'danger' : 'warning'}>
                  {opportunityAssessment?.level || 'Pending'}
                </Badge>
              </div>
              <p>{opportunityAssessment?.summary || 'Opportunity assessment is being calculated.'}</p>
              <AIList items={opportunityAssessment?.opportunities} />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default AIIntelligenceCenter
