import { Card, CardBody } from 'reactstrap'

function MarketStructurePanel({ marketStructure }) {
  if (!marketStructure) {
    return null
  }

  const items = [
    { label: 'Trend', value: marketStructure.trend },
    { label: 'Regime', value: marketStructure.regime },
    { label: 'SMA 20', value: marketStructure.priceVsSma20 },
    { label: 'SMA 50', value: marketStructure.priceVsSma50 },
    { label: 'SMA 200', value: marketStructure.priceVsSma200 },
    { label: 'Volatility', value: marketStructure.volatility },
    { label: 'Momentum', value: marketStructure.momentum },
  ]

  return (
    <Card className="market-structure-panel">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">Market Structure</div>
            <p className="mb-0">{marketStructure.summary || 'Market structure is being calculated.'}</p>
          </div>
          <strong>{marketStructure.regime || 'Neutral'}</strong>
        </div>

        <div className="market-structure-grid">
          {items.map((item) => (
            <div className="market-structure-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value || 'Pending'}</strong>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default MarketStructurePanel
