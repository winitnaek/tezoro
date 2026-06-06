import { Line, LineChart, ResponsiveContainer } from 'recharts'

function MiniSparkline({ data = [], direction = 'neutral' }) {
  if (!data.length) {
    return null
  }

  const chartData = data.map((value, index) => ({
    index,
    value,
  }))

  const strokeByDirection = {
    up: '#22c55e',
    down: '#ef4444',
    neutral: '#38bdf8',
  }

  return (
    <div className="mini-sparkline" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeByDirection[direction] || strokeByDirection.neutral}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniSparkline
