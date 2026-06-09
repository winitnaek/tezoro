import { Badge, Card, CardBody } from 'reactstrap'

const badgeColorByPosture = {
  Defensive: 'danger',
  Neutral: 'warning',
  Opportunistic: 'success',
  'Breakout Watch': 'info',
}

function DecisionList({ className, items }) {
  if (!Array.isArray(items) || !items.length) {
    return <p className="ai-decision-muted">No major items are flagged.</p>
  }

  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function buildFallbackBrief({
  aiOutlook,
  riskAssessment,
  opportunityAssessment,
  recommendedAction,
  intelligenceScore,
}) {
  if (!aiOutlook && !riskAssessment && !opportunityAssessment && !recommendedAction) {
    return null
  }

  return {
    posture: riskAssessment?.level === 'High'
      ? 'Defensive'
      : ['Strong', 'Exceptional'].includes(opportunityAssessment?.level)
        ? 'Opportunistic'
        : 'Neutral',
    marketStory: aiOutlook?.summary || 'Rule-based market narrative is being calculated from current dashboard signals.',
    suggestedApproach: recommendedAction?.summary || 'Maintain a neutral stance until the signal improves.',
    keyRisks: riskAssessment?.riskFactors || [],
    opportunities: opportunityAssessment?.opportunities || [],
    whyThisOutlook: [
      aiOutlook?.headline,
      riskAssessment?.summary,
      opportunityAssessment?.summary,
    ].filter(Boolean),
    confidenceLabel: intelligenceScore?.label || 'Confidence Pending',
  }
}

function AIIntelligenceCenter({
  intelligenceScore,
  aiOutlook,
  riskAssessment,
  opportunityAssessment,
  recommendedAction,
  aiDecisionBrief,
}) {
  const decisionBrief = aiDecisionBrief || buildFallbackBrief({
    aiOutlook,
    riskAssessment,
    opportunityAssessment,
    recommendedAction,
    intelligenceScore,
  })

  if (!decisionBrief && !intelligenceScore) {
    return null
  }

  const posture = decisionBrief?.posture || 'Neutral'
  const confidenceLabel = decisionBrief?.confidenceLabel || intelligenceScore?.label || 'Confidence Pending'

  return (
    <Card className="ai-intelligence-card ai-decision-card">
      <CardBody>
        <div className="ai-decision-header">
          <div>
            <div className="snapshot-label">AI Intelligence Center</div>
            <p className="mb-0">Rule-based decision brief generated from current Tezoro market signals.</p>
          </div>
          <div className="ai-score-panel">
            <div>
              <span className="ai-score-value">{intelligenceScore?.score ?? '--'}</span>
              <span className="ai-decision-muted">{intelligenceScore?.label || 'Score Pending'}</span>
            </div>
            <Badge className="ai-posture-badge" color={badgeColorByPosture[posture] || 'secondary'}>
              {posture}
            </Badge>
            <span className="ai-confidence-label">{confidenceLabel}</span>
          </div>
        </div>

        <section className="ai-market-story">
          <span>Market Story</span>
          <p>{decisionBrief?.marketStory || 'Market Story is being calculated.'}</p>
        </section>

        <section className="ai-action-callout">
          <span>Suggested Approach</span>
          <strong>{decisionBrief?.suggestedApproach || 'Maintain a neutral stance until the signal improves.'}</strong>
        </section>

        <div className="ai-risk-opportunity-grid">
          <section className="ai-block">
            <div className="ai-block-title">
              <span>Key Risks</span>
            </div>
            <DecisionList className="ai-risk-list" items={decisionBrief?.keyRisks} />
          </section>

          <section className="ai-block">
            <div className="ai-block-title">
              <span>Opportunities</span>
            </div>
            <DecisionList className="ai-opportunity-list" items={decisionBrief?.opportunities} />
          </section>
        </div>

        <section className="ai-market-story ai-why-section">
          <span>Why This Outlook</span>
          <DecisionList className="ai-why-list" items={decisionBrief?.whyThisOutlook} />
        </section>
      </CardBody>
    </Card>
  )
}

export default AIIntelligenceCenter
