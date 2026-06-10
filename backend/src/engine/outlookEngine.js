const fallbackMarketData = require('../data/fallbackMarketData');
const { getFearGreedCategory, getFearGreedDescription, getFearGreedSignal } = require('./fearGreedEngine');
const { buildKeyPriceZones } = require('./supportResistanceEngine');
const { buildAiNarrative } = require('./aiNarrativeEngine');
const { buildHistoricalPerformance, buildPriceHistory } = require('./historicalAnalyticsEngine');
const { buildMarketStructure } = require('./marketRegimeEngine');
const { buildPerformanceComparison } = require('./performanceComparisonEngine');
const { buildSignalConfidence } = require('./signalConfidenceEngine');
const { buildMarketSignal } = require('./signalScoreEngine');
const { buildTechnicalAnalysis } = require('./technicalAnalysisEngine');
const { buildTechnicalRating } = require('./technicalRatingEngine');
const {
  fetchLiveMarketPrice,
  getComparisonChartData,
  getMarketChartData,
  getPriceHistoryData
} = require('../services/marketDataService');
const { calculatePremium } = require('../services/premiumService');
const { getSentiment } = require('../services/sentimentService');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function buildRollingPeriod(date = new Date()) {
  return {
    period: {
      startDate: formatDisplayDate(date),
      endDate: formatDisplayDate(addDays(date, 14))
    },
    snapshotDate: formatDisplayDate(date)
  };
}

function formatUsdPrice(value) {
  if (!Number.isFinite(value)) {
    return '';
  }

  if (value < 1) {
    return `~$${value.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 4
    })}`;
  }

  if (value < 100) {
    return `~$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  return `~$${Math.round(value).toLocaleString('en-US')}`;
}

function getChangeDirection(change24h) {
  if (!Number.isFinite(change24h)) {
    return 'neutral';
  }

  if (change24h > 0.25) {
    return 'up';
  }

  if (change24h < -0.25) {
    return 'down';
  }

  return 'neutral';
}

function mergeLivePrice(baseOutlook, liveData) {
  const currentPrice = formatUsdPrice(liveData.priceUsd);
  const changeText = Number.isFinite(liveData.change24h) ? `${liveData.change24h.toFixed(1)}%` : baseOutlook.snapshotTrend.currentPriceChange;
  const nextOutlook = {
    ...baseOutlook,
    currentPrice,
    dataSource: 'live',
    priceProvider: liveData.provider,
    lastUpdated: new Date().toISOString(),
    snapshotTrend: {
      ...baseOutlook.snapshotTrend,
      currentPriceChange: changeText,
      currentPriceDirection: getChangeDirection(liveData.change24h)
    }
  };

  nextOutlook.outlookRows = baseOutlook.outlookRows.map((row) =>
    row.metric === 'Current Price' ? { ...row, details: currentPrice } : row
  );

  if (Array.isArray(baseOutlook.sparklines?.currentPrice)) {
    const normalizedPrice = liveData.priceUsd >= 1000 ? liveData.priceUsd / 1000 : liveData.priceUsd;
    nextOutlook.sparklines = {
      ...baseOutlook.sparklines,
      currentPrice: [...baseOutlook.sparklines.currentPrice.slice(1), Number(normalizedPrice.toFixed(3))]
    };
  }

  return nextOutlook;
}

function formatLevel(value) {
  if (!Number.isFinite(value)) {
    return '';
  }

  return formatUsdPrice(value).replace('~', '');
}

function applyFearGreedCategory(outlook) {
  const score = outlook.fearGreedIndex?.score;
  const category = getFearGreedCategory(score);
  const description = getFearGreedDescription(category);
  const { bias, badgeLabel } = getFearGreedSignal(score);

  return {
    ...outlook,
    fearGreedIndex: {
      ...outlook.fearGreedIndex,
      category,
      description,
      bias,
      badgeLabel
    },
    outlookRows: outlook.outlookRows.map((row) =>
      row.metric === 'Fear & Greed Index'
        ? {
            ...row,
            details: `${score} - ${category}`
          }
        : row
    )
  };
}

function parsePremiumValue(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value.replace(/[%,$,\s]/g, ''));

  return Number.isFinite(parsed) ? parsed : null;
}

function getPremiumDescription(outlook) {
  const premiumValue = parsePremiumValue(outlook.premiumIndex?.value);
  const label = outlook.premiumIndexLabel || 'Exchange Premium Index';

  if (!Number.isFinite(premiumValue)) {
    return outlook.premiumIndex?.description || '';
  }

  if (Math.abs(premiumValue) < 0.01) {
    return `${label} is near zero, so prices are aligned and global buying/selling pressure is balanced.`;
  }

  if (premiumValue > 0) {
    return `${label} is positive, meaning exchange pricing is stronger than global markets. This suggests stronger buying demand.`;
  }

  return `${label} is negative, meaning exchange pricing is weaker than global markets. This suggests softer demand or selling pressure.`;
}

function applyPremiumDescription(outlook) {
  return {
    ...outlook,
    premiumIndex: {
      ...outlook.premiumIndex,
      description: getPremiumDescription(outlook)
    }
  };
}

function getBestTechnicalChartData(chartResult, priceHistoryResult) {
  const candidates = [
    { result: chartResult, source: chartResult?.provider ? 'live' : null },
    { result: priceHistoryResult?.['90D'], source: 'live 90D' },
    { result: priceHistoryResult?.['1Y'], source: 'live 1Y' },
    { result: priceHistoryResult?.['30D'], source: 'live 30D' },
    { result: priceHistoryResult?.['7D'], source: 'live 7D' }
  ];

  const selected = candidates.find(({ result }) => Array.isArray(result?.prices) && result.prices.length >= 20);

  return {
    chartData: selected?.result?.prices || null,
    source: selected?.source || 'fallback',
    provider: selected?.result?.provider || chartResult?.provider || 'fallback'
  };
}

function enhanceOutlookWithIntelligence({
  outlook,
  technicalAnalysis,
  keyPriceZones,
  signalConfidence,
  providerDiagnostics,
  historicalPerformance,
  marketStructure,
  priceHistory,
  comparisonPerformance
}) {
  const marketSignal = buildMarketSignal({
    technicalAnalysis,
    fearGreedIndex: outlook.fearGreedIndex,
    premiumIndex: outlook.premiumIndex,
    premiumSource: outlook.premiumSource,
    sentimentSource: outlook.sentimentSource
  });
  const technicalRating = buildTechnicalRating({
    marketSignal,
    signalConfidence,
    fearGreedIndex: outlook.fearGreedIndex,
    historicalPerformance,
    marketStructure,
    technicalAnalysis,
    premiumIndex: outlook.premiumIndex
  });
  const supportText = Array.isArray(keyPriceZones?.supportLevels)
    ? keyPriceZones.supportLevels.map(formatLevel).join(', ')
    : '';
  const resistanceText = Array.isArray(keyPriceZones?.resistanceLevels)
    ? keyPriceZones.resistanceLevels.map(formatLevel).join(', ')
    : '';
  const rangeText = Number.isFinite(keyPriceZones?.rangeLow) && Number.isFinite(keyPriceZones?.rangeHigh)
    ? `${formatLevel(keyPriceZones.rangeLow)} - ${formatLevel(keyPriceZones.rangeHigh)}`
    : '';
  const baseText = Number.isFinite(keyPriceZones?.baseLow) && Number.isFinite(keyPriceZones?.baseHigh)
    ? ` (Base: ${formatLevel(keyPriceZones.baseLow)} - ${formatLevel(keyPriceZones.baseHigh)})`
    : '';
  const aiNarrative = buildAiNarrative({
    symbol: outlook.symbol,
    marketSignal,
    signalConfidence,
    fearGreedIndex: outlook.fearGreedIndex,
    historicalPerformance,
    marketStructure,
    technicalAnalysis,
    premiumIndex: outlook.premiumIndex,
    keyPriceZones
  });
  const updatedOutlookRows = outlook.outlookRows.map((row) => {
    if (row.metric === '1-2 Week Price Range' && rangeText) {
      return {
        ...row,
        details: `${rangeText}${baseText}`,
        interpretation: `${technicalAnalysis.trend} structure with ${technicalAnalysis.volatility.toLowerCase()} volatility.`
      };
    }

    if (row.metric === 'Key Support Levels' && supportText) {
      return {
        ...row,
        details: supportText,
        interpretation: 'Support zones are calculated from recent market structure.'
      };
    }

    if (row.metric === 'Key Resistance Levels' && resistanceText) {
      return {
        ...row,
        details: resistanceText,
        interpretation: 'Resistance zones are calculated from recent market structure.'
      };
    }

    if (row.metric === 'Recommended Overall Action') {
      return {
        ...row,
        interpretation: `${technicalAnalysis.trend} trend with ${technicalAnalysis.momentum.toLowerCase()} momentum. Keep entries staged near support and trim into resistance.`
      };
    }

    return row;
  });
  const aiRows = [
    {
      metric: 'AI Outlook',
      details: aiNarrative.aiOutlook.headline,
      interpretation: aiNarrative.aiOutlook.summary,
      bias: aiNarrative.aiOutlook.bias
    },
    {
      metric: 'AI Risk Assessment',
      details: aiNarrative.riskAssessment.level,
      interpretation: aiNarrative.riskAssessment.summary,
      bias: aiNarrative.riskAssessment.level === 'High' ? 'sell' : aiNarrative.riskAssessment.level === 'Moderate' ? 'caution' : 'neutral'
    },
    {
      metric: 'AI Opportunity Assessment',
      details: aiNarrative.opportunityAssessment.level,
      interpretation: aiNarrative.opportunityAssessment.summary,
      bias: ['Strong', 'Exceptional'].includes(aiNarrative.opportunityAssessment.level) ? 'buy' : aiNarrative.opportunityAssessment.level === 'Selective' ? 'neutral' : 'caution'
    },
    {
      metric: 'Recommended Action',
      details: aiNarrative.recommendedAction.action,
      interpretation: aiNarrative.recommendedAction.summary,
      bias: aiNarrative.aiOutlook.bias
    }
  ];

  return {
    ...outlook,
    technicalAnalysis,
    keyPriceZones,
    historicalPerformance,
    marketStructure,
    technicalRating,
    priceHistory,
    comparisonPerformance,
    intelligenceScore: aiNarrative.intelligenceScore,
    aiOutlook: aiNarrative.aiOutlook,
    riskAssessment: aiNarrative.riskAssessment,
    opportunityAssessment: aiNarrative.opportunityAssessment,
    recommendedAction: aiNarrative.recommendedAction,
    aiDecisionBrief: aiNarrative.aiDecisionBrief,
    marketSignal,
    signalConfidence,
    providerDiagnostics,
    outlookRows: [
      ...updatedOutlookRows.filter((row) => !['AI Outlook', 'AI Risk Assessment', 'AI Opportunity Assessment', 'Recommended Action'].includes(row.metric)),
      ...aiRows
    ],
    takeaways: {
      trendExpectation: `${technicalAnalysis.trend} trend: price is ${technicalAnalysis.priceVsSma20.toLowerCase()} and ${technicalAnalysis.priceVsSma50.toLowerCase()}.`,
      bestStrategy: `Watch ${supportText || 'support'} for staged entries and ${resistanceText || 'resistance'} for trims while momentum is ${technicalAnalysis.momentum.toLowerCase()}.`,
      riskNote: `${technicalAnalysis.volatility} volatility with a ${technicalAnalysis.volatilityScore}/100 risk reading. This is market intelligence, not financial advice.`
    }
  };
}

async function buildMarketOutlook(symbol) {
  const baseFallback = fallbackMarketData[symbol];

  if (!baseFallback) {
    const error = new Error('Unsupported crypto symbol');
    error.statusCode = 400;
    throw error;
  }

  const fallback = applyPremiumDescription(applyFearGreedCategory({
    ...clone(baseFallback),
    ...buildRollingPeriod()
  }));

  fallback.dataSource = 'fallback';
  fallback.priceProvider = 'fallback';
  fallback.premiumSource = fallback.premiumSource || 'fallback';
  fallback.sentimentSource = fallback.sentimentSource || 'fallback';
  fallback.lastUpdated = new Date().toISOString();

  try {
    const liveData = await fetchLiveMarketPrice(symbol);
    const baseOutlook = Number.isFinite(liveData.priceUsd) ? mergeLivePrice(fallback, liveData) : {
      ...fallback,
      providerErrors: liveData.providerErrors || []
    };
    const [chartResult, priceHistoryResult, comparisonChartResult, premiumResult, sentimentResult] = await Promise.all([
      getMarketChartData(symbol),
      getPriceHistoryData(symbol),
      getComparisonChartData(),
      calculatePremium(symbol, baseOutlook.premiumIndex),
      getSentiment(baseOutlook.fearGreedIndex)
    ]);
    const technicalChart = getBestTechnicalChartData(chartResult, priceHistoryResult);
    const chartData = technicalChart.chartData;
    const enrichedOutlook = {
      ...baseOutlook,
      premiumIndexLabel: premiumResult.premiumIndexLabel,
      premiumIndex: premiumResult.premiumIndex,
      premiumSource: premiumResult.premiumSource,
      fearGreedIndex: sentimentResult.fearGreedIndex,
      sentimentSource: sentimentResult.sentimentSource
    };
    const technicalAnalysis = buildTechnicalAnalysis({
      symbol,
      currentPrice: liveData.priceUsd,
      chartData,
      fallback: enrichedOutlook.technicalAnalysis,
      source: technicalChart.source
    });
    const keyPriceZones = buildKeyPriceZones({
      symbol,
      currentPrice: liveData.priceUsd,
      chartData,
      fallback: enrichedOutlook.keyPriceZones
    });
    const priceHistory = buildPriceHistory({
      seriesByRange: priceHistoryResult,
      fallback: enrichedOutlook.priceHistory
    });
    const oneYearChartData = priceHistoryResult?.['1Y']?.prices || chartData;
    const historicalPerformance = buildHistoricalPerformance({
      chartData: oneYearChartData,
      fallback: enrichedOutlook.historicalPerformance
    });
    const marketStructure = buildMarketStructure({
      technicalAnalysis,
      chartData: oneYearChartData,
      currentPrice: liveData.priceUsd,
      fallback: enrichedOutlook.marketStructure
    });
    const comparisonPerformance = buildPerformanceComparison({
      selectedSymbol: symbol,
      chartDataBySymbol: comparisonChartResult.chartDataBySymbol,
      fallback: enrichedOutlook.comparisonPerformance
    });
    const providerErrors = liveData.providerErrors || [];
    const providerDiagnostics = {
      price: liveData.provider || 'fallback',
      chart: technicalChart.provider,
      premium: premiumResult.providerDiagnostic,
      sentiment: sentimentResult.providerDiagnostic,
      cache: [
        liveData.cacheStatus,
        chartResult?.cacheStatus,
        premiumResult.cacheStatus,
        sentimentResult.cacheStatus,
        comparisonChartResult.cacheStatus,
        ...Object.values(priceHistoryResult || {}).map((result) => result?.cacheStatus)
      ].includes('hit') ? 'hit' : 'miss'
    };
    const signalConfidence = buildSignalConfidence({
      dataSource: enrichedOutlook.dataSource,
      chartAvailable: Boolean(chartData),
      premiumSource: enrichedOutlook.premiumSource,
      sentimentSource: enrichedOutlook.sentimentSource,
      technicalAnalysis,
      keyPriceZones,
      providerErrors
    });

    return enhanceOutlookWithIntelligence({
      outlook: enrichedOutlook,
      technicalAnalysis,
      keyPriceZones,
      signalConfidence,
      providerDiagnostics,
      historicalPerformance,
      marketStructure,
      priceHistory,
      comparisonPerformance
    });
  } catch (error) {
    return {
      ...fallback,
      providerErrors: [error.message],
      providerDiagnostics: fallback.providerDiagnostics,
      signalConfidence: fallback.signalConfidence
    };
  }
}

module.exports = { buildMarketOutlook };
