const extremeFearDescription =
  'Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.';

const { buildAiNarrative } = require('../engine/aiNarrativeEngine');
const { buildTechnicalRating } = require('../engine/technicalRatingEngine');

function createOutlook({
  symbol,
  name,
  currentPrice,
  premiumValue,
  premiumDescription,
  premiumBias,
  premiumBadge,
  fearScore,
  fearBias,
  fearBadge,
  priceBadge,
  signal,
  trend,
  sparklines,
  range,
  supports,
  resistances,
  takeaways
}) {
  return {
    symbol,
    name,
    period: {
      startDate: 'May 28, 2026',
      endDate: 'June 11, 2026'
    },
    snapshotDate: 'May 28, 2026',
    lastUpdated: '',
    dataSource: 'fallback',
    currentPrice,
    premiumIndexLabel: symbol === 'BTC' ? 'Coinbase Premium Index' : 'Exchange Premium Index',
    premiumIndex: {
      value: premiumValue,
      description: premiumDescription,
      bias: premiumBias,
      badgeLabel: premiumBadge
    },
    fearGreedIndex: {
      score: fearScore,
      category: 'Extreme Fear',
      description: extremeFearDescription,
      bias: fearBias,
      badgeLabel: fearBadge
    },
    priceBias: {
      bias: 'neutral',
      badgeLabel: priceBadge
    },
    marketSignal: signal,
    snapshotTrend: trend,
    sparklines,
    outlookRows: [
      {
        metric: 'Current Price',
        details: currentPrice,
        interpretation: `${priceBadge} bias: wait for confirmation near support before adding aggressively.`,
        bias: 'neutral'
      },
      {
        metric: '1-2 Week Price Range',
        details: range,
        interpretation: 'Range-trade bias: buy closer to support and trim near upper resistance.',
        bias: 'neutral'
      },
      {
        metric: 'Fear & Greed Index',
        details: `${fearScore} - Extreme Fear`,
        interpretation: 'Extreme Fear supports gradual accumulation near support, not one-shot entries.',
        bias: fearBias === 'neutral' ? 'neutral' : 'buy'
      },
      {
        metric: symbol === 'BTC' ? 'Coinbase Premium Index' : 'Exchange Premium Index',
        details: premiumValue,
        interpretation: premiumDescription,
        bias: premiumBias
      },
      {
        metric: 'Recommended Overall Action',
        details: '-',
        interpretation: takeaways.bestStrategy,
        bias: 'neutral'
      },
      {
        metric: 'Key Support Levels',
        details: supports,
        interpretation: 'Buy Zone: staged entries are preferred near support.',
        bias: 'buy'
      },
      {
        metric: 'Key Resistance Levels',
        details: resistances,
        interpretation: 'Sell / Trim Zone: take profits into resistance unless momentum confirms breakout.',
        bias: 'sell'
      }
    ],
    takeaways
  };
}

const fallbackMarketData = {
  BTC: createOutlook({
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: '~$73,246',
    premiumValue: '-160',
    premiumDescription: 'Coinbase Premium Index is negative, meaning Coinbase pricing is weaker than global markets. This suggests softer U.S. demand or selling pressure.',
    premiumBias: 'sell',
    premiumBadge: 'Sell / Trim',
    fearScore: 22,
    fearBias: 'buy',
    fearBadge: 'Contrarian Buy',
    priceBadge: 'Neutral-to-Buy',
    signal: {
      score: 62,
      label: 'Neutral / Caution',
      status: 'Risk-Off / Range Bias',
      signals: [
        { label: 'Trend Strength', value: 58 },
        { label: 'Sentiment Washout', value: 76 },
        { label: 'Premium Demand', value: 34 }
      ]
    },
    trend: {
      currentPriceChange: '-1.8%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Weak',
      premiumDirection: 'down',
      fearGreedChangeLabel: 'Opportunity',
      fearGreedDirection: 'up'
    },
    sparklines: {
      currentPrice: [72, 73, 72.5, 74, 73.2, 73.8, 73.1],
      premium: [-80, -100, -120, -160, -140, -150, -160],
      fearGreed: [18, 20, 21, 19, 22, 23, 22]
    },
    range: '$68,500 - $80,500 (Base: $71,500 - $77,800)',
    supports: '$72K-$73K, $70K, $68.5K',
    resistances: '$75K, $78K, $80K-$80.6K',
    takeaways: {
      trendExpectation: 'BTC is likely to remain choppy-to-weak short term. A clean break below $72K opens the door to $70K and $68.5K.',
      bestStrategy: 'Use staged buys only near support. Trim rallies into $78K-$80.5K unless Coinbase premium turns positive.',
      riskNote: 'Geopolitical tension, macro pressure, ETF outflows, and weak Coinbase premium keep downside risk elevated.'
    }
  }),
  ETH: createOutlook({
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: '~$3,850',
    premiumValue: '-0.8%',
    premiumDescription: 'Slight negative premium suggests softer spot demand across major exchanges.',
    premiumBias: 'neutral',
    premiumBadge: 'Caution',
    fearScore: 25,
    fearBias: 'buy',
    fearBadge: 'Contrarian Buy',
    priceBadge: 'Neutral',
    signal: {
      score: 66,
      label: 'Neutral / Improving',
      status: 'Neutral / Range Bias',
      signals: [
        { label: 'Trend Strength', value: 61 },
        { label: 'Sentiment Washout', value: 72 },
        { label: 'Premium Demand', value: 48 }
      ]
    },
    trend: {
      currentPriceChange: '-0.9%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Soft',
      premiumDirection: 'down',
      fearGreedChangeLabel: 'Constructive',
      fearGreedDirection: 'up'
    },
    sparklines: {
      currentPrice: [3.72, 3.78, 3.84, 3.81, 3.9, 3.86, 3.85],
      premium: [-0.2, -0.4, -0.5, -0.8, -0.7, -0.6, -0.8],
      fearGreed: [19, 21, 24, 22, 25, 26, 25]
    },
    range: '$3,550 - $4,250 (Base: $3,700 - $4,050)',
    supports: '$3,700, $3,550, $3,400',
    resistances: '$4,050, $4,200, $4,350',
    takeaways: {
      trendExpectation: 'ETH may stay range-bound unless broader crypto sentiment improves.',
      bestStrategy: 'Accumulate slowly near support and trim into resistance.',
      riskNote: 'ETF flow weakness, BTC volatility, and macro risk can pressure ETH.'
    }
  }),
  AVAX: createOutlook({
    symbol: 'AVAX',
    name: 'Avalanche',
    currentPrice: '~$38',
    premiumValue: '-1.2%',
    premiumDescription: 'Negative premium suggests cautious demand in higher-beta altcoins.',
    premiumBias: 'sell',
    premiumBadge: 'Risk-Off',
    fearScore: 24,
    fearBias: 'neutral',
    fearBadge: 'Selective Buy',
    priceBadge: 'Neutral',
    signal: {
      score: 54,
      label: 'Caution',
      status: 'High Beta / Caution',
      signals: [
        { label: 'Trend Strength', value: 52 },
        { label: 'Sentiment Washout', value: 68 },
        { label: 'Premium Demand', value: 30 }
      ]
    },
    trend: {
      currentPriceChange: '-3.1%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Risk-Off',
      premiumDirection: 'down',
      fearGreedChangeLabel: 'Selective',
      fearGreedDirection: 'neutral'
    },
    sparklines: {
      currentPrice: [40, 39, 38.5, 39.2, 37.6, 38.4, 38],
      premium: [-0.5, -0.8, -1, -1.2, -1.1, -1.3, -1.2],
      fearGreed: [20, 21, 23, 22, 24, 25, 24]
    },
    range: '$33 - $44 (Base: $35 - $41)',
    supports: '$36, $33, $30',
    resistances: '$41, $44, $48',
    takeaways: {
      trendExpectation: 'AVAX likely remains volatile and highly dependent on BTC direction.',
      bestStrategy: 'Use smaller staged entries near support and trim quickly near resistance.',
      riskNote: 'Altcoin beta, liquidity weakness, and BTC breakdown risk are key concerns.'
    }
  }),
  DOGE: createOutlook({
    symbol: 'DOGE',
    name: 'Dogecoin',
    currentPrice: '~$0.165',
    premiumValue: '-0.6%',
    premiumDescription: 'Mild negative premium suggests limited speculative demand.',
    premiumBias: 'neutral',
    premiumBadge: 'Caution',
    fearScore: 23,
    fearBias: 'neutral',
    fearBadge: 'High Risk',
    priceBadge: 'Neutral',
    signal: {
      score: 49,
      label: 'Speculative / Caution',
      status: 'Speculative / High Risk',
      signals: [
        { label: 'Trend Strength', value: 45 },
        { label: 'Sentiment Washout', value: 64 },
        { label: 'Premium Demand', value: 38 }
      ]
    },
    trend: {
      currentPriceChange: '-2.4%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Limited',
      premiumDirection: 'neutral',
      fearGreedChangeLabel: 'High Risk',
      fearGreedDirection: 'neutral'
    },
    sparklines: {
      currentPrice: [0.172, 0.168, 0.166, 0.171, 0.162, 0.167, 0.165],
      premium: [-0.3, -0.4, -0.5, -0.6, -0.5, -0.7, -0.6],
      fearGreed: [18, 20, 22, 21, 23, 24, 23]
    },
    range: '$0.145 - $0.195 (Base: $0.155 - $0.180)',
    supports: '$0.155, $0.145, $0.132',
    resistances: '$0.180, $0.195, $0.215',
    takeaways: {
      trendExpectation: 'DOGE may remain choppy unless speculative momentum returns.',
      bestStrategy: 'Use small size and trim quickly into sharp rallies.',
      riskNote: 'DOGE is highly sentiment-driven and can reverse quickly.'
    }
  }),
  XRP: createOutlook({
    symbol: 'XRP',
    name: 'XRP',
    currentPrice: '~$0.62',
    premiumValue: '-0.4%',
    premiumDescription: 'Slight negative premium suggests modest demand but no strong accumulation signal.',
    premiumBias: 'neutral',
    premiumBadge: 'Neutral',
    fearScore: 24,
    fearBias: 'buy',
    fearBadge: 'Contrarian Buy',
    priceBadge: 'Neutral',
    signal: {
      score: 60,
      label: 'Neutral / Watch',
      status: 'Neutral / Range Bias',
      signals: [
        { label: 'Trend Strength', value: 57 },
        { label: 'Sentiment Washout', value: 70 },
        { label: 'Premium Demand', value: 44 }
      ]
    },
    trend: {
      currentPriceChange: '-1.1%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Modest',
      premiumDirection: 'neutral',
      fearGreedChangeLabel: 'Opportunity',
      fearGreedDirection: 'up'
    },
    sparklines: {
      currentPrice: [0.64, 0.63, 0.61, 0.625, 0.618, 0.626, 0.62],
      premium: [-0.1, -0.2, -0.35, -0.4, -0.3, -0.5, -0.4],
      fearGreed: [19, 20, 22, 23, 24, 25, 24]
    },
    range: '$0.56 - $0.72 (Base: $0.59 - $0.68)',
    supports: '$0.60, $0.56, $0.52',
    resistances: '$0.68, $0.72, $0.78',
    takeaways: {
      trendExpectation: 'XRP is likely to remain range-bound unless volume expands.',
      bestStrategy: 'Buy only near confirmed support and trim into resistance.',
      riskNote: 'Macro risk and weak crypto sentiment can keep XRP capped.'
    }
  }),
  LTC: createOutlook({
    symbol: 'LTC',
    name: 'Litecoin',
    currentPrice: '~$84',
    premiumValue: '-0.5%',
    premiumDescription: 'Slight negative premium suggests demand is cautious but not deeply risk-off.',
    premiumBias: 'neutral',
    premiumBadge: 'Caution',
    fearScore: 26,
    fearBias: 'buy',
    fearBadge: 'Selective Buy',
    priceBadge: 'Neutral-to-Buy',
    signal: {
      score: 58,
      label: 'Neutral / Watch',
      status: 'Range Bias / Watch Support',
      signals: [
        { label: 'Trend Strength', value: 55 },
        { label: 'Sentiment Washout', value: 67 },
        { label: 'Premium Demand', value: 42 }
      ]
    },
    trend: {
      currentPriceChange: '-1.4%',
      currentPriceDirection: 'down',
      premiumChangeLabel: 'Cautious',
      premiumDirection: 'neutral',
      fearGreedChangeLabel: 'Selective',
      fearGreedDirection: 'up'
    },
    sparklines: {
      currentPrice: [86, 84.5, 83.8, 85.2, 82.9, 84.1, 84],
      premium: [-0.2, -0.3, -0.4, -0.5, -0.45, -0.55, -0.5],
      fearGreed: [22, 23, 24, 25, 26, 27, 26]
    },
    range: '$76 - $96 (Base: $80 - $90)',
    supports: '$82, $78, $74',
    resistances: '$90, $96, $104',
    takeaways: {
      trendExpectation: 'LTC may remain range-bound unless broader crypto momentum improves.',
      bestStrategy: 'Use gradual entries near support and trim into resistance unless volume confirms breakout.',
      riskNote: 'LTC can lag during weak altcoin cycles, so confirmation near support matters.'
    }
  })
};

const fallbackIntelligence = {
  BTC: {
    technicalAnalysis: {
      sma20: 72100,
      sma50: 69800,
      trend: 'Bullish',
      trendBias: 'buy',
      momentum: 'Positive',
      momentumScore: 71,
      volatility: 'Moderate',
      volatilityScore: 42,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Above SMA50',
      sevenDayChange: '-1.8%',
      thirtyDayChange: '4.6%'
    },
    keyPriceZones: {
      currentPrice: 73246,
      rangeLow: 68500,
      rangeHigh: 80500,
      baseLow: 71500,
      baseHigh: 77800,
      supportLevels: [73000, 70000, 68500],
      resistanceLevels: [75000, 78000, 80600]
    }
  },
  ETH: {
    technicalAnalysis: {
      sma20: 3820,
      sma50: 3710,
      trend: 'Neutral / Improving',
      trendBias: 'neutral',
      momentum: 'Neutral',
      momentumScore: 59,
      volatility: 'Moderate',
      volatilityScore: 46,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Above SMA50',
      sevenDayChange: '-0.9%',
      thirtyDayChange: '3.2%'
    },
    keyPriceZones: {
      currentPrice: 3850,
      rangeLow: 3550,
      rangeHigh: 4250,
      baseLow: 3700,
      baseHigh: 4050,
      supportLevels: [3700, 3550, 3400],
      resistanceLevels: [4050, 4200, 4350]
    }
  },
  AVAX: {
    technicalAnalysis: {
      sma20: 37.8,
      sma50: 39.4,
      trend: 'Neutral',
      trendBias: 'neutral',
      momentum: 'Negative',
      momentumScore: 43,
      volatility: 'High',
      volatilityScore: 72,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Below SMA50',
      sevenDayChange: '-3.1%',
      thirtyDayChange: '-5.6%'
    },
    keyPriceZones: {
      currentPrice: 38,
      rangeLow: 33,
      rangeHigh: 44,
      baseLow: 35,
      baseHigh: 41,
      supportLevels: [36, 33, 30],
      resistanceLevels: [41, 44, 48]
    }
  },
  DOGE: {
    technicalAnalysis: {
      sma20: 0.166,
      sma50: 0.172,
      trend: 'Bearish',
      trendBias: 'sell',
      momentum: 'Negative',
      momentumScore: 39,
      volatility: 'High',
      volatilityScore: 76,
      priceVsSma20: 'Below SMA20',
      priceVsSma50: 'Below SMA50',
      sevenDayChange: '-2.4%',
      thirtyDayChange: '-6.8%'
    },
    keyPriceZones: {
      currentPrice: 0.165,
      rangeLow: 0.145,
      rangeHigh: 0.195,
      baseLow: 0.155,
      baseHigh: 0.18,
      supportLevels: [0.155, 0.145, 0.132],
      resistanceLevels: [0.18, 0.195, 0.215]
    }
  },
  XRP: {
    technicalAnalysis: {
      sma20: 0.62,
      sma50: 0.64,
      trend: 'Neutral',
      trendBias: 'neutral',
      momentum: 'Neutral',
      momentumScore: 53,
      volatility: 'Moderate',
      volatilityScore: 49,
      priceVsSma20: 'Above SMA20',
      priceVsSma50: 'Below SMA50',
      sevenDayChange: '-1.1%',
      thirtyDayChange: '1.4%'
    },
    keyPriceZones: {
      currentPrice: 0.62,
      rangeLow: 0.56,
      rangeHigh: 0.72,
      baseLow: 0.59,
      baseHigh: 0.68,
      supportLevels: [0.6, 0.56, 0.52],
      resistanceLevels: [0.68, 0.72, 0.78]
    }
  },
  LTC: {
    technicalAnalysis: {
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
    },
    keyPriceZones: {
      currentPrice: 84,
      rangeLow: 76,
      rangeHigh: 96,
      baseLow: 80,
      baseHigh: 90,
      supportLevels: [82, 78, 74],
      resistanceLevels: [90, 96, 104]
    }
  }
};

const supportedSymbols = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'];

function parsePercent(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value.replace('%', ''));

  return Number.isFinite(parsed) ? parsed : null;
}

function buildFallbackSeries(currentPrice, rangeLow, rangeHigh, days = 365) {
  const low = Number.isFinite(rangeLow) ? rangeLow : currentPrice * 0.9;
  const high = Number.isFinite(rangeHigh) ? rangeHigh : currentPrice * 1.1;
  const startDate = Date.UTC(2025, 5, 1);

  return Array.from({ length: days }, (_, index) => {
    const progress = index / Math.max(1, days - 1);
    const wave = Math.sin(index / 13) * 0.025 + Math.cos(index / 29) * 0.018;
    const trend = low + (high - low) * (0.36 + progress * 0.28);
    const price = Math.max(low * 0.96, trend * (1 + wave));

    return {
      date: new Date(startDate + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      price: Math.round(price * 10000) / 10000
    };
  });
}

function getRangeSeries(series, days) {
  return series.slice(-days);
}

function buildFallbackPriceHistory(keyPriceZones) {
  const series = buildFallbackSeries(
    keyPriceZones.currentPrice,
    keyPriceZones.rangeLow,
    keyPriceZones.rangeHigh
  );

  return {
    ranges: ['7D', '30D', '90D', '1Y'],
    defaultRange: '30D',
    series: {
      '7D': getRangeSeries(series, 7),
      '30D': getRangeSeries(series, 30),
      '90D': getRangeSeries(series, 90),
      '1Y': series
    }
  };
}

function buildFallbackHistoricalPerformance(technicalAnalysis) {
  return {
    change24h: parsePercent(technicalAnalysis.sevenDayChange) ? Math.round((parsePercent(technicalAnalysis.sevenDayChange) / 7) * 10) / 10 : 0,
    change7d: parsePercent(technicalAnalysis.sevenDayChange),
    change30d: parsePercent(technicalAnalysis.thirtyDayChange),
    change90d: parsePercent(technicalAnalysis.thirtyDayChange) ? Math.round(parsePercent(technicalAnalysis.thirtyDayChange) * 1.8 * 10) / 10 : null,
    changeYtd: parsePercent(technicalAnalysis.thirtyDayChange) ? Math.round(parsePercent(technicalAnalysis.thirtyDayChange) * 2.6 * 10) / 10 : null
  };
}

function buildFallbackMarketStructure(technicalAnalysis) {
  const regime = technicalAnalysis.trend === 'Bullish'
    ? 'Trend'
    : technicalAnalysis.trend === 'Bearish'
      ? 'Correction'
      : technicalAnalysis.momentum === 'Positive'
        ? 'Accumulation'
        : 'Neutral';

  return {
    trend: technicalAnalysis.trend,
    regime,
    priceVsSma20: technicalAnalysis.priceVsSma20,
    priceVsSma50: technicalAnalysis.priceVsSma50,
    priceVsSma200: technicalAnalysis.trend === 'Bullish' ? 'Above SMA200' : 'SMA200 pending',
    volatility: technicalAnalysis.volatility,
    momentum: technicalAnalysis.momentum,
    summary: `${regime} structure with ${technicalAnalysis.momentum.toLowerCase()} momentum and ${technicalAnalysis.volatility.toLowerCase()} volatility.`
  };
}

function buildFallbackComparison(selectedSymbol) {
  return supportedSymbols.map((symbol) => ({
    symbol,
    name: fallbackMarketData[symbol].name,
    change7d: parsePercent(fallbackIntelligence[symbol].technicalAnalysis.sevenDayChange),
    change30d: parsePercent(fallbackIntelligence[symbol].technicalAnalysis.thirtyDayChange),
    selected: symbol === selectedSymbol
  }));
}

function buildAiRows(aiNarrative) {
  return [
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
}

Object.entries(fallbackIntelligence).forEach(([symbol, intelligence]) => {
  if (fallbackMarketData[symbol]) {
    fallbackMarketData[symbol].technicalAnalysis = intelligence.technicalAnalysis;
    fallbackMarketData[symbol].keyPriceZones = intelligence.keyPriceZones;
    fallbackMarketData[symbol].historicalPerformance = buildFallbackHistoricalPerformance(intelligence.technicalAnalysis);
    fallbackMarketData[symbol].marketStructure = buildFallbackMarketStructure(intelligence.technicalAnalysis);
    fallbackMarketData[symbol].priceHistory = buildFallbackPriceHistory(intelligence.keyPriceZones);
    fallbackMarketData[symbol].comparisonPerformance = buildFallbackComparison(symbol);
    fallbackMarketData[symbol].premiumSource = 'fallback';
    fallbackMarketData[symbol].sentimentSource = 'fallback';
    fallbackMarketData[symbol].fearGreedIndex.source = 'fallback';
    fallbackMarketData[symbol].signalConfidence = {
      score: 48,
      label: 'Moderate Confidence',
      notes: 'Using fallback premium and sentiment with static market structure'
    };
    const aiNarrative = buildAiNarrative({
      symbol,
      marketSignal: fallbackMarketData[symbol].marketSignal,
      signalConfidence: fallbackMarketData[symbol].signalConfidence,
      fearGreedIndex: fallbackMarketData[symbol].fearGreedIndex,
      historicalPerformance: fallbackMarketData[symbol].historicalPerformance,
      marketStructure: fallbackMarketData[symbol].marketStructure,
      technicalAnalysis: fallbackMarketData[symbol].technicalAnalysis,
      premiumIndex: fallbackMarketData[symbol].premiumIndex,
      keyPriceZones: fallbackMarketData[symbol].keyPriceZones
    });
    fallbackMarketData[symbol].technicalRating = buildTechnicalRating({
      marketSignal: fallbackMarketData[symbol].marketSignal,
      signalConfidence: fallbackMarketData[symbol].signalConfidence,
      fearGreedIndex: fallbackMarketData[symbol].fearGreedIndex,
      historicalPerformance: fallbackMarketData[symbol].historicalPerformance,
      marketStructure: fallbackMarketData[symbol].marketStructure,
      technicalAnalysis: fallbackMarketData[symbol].technicalAnalysis,
      premiumIndex: fallbackMarketData[symbol].premiumIndex
    });
    fallbackMarketData[symbol].intelligenceScore = aiNarrative.intelligenceScore;
    fallbackMarketData[symbol].aiOutlook = aiNarrative.aiOutlook;
    fallbackMarketData[symbol].riskAssessment = aiNarrative.riskAssessment;
    fallbackMarketData[symbol].opportunityAssessment = aiNarrative.opportunityAssessment;
    fallbackMarketData[symbol].recommendedAction = aiNarrative.recommendedAction;
    fallbackMarketData[symbol].aiDecisionBrief = aiNarrative.aiDecisionBrief;
    fallbackMarketData[symbol].outlookRows = [
      ...fallbackMarketData[symbol].outlookRows.filter((row) => !['AI Outlook', 'AI Risk Assessment', 'AI Opportunity Assessment', 'Recommended Action'].includes(row.metric)),
      ...buildAiRows(aiNarrative)
    ];
    fallbackMarketData[symbol].providerDiagnostics = {
      price: 'fallback',
      chart: 'fallback',
      premium: 'fallback',
      sentiment: 'fallback',
      cache: 'miss'
    };
  }
});

module.exports = fallbackMarketData;

