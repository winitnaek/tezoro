import { useMemo, useState } from 'react'
import { Card, CardBody } from 'reactstrap'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatPrice(value) {
  if (!Number.isFinite(value)) {
    return '-'
  }

  if (value < 1) {
    return `$${value.toFixed(4)}`
  }

  if (value < 100) {
    return `$${value.toFixed(2)}`
  }

  return `$${Math.round(value).toLocaleString('en-US')}`
}

function PriceHistoryChart({ priceHistory, symbol }) {
  const ranges = priceHistory?.ranges || ['7D', '30D', '90D', '1Y']
  const [selectedRange, setSelectedRange] = useState(priceHistory?.defaultRange || '30D')
  const chartData = useMemo(() => priceHistory?.series?.[selectedRange] || [], [priceHistory, selectedRange])

  if (!priceHistory) {
    return null
  }

  return (
    <Card className="price-history-card">
      <CardBody>
        <div className="key-price-zone-header">
          <div>
            <div className="snapshot-label">{symbol} Price History</div>
            <p className="mb-0">Historical analytics are informational only.</p>
          </div>
          <div className="price-range-controls" aria-label="Price history range">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                className={`price-range-btn ${selectedRange === range ? 'price-range-btn-active' : ''}`}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {chartData.length ? (
          <div className="price-history-chart">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={28} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={72}
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={formatPrice}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(Number(value)), 'Price']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    background: 'var(--tz-panel)',
                    border: '1px solid var(--tz-border)',
                    borderRadius: '10px',
                    color: 'var(--tz-text)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--tz-blue)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: 'var(--tz-gold)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="phase5-empty-state">Price history is unavailable for this range.</div>
        )}
      </CardBody>
    </Card>
  )
}

export default PriceHistoryChart
