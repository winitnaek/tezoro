const assert = require('node:assert/strict');
const test = require('node:test');

const { buildAiNarrative } = require('../src/engine/aiNarrativeEngine');
const { getFearGreedCategory, getFearGreedSignal } = require('../src/engine/fearGreedEngine');
const { buildHistoricalPerformance } = require('../src/engine/historicalAnalyticsEngine');
const { buildMarketStructure } = require('../src/engine/marketRegimeEngine');
const { buildSignalConfidence } = require('../src/engine/signalConfidenceEngine');
const { buildMarketSignal } = require('../src/engine/signalScoreEngine');
const { buildTechnicalAnalysis } = require('../src/engine/technicalAnalysisEngine');
const { buildTechnicalRating } = require('../src/engine/technicalRatingEngine');
const { buildMarketOutlook } = require('../src/engine/outlookEngine');
const fallbackMarketData = require('../src/data/fallbackMarketData');

function buildChart(days = 120, start = 100) {
  const startTime = Date.UTC(2026, 0, 1);

  return Array.from({ length: days }, (_, index) => [
    startTime + index * 24 * 60 * 60 * 1000,
    start + index * 1.2
  ]);
}

test('historicalAnalyticsEngine calculates core performance windows', () => {
  const performance = buildHistoricalPerformance({ chartData: buildChart(), fallback: null });

  assert.equal(typeof performance.change7d, 'number');
  assert.equal(typeof performance.change30d, 'number');
  assert.equal(typeof performance.change90d, 'number');
});

test('marketRegimeEngine returns a market structure classification', () => {
  const structure = buildMarketStructure({
    currentPrice: 245,
    chartData: buildChart(220),
    technicalAnalysis: {
      trend: 'Bullish',
      momentum: 'Positive',
      momentumScore: 72,
      volatility: 'Moderate',
      volatilityScore: 40,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Above SMA50'
    },
    fallback: null
  });

  assert.ok(['Accumulation', 'Expansion', 'Trend', 'Distribution', 'Correction', 'Capitulation', 'Neutral'].includes(structure.regime));
  assert.equal(structure.priceVsSma20, 'Above SMA20');
});

test('technicalAnalysisEngine aligns fallback SMA labels to live current price', () => {
  const technicalAnalysis = buildTechnicalAnalysis({
    symbol: 'LTC',
    currentPrice: 50,
    chartData: null,
    fallback: {
      sma20: 83.6,
      sma50: 86.8,
      trend: 'Neutral',
      trendBias: 'neutral',
      momentum: 'Neutral',
      momentumScore: 56,
      volatility: 'Moderate',
      volatilityScore: 51,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Below SMA50',
      sevenDayChange: '-1.4%',
      thirtyDayChange: '2.2%'
    }
  });

  assert.equal(technicalAnalysis.priceVsSma20, 'Below SMA20');
  assert.equal(technicalAnalysis.priceVsSma50, 'Below SMA50');
  assert.equal(technicalAnalysis.trend, 'Bearish');
  assert.equal(technicalAnalysis.source, 'fallback');
});

test('signalScoreEngine preserves compatible market signal shape', () => {
  const signal = buildMarketSignal({
    technicalAnalysis: {
      trendBias: 'buy',
      momentumScore: 70,
      volatilityScore: 35
    },
    fearGreedIndex: { score: 28 },
    premiumIndex: { value: '0.1%' },
    premiumSource: 'live',
    sentimentSource: 'alternative-me'
  });

  assert.equal(typeof signal.score, 'number');
  assert.equal(signal.signals.length, 3);
});

test('technicalRatingEngine creates Tezoro market posture gauges', () => {
  const rating = buildTechnicalRating({
    marketSignal: { score: 62 },
    signalConfidence: { score: 76 },
    fearGreedIndex: { score: 30 },
    historicalPerformance: { change7d: 2.1, change30d: 4.2 },
    marketStructure: {
      regime: 'Accumulation',
      priceVsSma200: 'Above SMA200'
    },
    technicalAnalysis: {
      trendBias: 'buy',
      momentumScore: 64,
      volatilityScore: 42,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Above SMA50'
    },
    premiumIndex: { value: '0.1%' }
  });

  assert.equal(typeof rating.summary.score, 'number');
  assert.ok(['Strong Risk-Off', 'Risk-Off', 'Neutral', 'Constructive', 'Strong Constructive'].includes(rating.summary.label));
  assert.equal(typeof rating.oscillators.constructive, 'number');
  assert.equal(typeof rating.movingAverages.riskOff, 'number');
});

test('signalConfidenceEngine scores availability inputs', () => {
  const confidence = buildSignalConfidence({
    dataSource: 'live',
    chartAvailable: true,
    premiumSource: 'live',
    sentimentSource: 'alternative-me',
    technicalAnalysis: { trend: 'Bullish' },
    keyPriceZones: { supportLevels: [100] },
    providerErrors: []
  });

  assert.equal(typeof confidence.score, 'number');
  assert.ok(confidence.score >= 70);
});

test('aiNarrativeEngine creates deterministic narrative fields', () => {
  const narrative = buildAiNarrative({
    symbol: 'BTC',
    marketSignal: { score: 72 },
    signalConfidence: { score: 80, label: 'High Confidence' },
    fearGreedIndex: { score: 25 },
    historicalPerformance: { change7d: 2.2, change30d: 8.4 },
    marketStructure: { regime: 'Trend' },
    technicalAnalysis: {
      trend: 'Bullish',
      trendBias: 'buy',
      momentum: 'Positive',
      volatility: 'Moderate',
      volatilityScore: 36
    },
    premiumIndex: { value: '0.2%' },
    keyPriceZones: { supportLevels: [100] }
  });

  assert.equal(typeof narrative.intelligenceScore.score, 'number');
  assert.ok(narrative.aiOutlook.headline.includes('BTC'));
  assert.ok(narrative.recommendedAction.action);
  assert.ok(narrative.aiDecisionBrief);
  assert.ok(narrative.aiDecisionBrief.marketStory);
  assert.ok(narrative.aiDecisionBrief.suggestedApproach);
  assert.ok(Array.isArray(narrative.aiDecisionBrief.keyRisks));
  assert.ok(Array.isArray(narrative.aiDecisionBrief.opportunities));
  assert.ok(Array.isArray(narrative.aiDecisionBrief.whyThisOutlook));
  assert.ok(narrative.aiDecisionBrief.confidenceLabel);
});

test('fallback market data includes AI decision brief for every supported asset', () => {
  const symbols = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'];

  symbols.forEach((symbol) => {
    assert.ok(fallbackMarketData[symbol].aiDecisionBrief, `${symbol} should include aiDecisionBrief`);
    assert.ok(fallbackMarketData[symbol].aiDecisionBrief.marketStory);
    assert.ok(fallbackMarketData[symbol].aiDecisionBrief.suggestedApproach);
  });
});

test('fear and greed score maps to Tezoro sentiment badge ranges', () => {
  const cases = [
    [24, 'Extreme Fear', 'Accumulation Watch'],
    [25, 'Fear', 'Selective Buy Zone'],
    [44, 'Fear', 'Selective Buy Zone'],
    [45, 'Neutral', 'Neutral'],
    [55, 'Neutral', 'Neutral'],
    [56, 'Greed', 'Caution'],
    [74, 'Greed', 'Caution'],
    [75, 'Extreme Greed', 'Trim / Risk Watch']
  ];

  cases.forEach(([score, category, badgeLabel]) => {
    assert.equal(getFearGreedCategory(score), category);
    assert.equal(getFearGreedSignal(score).badgeLabel, badgeLabel);
  });
});

test('fallback price history ends on the current UTC date', () => {
  const today = new Date();
  const expectedDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    .toISOString()
    .slice(0, 10);
  const series = fallbackMarketData.BTC.priceHistory.series['1Y'];

  assert.equal(series.at(-1).date, expectedDate);
});

test('market outlook refreshes header dates on each request', async () => {
  const outlook = await buildMarketOutlook('BTC');
  const today = new Date();
  const expectedSnapshotDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(today);
  const expectedEndDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14));

  assert.equal(outlook.snapshotDate, expectedSnapshotDate);
  assert.equal(outlook.period.startDate, expectedSnapshotDate);
  assert.equal(outlook.period.endDate, expectedEndDate);
});
