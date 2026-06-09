import { useState } from 'react'
import { Badge, Button, Card, CardBody } from 'reactstrap'
import KeyLevelsTable from './KeyLevelsTable.jsx'

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

function findRow(rows, terms) {
  if (!Array.isArray(rows)) {
    return null
  }

  return rows.find((row) => {
    const metric = `${row?.metric || ''}`.toLowerCase()
    return terms.some((term) => metric.includes(term))
  }) || null
}

function formatLevels(levels) {
  if (!Array.isArray(levels) || !levels.length) {
    return ''
  }

  return levels
    .filter((level) => Number.isFinite(level))
    .map((level) => {
      if (level >= 1000) return `$${Math.round(level).toLocaleString('en-US')}`
      if (level >= 100) return `$${Math.round(level).toLocaleString('en-US')}`
      if (level >= 1) return `$${level.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
      return `$${level.toLocaleString('en-US', { maximumFractionDigits: 4 })}`
    })
    .join(' | ')
}

function getBias(row, fallback = 'neutral') {
  return row?.bias || fallback
}

function SummaryBadge({ bias, label }) {
  const resolvedLabel = label || labelByBias[bias] || bias

  if (!resolvedLabel) {
    return null
  }

  return (
    <Badge className="intelligence-summary-badge" color={badgeColorByBias[bias] || 'secondary'}>
      {resolvedLabel}
    </Badge>
  )
}

function SummaryCard({ title, value, note, bias, badgeLabel, action = false }) {
  if (!value && !note) {
    return null
  }

  return (
    <article className={`intelligence-summary-card ${action ? 'intelligence-action-card' : ''}`}>
      <div className="intelligence-summary-card-top">
        <h3 className="intelligence-summary-title">{title}</h3>
        <SummaryBadge bias={bias} label={badgeLabel} />
      </div>
      {value && <div className="intelligence-summary-value">{value}</div>}
      {note && <p className="intelligence-summary-note">{note}</p>}
    </article>
  )
}

function MarketIntelligenceSummary({
  rows = [],
  symbol,
  aiDecisionBrief,
  aiOutlook,
  riskAssessment,
  opportunityAssessment,
  recommendedAction,
  keyPriceZones,
  premiumIndex,
  fearGreedIndex,
  marketStructure,
  technicalAnalysis,
}) {
  const [showDetailedTable, setShowDetailedTable] = useState(false)
  const currentPriceRow = findRow(rows, ['current price'])
  const rangeRow = findRow(rows, ['range'])
  const supportRow = findRow(rows, ['support'])
  const resistanceRow = findRow(rows, ['resistance'])
  const fearGreedRow = findRow(rows, ['fear', 'greed'])
  const premiumRow = findRow(rows, ['premium'])
  const recommendedRow = findRow(rows, ['recommended', 'action'])
  const aiRow = findRow(rows, ['ai'])
  const riskRow = findRow(rows, ['risk'])
  const opportunityRow = findRow(rows, ['opportunity'])
  const supportLevels = supportRow?.details || formatLevels(keyPriceZones?.supportLevels)
  const resistanceLevels = resistanceRow?.details || formatLevels(keyPriceZones?.resistanceLevels)
  const sentimentDetails = fearGreedRow?.details || (fearGreedIndex ? `${fearGreedIndex.score ?? '--'} - ${fearGreedIndex.category || 'Sentiment Pending'}` : '')
  const premiumDetails = premiumRow?.details || premiumIndex?.value
  const setupDetails = currentPriceRow?.details || keyPriceZones?.currentPrice
  const setupNote = [
    currentPriceRow?.interpretation,
    technicalAnalysis?.trend ? `Trend: ${technicalAnalysis.trend}.` : '',
    marketStructure?.regime ? `Structure: ${marketStructure.regime}.` : '',
  ].filter(Boolean).join(' ')
  const rangeNote = [
    rangeRow?.interpretation,
    technicalAnalysis?.volatility ? `Volatility: ${technicalAnalysis.volatility}.` : marketStructure?.volatility ? `Volatility: ${marketStructure.volatility}.` : '',
  ].filter(Boolean).join(' ')
  const sentimentPremiumValue = [sentimentDetails, premiumDetails].filter(Boolean).join(' | ')
  const sentimentPremiumNote = [
    fearGreedRow?.interpretation,
    premiumRow?.interpretation || premiumIndex?.description,
  ].filter(Boolean).join(' ')
  const aiOutlookValue = aiDecisionBrief?.marketStory || aiOutlook?.summary || aiRow?.interpretation
  const aiOutlookNote = [
    riskAssessment?.summary || riskRow?.interpretation,
    opportunityAssessment?.summary || opportunityRow?.interpretation,
  ].filter(Boolean).join(' ')
  const actionValue = aiDecisionBrief?.suggestedApproach || recommendedAction?.action || recommendedRow?.details
  const actionNote = recommendedAction?.summary || recommendedRow?.interpretation
  const safeRows = Array.isArray(rows) ? rows : []

  return (
    <Card className="market-intelligence-summary">
      <CardBody>
        <div className="intelligence-summary-header">
          <div>
            <div className="snapshot-label">Market Intelligence Summary</div>
            <p className="mb-0">{symbol || 'Selected asset'} levels, sentiment, and educational outlook in one scan.</p>
          </div>
          <Button
            className="detailed-table-toggle"
            color="light"
            size="sm"
            aria-expanded={showDetailedTable}
            onClick={() => setShowDetailedTable((isOpen) => !isOpen)}
          >
            {showDetailedTable ? 'Hide Detailed Table' : 'View Detailed Table'}
          </Button>
        </div>

        <div className="intelligence-summary-grid">
          <SummaryCard
            title="Current Setup"
            value={setupDetails}
            note={setupNote}
            bias={getBias(currentPriceRow)}
            badgeLabel={marketStructure?.regime || currentPriceRow?.badgeLabel}
          />
          <SummaryCard
            title="Price Range"
            value={rangeRow?.details}
            note={rangeNote}
            bias={getBias(rangeRow)}
            badgeLabel={technicalAnalysis?.volatility || rangeRow?.badgeLabel}
          />
          <SummaryCard
            title="Support Zones"
            value={supportLevels}
            note={supportRow?.interpretation || 'Support areas are zones to watch for stabilization, not guaranteed reversal points.'}
            bias={getBias(supportRow, 'buy')}
            badgeLabel="Watch Zone"
          />
          <SummaryCard
            title="Resistance Zones"
            value={resistanceLevels}
            note={resistanceRow?.interpretation || 'Resistance areas are zones to watch for supply and confirmation before breakout assumptions.'}
            bias={getBias(resistanceRow, 'sell')}
            badgeLabel="Trim Zone"
          />
          <SummaryCard
            title="Sentiment & Premium"
            value={sentimentPremiumValue}
            note={sentimentPremiumNote}
            bias={getBias(premiumRow || fearGreedRow)}
            badgeLabel={fearGreedIndex?.category || premiumIndex?.badgeLabel}
          />
          <SummaryCard
            title="AI Outlook"
            value={aiOutlookValue}
            note={aiOutlookNote}
            bias={aiOutlook?.bias || getBias(aiRow)}
            badgeLabel={aiDecisionBrief?.posture || aiOutlook?.headline}
          />
          <SummaryCard
            title="Recommended Action"
            value={actionValue}
            note={actionNote}
            bias={getBias(recommendedRow, aiOutlook?.bias || 'neutral')}
            badgeLabel={recommendedAction?.action || 'Educational Stance'}
            action
          />
        </div>

        {showDetailedTable && (
          <div className="detailed-table-wrap">
            <KeyLevelsTable
              rows={safeRows}
              aiOutlook={aiOutlook}
              riskAssessment={riskAssessment}
              opportunityAssessment={opportunityAssessment}
              recommendedAction={recommendedAction}
            />
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default MarketIntelligenceSummary
