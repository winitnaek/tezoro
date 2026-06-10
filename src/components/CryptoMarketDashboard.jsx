import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Container } from 'reactstrap'
import { getCryptoDashboardFallback } from '../data/cryptoDashboardData.js'
import useRefreshCooldown from '../hooks/useRefreshCooldown.js'
import { getMarketOutlook } from '../services/marketApi.js'
import { getStoredTheme, storeTheme } from '../utils/themeStorage.js'
import { getStoredViewMode, setStoredViewMode } from '../utils/viewModeStorage.js'
import AIIntelligenceCenter from './AIIntelligenceCenter.jsx'
import CryptoSelector from './CryptoSelector.jsx'
import CurrentSnapshot from './CurrentSnapshot.jsx'
import HistoricalPerformanceCards from './HistoricalPerformanceCards.jsx'
import KeyPriceZonesChart from './KeyPriceZonesChart.jsx'
import MarketIntelligenceSummary from './MarketIntelligenceSummary.jsx'
import MarketStructurePanel from './MarketStructurePanel.jsx'
import MarketSignalPanel from './MarketSignalPanel.jsx'
import QuickTakeaways from './QuickTakeaways.jsx'
import SystemStatusCard from './SystemStatusCard.jsx'
import TechnicalAnalysisCards from './TechnicalAnalysisCards.jsx'
import TechnicalRatingGauge from './TechnicalRatingGauge.jsx'
import UpgradeModal from './UpgradeModal.jsx'
import ViewModeSelector from './ViewModeSelector.jsx'
import tezoroLogo from '../assets/tezoro-logo.png'
import tezoroWordmark from '../assets/tezoro-wordmark.svg'

const PerformanceComparison = lazy(() => import('./PerformanceComparison.jsx'))
const PriceHistoryChart = lazy(() => import('./PriceHistoryChart.jsx'))
const premiumFeatureEnabled = import.meta.env.VITE_PREMIUM_FEATURE_ENABLED === 'true'

function CryptoMarketDashboard() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [theme, setTheme] = useState(() => getStoredTheme('light'))
  const [viewMode, setViewMode] = useState(() => {
    const storedViewMode = getStoredViewMode('overview')
    if (premiumFeatureEnabled && storedViewMode === 'pro') {
      setStoredViewMode('overview')
      return 'overview'
    }

    return storedViewMode
  })
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [premiumAssetRequested, setPremiumAssetRequested] = useState('')
  const [dashboardData, setDashboardData] = useState({
    ...getCryptoDashboardFallback('BTC'),
    dataSource: 'fallback',
    lastUpdated: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [marketError, setMarketError] = useState('')
  const requestIdRef = useRef(0)
  const { cooldownRemaining, isCoolingDown, startCooldown } = useRefreshCooldown(10)

  const themeOptions = [
    { key: 'dark', label: 'Dark' },
    { key: 'light', label: 'Light' },
    { key: 'high-contrast', label: 'High Contrast' },
  ]

  const isProLocked = premiumFeatureEnabled
  const isProAnalysis = viewMode === 'pro' && !isProLocked

  function handleSelectViewMode(nextViewMode) {
    if (nextViewMode === 'overview') {
      setViewMode('overview')
      setStoredViewMode('overview')
      return
    }

    if (nextViewMode === 'pro' && isProLocked) {
      setViewMode('overview')
      setStoredViewMode('overview')
      setPremiumAssetRequested('Pro Analysis')
      setIsUpgradeModalOpen(true)
      return
    }

    if (nextViewMode === 'pro') {
      setViewMode('pro')
      setStoredViewMode('pro')
    }
  }

  async function loadMarketOutlook(symbol, { manual = false } = {}) {
    if (manual && isCoolingDown) {
      return
    }

    if (manual) {
      startCooldown()
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setIsLoading(true)
    setMarketError('')

    setDashboardData((currentData) => {
      if (currentData?.symbol === symbol) {
        return currentData
      }

      return {
        ...getCryptoDashboardFallback(symbol),
        dataSource: 'fallback',
        lastUpdated: ''
      }
    })

    try {
      const nextData = await getMarketOutlook(symbol)

      if (requestId === requestIdRef.current) {
        setDashboardData(nextData)
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setDashboardData({
          ...getCryptoDashboardFallback(symbol),
          dataSource: 'fallback',
          lastUpdated: new Date().toISOString()
        })
        setMarketError('Price provider unavailable. Using fallback market data. Sentiment may use fallback estimates.')
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadMarketOutlook(selectedCrypto)
  }, [selectedCrypto])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    storeTheme(theme)
  }, [theme])

  useEffect(() => {
    if (isProLocked && viewMode === 'pro') {
      setViewMode('overview')
      setStoredViewMode('overview')
    }
  }, [isProLocked, viewMode])

  const providerLabel = dashboardData.priceProvider === 'coinmarketcap'
    ? 'CoinMarketCap'
    : dashboardData.priceProvider === 'coinbase'
      ? 'Coinbase'
    : dashboardData.priceProvider === 'coingecko'
      ? 'CoinGecko'
      : ''
  const dataSourceLabel = dashboardData.dataSource === 'live'
    ? `Live Data${providerLabel ? ` - ${providerLabel}` : ''}`
    : 'Fallback Data'
  const confidenceLabel = dashboardData.signalConfidence?.label || 'Confidence Pending'
  const lastUpdatedLabel = dashboardData.lastUpdated
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }).format(new Date(dashboardData.lastUpdated))
    : 'Pending'
  const refreshLabel = isLoading
    ? 'Refreshing...'
    : isCoolingDown
      ? `Refresh (${cooldownRemaining}s)`
      : 'Refresh'

  return (
    <main className="app-shell">
      <Container fluid="xl">
        <section className="brand-header">
          <div className="brand-header-content">
            <div className="brand-lockup">
              <div className="brand-logo">
                <img
                  className="brand-logo-img"
                  src={tezoroLogo}
                  alt="Tezoro Crypto Intelligence logo"
                />
              </div>
              <div>
                <img
                  className="brand-wordmark"
                  src={tezoroWordmark}
                  alt="Tezoro Crypto Intelligence"
                />
              </div>
            </div>

            <div className="brand-controls">
              <div className="brand-control-group">
                <span className="brand-control-label">Theme</span>
                <div className="theme-switcher" aria-label="Theme switcher">
                  {themeOptions.map((option) => (
                    <Badge
                      key={option.key}
                      pill
                      role="button"
                      tabIndex="0"
                      className={`theme-pill ${theme === option.key ? 'theme-pill-active' : ''}`}
                      onClick={() => setTheme(option.key)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setTheme(option.key)
                        }
                      }}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <ViewModeSelector
                viewMode={viewMode}
                onSelectViewMode={handleSelectViewMode}
                isProLocked={isProLocked}
              />
            </div>
          </div>
        </section>

        <section className="dashboard-overview phase4-hero-stack">
          <article className="dashboard-header dashboard-hero">
            <div className="hero-copy">
              <div className="hero-title-row">
                <h2 className="market-outlook-title">
                  <span className="brand-accent">{dashboardData.symbol}</span> Market Outlook
                </h2>
                <div className="market-status-pill">{dashboardData.marketSignal.status}</div>
              </div>
              <p className="dashboard-subtitle">Next 1-2 Weeks Market Intelligence</p>
              <div className="hero-meta-row">
                <span>{dashboardData.period.startDate} - {dashboardData.period.endDate}</span>
                <span>Current Snapshot: {dashboardData.snapshotDate}</span>
              </div>
              <div className="market-data-status" style={{flexDirection:'row'}}>
                <div className="market-status-actions">
                  <span className={dashboardData.dataSource === 'live' ? 'live-data-badge' : 'fallback-data-badge'}>
                    {dataSourceLabel}
                  </span>
                  <span className="confidence-status-badge">{confidenceLabel}</span>
                  <span className="updated-text">Last updated: {lastUpdatedLabel}</span>
                  <Button
                    className="refresh-btn"
                    color="light"
                    size="sm"
                    disabled={isLoading || isCoolingDown}
                    onClick={() => loadMarketOutlook(selectedCrypto, { manual: true })}
                  >
                    {refreshLabel}
                  </Button>
                </div>
                <CryptoSelector
                  selectedCrypto={selectedCrypto}
                  onSelectCrypto={setSelectedCrypto}
                  premiumFeatureEnabled={premiumFeatureEnabled}
                  onPremiumAssetClick={(symbol) => {
                    setPremiumAssetRequested(symbol)
                    setIsUpgradeModalOpen(true)
                  }}
                />
              </div>
            </div>
          </article>

          {isProAnalysis && (
            <MarketSignalPanel
              marketSignal={dashboardData.marketSignal}
              signalConfidence={dashboardData.signalConfidence}
              providerDiagnostics={dashboardData.providerDiagnostics}
            />
          )}
        </section>

        {marketError && (
          <Alert color="warning" className="market-error-alert">
            {marketError}
          </Alert>
        )}

        {isLoading && (
          <div className="loading-market-panel">
            Loading market intelligence...
          </div>
        )}

        <section className="market-section">
          <h2 className="market-section-title">Current Snapshot</h2>
          <CurrentSnapshot data={dashboardData} />
        </section>

        {isProAnalysis && (
          <>
            <section className="market-section">
              <h2 className="market-section-title">Historical Performance</h2>
              <HistoricalPerformanceCards historicalPerformance={dashboardData.historicalPerformance} />
            </section>

            <section className="market-section">
              <MarketStructurePanel marketStructure={dashboardData.marketStructure} />
            </section>

            <section className="market-section">
              <h2 className="market-section-title">Technical Analysis</h2>
              <TechnicalAnalysisCards technicalAnalysis={dashboardData.technicalAnalysis} />
            </section>

            <section className="market-section">
              <TechnicalRatingGauge technicalRating={dashboardData.technicalRating} />
            </section>

            <section className="market-section">
              <KeyPriceZonesChart keyPriceZones={dashboardData.keyPriceZones} symbol={dashboardData.symbol} />
            </section>
          </>
        )}

        <section className="market-section">
          <Suspense fallback={<div className="loading-market-panel">Loading price history...</div>}>
            <PriceHistoryChart priceHistory={dashboardData.priceHistory} symbol={dashboardData.symbol} />
          </Suspense>
        </section>

        <section className="market-section">
          <AIIntelligenceCenter
            intelligenceScore={dashboardData.intelligenceScore}
            aiOutlook={dashboardData.aiOutlook}
            riskAssessment={dashboardData.riskAssessment}
            opportunityAssessment={dashboardData.opportunityAssessment}
            recommendedAction={dashboardData.recommendedAction}
            aiDecisionBrief={dashboardData.aiDecisionBrief}
          />
        </section>

        {isProAnalysis && (
          <>
            <section className="market-section">
              <MarketIntelligenceSummary
                rows={dashboardData.outlookRows}
                symbol={dashboardData.symbol}
                aiDecisionBrief={dashboardData.aiDecisionBrief}
                aiOutlook={dashboardData.aiOutlook}
                riskAssessment={dashboardData.riskAssessment}
                opportunityAssessment={dashboardData.opportunityAssessment}
                recommendedAction={dashboardData.recommendedAction}
                keyPriceZones={dashboardData.keyPriceZones}
                premiumIndex={dashboardData.premiumIndex}
                fearGreedIndex={dashboardData.fearGreedIndex}
                marketStructure={dashboardData.marketStructure}
                technicalAnalysis={dashboardData.technicalAnalysis}
              />
            </section>

            <section className="market-section">
              <Suspense fallback={<div className="loading-market-panel">Loading performance comparison...</div>}>
                <PerformanceComparison comparisonPerformance={dashboardData.comparisonPerformance} />
              </Suspense>
            </section>
          </>
        )}

        <section className="market-section">
          <h2 className="market-section-title">Quick Takeaways</h2>
          <QuickTakeaways takeaways={dashboardData.takeaways} />
        </section>

        {isProAnalysis && (
          <section className="market-section">
            <SystemStatusCard providerDiagnostics={dashboardData.providerDiagnostics} />
          </section>
        )}

        <Alert color="warning" className="disclaimer-alert">
          Tezoro Crypto Intelligence provides market intelligence and educational insights only, not financial advice.
        </Alert>

        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          requestedAsset={premiumAssetRequested}
          toggle={() => setIsUpgradeModalOpen((isOpen) => !isOpen)}
        />
      </Container>
    </main>
  )
}

export default CryptoMarketDashboard
