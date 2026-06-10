import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { test } from 'node:test'

async function readSource(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

async function listFiles(path = '.') {
  const directory = new URL(`../../${path}`, import.meta.url)
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const nextPath = path === '.' ? entry.name : `${path}/${entry.name}`
    return entry.isDirectory() ? listFiles(nextPath) : [nextPath]
  }))

  return files.flat()
}

test('CryptoSelector keeps BTC free and premium assets visible with locks', async () => {
  const source = await readSource('src/components/CryptoSelector.jsx')

  assert.match(source, /const cryptoSymbols = \['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'\]/)
  assert.match(source, /const premiumSymbols = \['ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'\]/)
  assert.match(source, /premiumFeatureEnabled = false/)
  assert.match(source, /premiumFeatureEnabled && premiumSymbols\.includes/)
  assert.match(source, /crypto-lock-icon/)
  assert.match(source, /onPremiumAssetClick/)
})

test('UpgradeModal exposes premium assets and future features', async () => {
  const source = await readSource('src/components/UpgradeModal.jsx')

  assert.match(source, /Unlock Premium Assets/)
  assert.match(source, /Historical Analytics/)
  assert.match(source, /AI Intelligence/)
  assert.match(source, /Future Premium Features/)
  assert.match(source, /Learn More/)
})

test('ViewModeSelector renders overview and pro analysis states', async () => {
  const source = await readSource('src/components/ViewModeSelector.jsx')

  assert.match(source, /Overview/)
  assert.match(source, /View Mode/)
  assert.match(source, /Pro Analysis/)
  assert.doesNotMatch(source, /isProLocked/)
  assert.doesNotMatch(source, /view-mode-lock-icon/)
  assert.doesNotMatch(source, /view-mode-btn-locked/)
})

test('viewModeStorage persists only supported view modes', async () => {
  const source = await readSource('src/utils/viewModeStorage.js')

  assert.match(source, /VIEW_MODE_STORAGE_KEY = 'tezoro-view-mode'/)
  assert.match(source, /SUPPORTED_VIEW_MODES = \['overview', 'pro'\]/)
  assert.match(source, /getStoredViewMode\(defaultValue = 'overview'\)/)
  assert.match(source, /setStoredViewMode\(value\)/)
})

test('CryptoMarketDashboard defaults overview and allows pro analysis without premium gate', async () => {
  const source = await readSource('src/components/CryptoMarketDashboard.jsx')

  assert.match(source, /getStoredViewMode\('overview'\)/)
  assert.match(source, /const isProAnalysis = viewMode === 'pro'/)
  assert.doesNotMatch(source, /isProLocked/)
  assert.doesNotMatch(source, /setPremiumAssetRequested\('Pro Analysis'\)/)
  assert.match(source, /<ViewModeSelector/)
  assert.match(source, /isProAnalysis &&/)
})

test('AIIntelligenceCenter renders decision brief sections with fallback support', async () => {
  const source = await readSource('src/components/AIIntelligenceCenter.jsx')

  assert.match(source, /AI Intelligence Center/)
  assert.match(source, /Market Story/)
  assert.match(source, /Suggested Approach/)
  assert.match(source, /Key Risks/)
  assert.match(source, /Opportunities/)
  assert.match(source, /Why This Outlook/)
  assert.match(source, /buildFallbackBrief/)
  assert.match(source, /aiDecisionBrief/)
  assert.doesNotMatch(source, /â|ðŸ|�/)
})

test('MarketIntelligenceSummary renders cards and preserves detailed table', async () => {
  const source = await readSource('src/components/MarketIntelligenceSummary.jsx')

  assert.match(source, /Market Intelligence Summary/)
  assert.match(source, /View Detailed Table/)
  assert.match(source, /Hide Detailed Table/)
  assert.match(source, /KeyLevelsTable/)
  assert.match(source, /aria-expanded/)
  assert.match(source, /Current Setup/)
  assert.match(source, /Recommended Action/)
  assert.doesNotMatch(source, /Ã¢|Ã°Å¸|ï¿½/)
})

test('CryptoMarketDashboard uses MarketIntelligenceSummary in pro analysis', async () => {
  const source = await readSource('src/components/CryptoMarketDashboard.jsx')

  assert.match(source, /MarketIntelligenceSummary/)
  assert.match(source, /aiDecisionBrief=\{dashboardData\.aiDecisionBrief\}/)
  assert.doesNotMatch(source, /<KeyLevelsTable/)
})

test('KeyLevelsTable remains available and no TypeScript files were added', async () => {
  const keyLevelsSource = await readSource('src/components/KeyLevelsTable.jsx')
  const files = await listFiles('src')

  assert.match(keyLevelsSource, /function KeyLevelsTable/)
  assert.equal(files.filter((file) => file.endsWith('.ts') || file.endsWith('.tsx')).length, 0)
})

test('frontend fallback data includes AI decision brief', async () => {
  const source = await readSource('src/data/cryptoDashboardData.js')

  assert.match(source, /aiDecisionBrief/)
  assert.match(source, /buildFallbackDecisionBrief/)
  assert.match(source, /const supportedSymbols = \['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'\]/)
  assert.match(source, /export function getCryptoDashboardFallback\(symbol\)/)
  assert.match(source, /\.\.\.buildRollingPeriod\(\)/)
})

test('frontend fallback sentiment badges use Tezoro fear and greed ranges', async () => {
  const source = await readSource('src/data/cryptoDashboardData.js')

  assert.match(source, /Accumulation Watch/)
  assert.match(source, /Selective Buy Zone/)
  assert.match(source, /Trim \/ Risk Watch/)
  assert.doesNotMatch(source, /Contrarian Buy/)
  assert.doesNotMatch(source, /Selective Buy['"]/)
})

test('frontend fallback chart dates are rolling, not fixed to an old seed date', async () => {
  const source = await readSource('src/data/cryptoDashboardData.js')

  assert.match(source, /const endDate = Date\.UTC\(today\.getUTCFullYear\(\), today\.getUTCMonth\(\), today\.getUTCDate\(\)\)/)
  assert.doesNotMatch(source, /Date\.UTC\(2025,\s*5,\s*1\)/)
})

test('SystemStatusCard renders diagnostics labels', async () => {
  const source = await readSource('src/components/SystemStatusCard.jsx')

  assert.match(source, /Price Provider/)
  assert.match(source, /Premium Provider/)
  assert.match(source, /Sentiment Provider/)
  assert.match(source, /Cache Status/)
})

test('CryptoMarketDashboard refreshes fallback outlook dates when fallback data is used', async () => {
  const source = await readSource('src/components/CryptoMarketDashboard.jsx')

  assert.match(source, /getCryptoDashboardFallback\('BTC'\)/)
  assert.match(source, /getCryptoDashboardFallback\(symbol\)/)
  assert.doesNotMatch(source, /cryptoDashboardData\[symbol\]/)
})
