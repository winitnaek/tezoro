function formatDiagnostic(value) {
  if (!value) {
    return 'Unavailable'
  }

  return String(value)
}

function MarketSignalPanel({ marketSignal, signalConfidence, providerDiagnostics }) {
  if (!marketSignal) {
    return null
  }

  return (
    <div className="market-signal-panel phase4-signal-card">
      <div className="signal-panel-top">
        <div className="signal-score-block">
          <h3 className="signal-card-title">Calculated Market Signal</h3>
          <div className="signal-score-row">
            <div className="signal-score-value">{marketSignal.score}</div>
            <div className="signal-panel-title">{marketSignal.label}</div>
          </div>
        </div>

        <div className="signal-bars">
          {marketSignal.signals.map((signal) => (
            <div className="signal-bar-row" key={signal.label}>
              <div className="signal-bar-meta">
                <span>{signal.label}</span>
                <span>{signal.value}</span>
              </div>
              <div className="signal-bar-track">
                <div className="signal-bar-fill" style={{ width: `${signal.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {signalConfidence && (
          <div className="confidence-box">
            <div className="confidence-label">Signal Confidence</div>
            <div className="confidence-value">{signalConfidence.score}</div>
            <div className="signal-panel-title">{signalConfidence.label}</div>
            <p>{signalConfidence.notes}</p>
          </div>
        )}
      </div>

      {providerDiagnostics && (
        <div className="data-quality-card">
          <div className="dq-title">Data Quality</div>
          <div className="dq-grid">
            <div className="dq-row">
              <span>Price</span>
              <span className="quality-badge">{formatDiagnostic(providerDiagnostics.price)}</span>
            </div>
            <div className="dq-row">
              <span>Premium</span>
              <span className="quality-badge">{formatDiagnostic(providerDiagnostics.premium)}</span>
            </div>
            <div className="dq-row">
              <span>Sentiment</span>
              <span className="quality-badge">{formatDiagnostic(providerDiagnostics.sentiment)}</span>
            </div>
            <div className="dq-row">
              <span>Cache</span>
              <span className="quality-badge">{formatDiagnostic(providerDiagnostics.cache)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketSignalPanel
