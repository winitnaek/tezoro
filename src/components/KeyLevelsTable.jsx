import { Badge, Card, CardBody, Table } from 'reactstrap'

const badgeColorByBias = {
  buy: 'success',
  sell: 'danger',
  neutral: 'warning',
  caution: 'info',
}

const labelByBias = {
  buy: 'Buy',
  sell: 'Sell / Trim',
  neutral: 'Neutral',
  caution: 'Caution',
}

function buildAiRows({ aiOutlook, riskAssessment, opportunityAssessment, recommendedAction }) {
  if (!aiOutlook && !riskAssessment && !opportunityAssessment && !recommendedAction) {
    return []
  }

  return [
    aiOutlook && {
      metric: 'AI Outlook',
      details: aiOutlook.headline,
      interpretation: aiOutlook.summary,
      bias: aiOutlook.bias,
    },
    riskAssessment && {
      metric: 'AI Risk Assessment',
      details: riskAssessment.level,
      interpretation: riskAssessment.summary,
      bias: riskAssessment.level === 'High' ? 'sell' : riskAssessment.level === 'Moderate' ? 'caution' : 'neutral',
    },
    opportunityAssessment && {
      metric: 'AI Opportunity Assessment',
      details: opportunityAssessment.level,
      interpretation: opportunityAssessment.summary,
      bias: ['Strong', 'Exceptional'].includes(opportunityAssessment.level) ? 'buy' : opportunityAssessment.level === 'Selective' ? 'neutral' : 'caution',
    },
    recommendedAction && {
      metric: 'Recommended Action',
      details: recommendedAction.action,
      interpretation: recommendedAction.summary,
      bias: aiOutlook?.bias || 'neutral',
    },
  ].filter(Boolean)
}

function KeyLevelsTable({ rows, aiOutlook, riskAssessment, opportunityAssessment, recommendedAction }) {
  const hasAiRows = rows.some((row) => ['AI Outlook', 'AI Risk Assessment', 'AI Opportunity Assessment', 'Recommended Action'].includes(row.metric))
  const displayRows = hasAiRows
    ? rows
    : [...rows, ...buildAiRows({ aiOutlook, riskAssessment, opportunityAssessment, recommendedAction })]

  return (
    <Card className="outlook-table-card">
      <CardBody>
        <div className="table-responsive">
          <Table dark hover borderless className="align-middle mb-0 outlook-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Details</th>
                <th>Interpretation</th>
                <th>Bias</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.metric}>
                  <td className="fw-semibold">{row.metric}</td>
                  <td>{row.details}</td>
                  <td>{row.interpretation}</td>
                  <td>
                    <Badge color={badgeColorByBias[row.bias] || 'secondary'}>
                      {labelByBias[row.bias] || row.bias}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default KeyLevelsTable
