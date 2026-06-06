const cryptoDashboardData = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$73,246",
    premiumIndexLabel: "Coinbase Premium Index",
    premiumIndex: {
      value: "-160",
      description: "Coinbase Premium Index is negative, meaning Coinbase pricing is weaker than global markets. This suggests softer U.S. demand or selling pressure.",
      bias: "sell",
      badgeLabel: "Sell / Trim",
    },
    fearGreedIndex: {
      score: 22,
      category: "Extreme Fear",
      description: "Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.",
      bias: "buy",
      badgeLabel: "Contrarian Buy",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral-to-Buy",
    },
    marketSignal: {
      score: 62,
      label: "Neutral / Caution",
      status: "Risk-Off / Range Bias",
      signals: [
        { label: "Trend Strength", value: 58 },
        { label: "Sentiment Washout", value: 76 },
        { label: "Premium Demand", value: 34 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-1.8%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Weak",
      premiumDirection: "down",
      fearGreedChangeLabel: "Opportunity",
      fearGreedDirection: "up",
    },
    sparklines: {
      currentPrice: [72, 73, 72.5, 74, 73.2, 73.8, 73.1],
      premium: [-80, -100, -120, -160, -140, -150, -160],
      fearGreed: [18, 20, 21, 19, 22, 23, 22],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$73,246",
        interpretation: "Neutral-to-Buy bias: only if $72K-$73K holds; avoid chasing upside.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$68,500 - $80,500 (Base: $71,500 - $77,800)",
        interpretation: "Range-trade bias: buy dips near support, trim rallies near resistance.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "22 - Extreme Fear",
        interpretation: "Contrarian Buy bias: fear favors accumulation, but only in gradual layers.",
        bias: "buy",
      },
      {
        metric: "Coinbase Premium Index",
        details: "-160",
        interpretation: "Sell / Trim bias: weak U.S. demand is a near-term warning signal.",
        bias: "sell",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Hold core: buy only near support and trim into $77.5K-$80.5K.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$72K-$73K, $70K, $68.5K",
        interpretation: "Buy Zone: stronger setup only if price stabilizes and premium improves.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$75K, $78K, $80K-$80.6K",
        interpretation: "Sell / Trim Zone: upside likely capped unless demand and premium recover.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "BTC is likely to remain choppy-to-weak short term. A clean break below $72K opens the door to $70K and $68.5K.",
      bestStrategy: "Use staged buys only near support. Trim rallies into $78K-$80.5K unless Coinbase premium turns positive.",
      riskNote: "Geopolitical tension, macro pressure, ETF outflows, and weak Coinbase premium keep downside risk elevated.",
    },
  },

  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$3,850",
    premiumIndexLabel: "Exchange Premium Index",
    premiumIndex: {
      value: "-0.8%",
      description: "Slight negative premium suggests softer spot demand across major exchanges.",
      bias: "neutral",
      badgeLabel: "Caution",
    },
    fearGreedIndex: {
      score: 25,
      category: "Extreme Fear",
      description: "Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.",
      bias: "buy",
      badgeLabel: "Contrarian Buy",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral",
    },
    marketSignal: {
      score: 66,
      label: "Neutral / Improving",
      status: "Neutral / Range Bias",
      signals: [
        { label: "Trend Strength", value: 61 },
        { label: "Sentiment Washout", value: 72 },
        { label: "Premium Demand", value: 48 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-0.9%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Soft",
      premiumDirection: "down",
      fearGreedChangeLabel: "Constructive",
      fearGreedDirection: "up",
    },
    sparklines: {
      currentPrice: [3.72, 3.78, 3.84, 3.81, 3.9, 3.86, 3.85],
      premium: [-0.2, -0.4, -0.5, -0.8, -0.7, -0.6, -0.8],
      fearGreed: [19, 21, 24, 22, 25, 26, 25],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$3,850",
        interpretation: "Neutral bias: ETH needs to hold above major support before adding aggressively.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$3,550 - $4,250 (Base: $3,700 - $4,050)",
        interpretation: "Range-trade bias: buy closer to support and trim near upper resistance.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "25 - Extreme Fear",
        interpretation: "Contrarian Buy bias: fear is supportive, but confirmation is needed.",
        bias: "buy",
      },
      {
        metric: "Exchange Premium Index",
        details: "-0.8%",
        interpretation: "Neutral-to-Sell bias: spot demand is not yet strong enough for breakout confidence.",
        bias: "neutral",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Hold core and add only near support; avoid chasing green candles.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$3,700, $3,550, $3,400",
        interpretation: "Buy Zone: staged entries are better near support.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$4,050, $4,200, $4,350",
        interpretation: "Sell / Trim Zone: trim if price reaches resistance without stronger demand.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "ETH may stay range-bound unless broader crypto sentiment improves.",
      bestStrategy: "Accumulate slowly near support and trim into resistance.",
      riskNote: "ETF flow weakness, BTC volatility, and macro risk can pressure ETH.",
    },
  },

  AVAX: {
    symbol: "AVAX",
    name: "Avalanche",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$38",
    premiumIndexLabel: "Exchange Premium Index",
    premiumIndex: {
      value: "-1.2%",
      description: "Negative premium suggests cautious demand in higher-beta altcoins.",
      bias: "sell",
      badgeLabel: "Risk-Off",
    },
    fearGreedIndex: {
      score: 24,
      category: "Extreme Fear",
      description: "Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.",
      bias: "neutral",
      badgeLabel: "Selective Buy",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral",
    },
    marketSignal: {
      score: 54,
      label: "Caution",
      status: "High Beta / Caution",
      signals: [
        { label: "Trend Strength", value: 52 },
        { label: "Sentiment Washout", value: 68 },
        { label: "Premium Demand", value: 30 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-3.1%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Risk-Off",
      premiumDirection: "down",
      fearGreedChangeLabel: "Selective",
      fearGreedDirection: "neutral",
    },
    sparklines: {
      currentPrice: [40, 39, 38.5, 39.2, 37.6, 38.4, 38],
      premium: [-0.5, -0.8, -1, -1.2, -1.1, -1.3, -1.2],
      fearGreed: [20, 21, 23, 22, 24, 25, 24],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$38",
        interpretation: "Neutral bias: wait for support confirmation before adding.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$33 - $44 (Base: $35 - $41)",
        interpretation: "Higher-beta range bias: strong moves possible both directions.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "24 - Extreme Fear",
        interpretation: "Selective Buy bias: accumulation only makes sense near strong support.",
        bias: "buy",
      },
      {
        metric: "Exchange Premium Index",
        details: "-1.2%",
        interpretation: "Sell / Trim bias: negative premium warns of weak demand.",
        bias: "sell",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Trade smaller size; buy support only and trim quickly into strength.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$36, $33, $30",
        interpretation: "Buy Zone: use caution because AVAX can move sharply.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$41, $44, $48",
        interpretation: "Sell / Trim Zone: take profits faster on rallies.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "AVAX likely remains volatile and highly dependent on BTC direction.",
      bestStrategy: "Use smaller staged entries near support and trim quickly near resistance.",
      riskNote: "Altcoin beta, liquidity weakness, and BTC breakdown risk are key concerns.",
    },
  },

  DOGE: {
    symbol: "DOGE",
    name: "Dogecoin",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$0.165",
    premiumIndexLabel: "Exchange Premium Index",
    premiumIndex: {
      value: "-0.6%",
      description: "Mild negative premium suggests limited speculative demand.",
      bias: "neutral",
      badgeLabel: "Caution",
    },
    fearGreedIndex: {
      score: 23,
      category: "Extreme Fear",
      description: "Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.",
      bias: "neutral",
      badgeLabel: "High Risk",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral",
    },
    marketSignal: {
      score: 49,
      label: "Speculative / Caution",
      status: "Speculative / High Risk",
      signals: [
        { label: "Trend Strength", value: 45 },
        { label: "Sentiment Washout", value: 64 },
        { label: "Premium Demand", value: 38 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-2.4%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Limited",
      premiumDirection: "neutral",
      fearGreedChangeLabel: "High Risk",
      fearGreedDirection: "neutral",
    },
    sparklines: {
      currentPrice: [0.172, 0.168, 0.166, 0.171, 0.162, 0.167, 0.165],
      premium: [-0.3, -0.4, -0.5, -0.6, -0.5, -0.7, -0.6],
      fearGreed: [18, 20, 22, 21, 23, 24, 23],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$0.165",
        interpretation: "Neutral bias: DOGE needs momentum confirmation before aggressive buying.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$0.145 - $0.195 (Base: $0.155 - $0.180)",
        interpretation: "Speculative range bias: better to trade levels than chase moves.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "23 - Extreme Fear",
        interpretation: "Neutral-to-Buy bias: fear helps, but DOGE requires strong momentum.",
        bias: "neutral",
      },
      {
        metric: "Exchange Premium Index",
        details: "-0.6%",
        interpretation: "Neutral bias: demand is not strong enough for a confident breakout.",
        bias: "neutral",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Small speculative position only; avoid over-sizing.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$0.155, $0.145, $0.132",
        interpretation: "Buy Zone: only for speculative entries with tight risk control.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$0.180, $0.195, $0.215",
        interpretation: "Sell / Trim Zone: take profits into spikes.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "DOGE may remain choppy unless speculative momentum returns.",
      bestStrategy: "Use small size and trim quickly into sharp rallies.",
      riskNote: "DOGE is highly sentiment-driven and can reverse quickly.",
    },
  },

  XRP: {
    symbol: "XRP",
    name: "XRP",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$0.62",
    premiumIndexLabel: "Exchange Premium Index",
    premiumIndex: {
      value: "-0.4%",
      description: "Slight negative premium suggests modest demand but no strong accumulation signal.",
      bias: "neutral",
      badgeLabel: "Neutral",
    },
    fearGreedIndex: {
      score: 24,
      category: "Extreme Fear",
      description: "Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.",
      bias: "buy",
      badgeLabel: "Contrarian Buy",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral",
    },
    marketSignal: {
      score: 60,
      label: "Neutral / Watch",
      status: "Neutral / Range Bias",
      signals: [
        { label: "Trend Strength", value: 57 },
        { label: "Sentiment Washout", value: 70 },
        { label: "Premium Demand", value: 44 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-1.1%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Modest",
      premiumDirection: "neutral",
      fearGreedChangeLabel: "Opportunity",
      fearGreedDirection: "up",
    },
    sparklines: {
      currentPrice: [0.64, 0.63, 0.61, 0.625, 0.618, 0.626, 0.62],
      premium: [-0.1, -0.2, -0.35, -0.4, -0.3, -0.5, -0.4],
      fearGreed: [19, 20, 22, 23, 24, 25, 24],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$0.62",
        interpretation: "Neutral bias: XRP needs to hold support before upside improves.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$0.56 - $0.72 (Base: $0.59 - $0.68)",
        interpretation: "Range-trade bias: buy support and trim near resistance.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "24 - Extreme Fear",
        interpretation: "Contrarian Buy bias: sentiment is washed out but confirmation matters.",
        bias: "buy",
      },
      {
        metric: "Exchange Premium Index",
        details: "-0.4%",
        interpretation: "Neutral bias: no strong demand signal yet.",
        bias: "neutral",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Hold core; add only on support confirmation.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$0.60, $0.56, $0.52",
        interpretation: "Buy Zone: staged entries if support holds.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$0.68, $0.72, $0.78",
        interpretation: "Sell / Trim Zone: trim into resistance unless volume confirms breakout.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "XRP is likely to remain range-bound unless volume expands.",
      bestStrategy: "Buy only near confirmed support and trim into resistance.",
      riskNote: "Macro risk and weak crypto sentiment can keep XRP capped.",
    },
  },

  LTC: {
    symbol: "LTC",
    name: "Litecoin",
    period: {
      startDate: "May 28, 2026",
      endDate: "June 11, 2026",
    },
    snapshotDate: "May 28, 2026",
    currentPrice: "~$84",
    premiumIndexLabel: "Exchange Premium Index",
    premiumIndex: {
      value: "-0.5%",
      description: "Slight negative premium suggests demand is cautious but not deeply risk-off.",
      bias: "neutral",
      badgeLabel: "Caution",
    },
    fearGreedIndex: {
      score: 26,
      category: "Fear",
      description: "Fear suggests caution, but it can create selective buying opportunities if price is near support and risk is managed.",
      bias: "buy",
      badgeLabel: "Selective Buy",
    },
    priceBias: {
      bias: "neutral",
      badgeLabel: "Neutral-to-Buy",
    },
    marketSignal: {
      score: 58,
      label: "Neutral / Watch",
      status: "Range Bias / Watch Support",
      signals: [
        { label: "Trend Strength", value: 55 },
        { label: "Sentiment Washout", value: 67 },
        { label: "Premium Demand", value: 42 },
      ],
    },
    snapshotTrend: {
      currentPriceChange: "-1.4%",
      currentPriceDirection: "down",
      premiumChangeLabel: "Cautious",
      premiumDirection: "neutral",
      fearGreedChangeLabel: "Selective",
      fearGreedDirection: "up",
    },
    sparklines: {
      currentPrice: [86, 84.5, 83.8, 85.2, 82.9, 84.1, 84],
      premium: [-0.2, -0.3, -0.4, -0.5, -0.45, -0.55, -0.5],
      fearGreed: [22, 23, 24, 25, 26, 27, 26],
    },
    outlookRows: [
      {
        metric: "Current Price",
        details: "~$84",
        interpretation: "Neutral-to-Buy bias: wait for confirmation near support before adding aggressively.",
        bias: "neutral",
      },
      {
        metric: "1-2 Week Price Range",
        details: "$76 - $96 (Base: $80 - $90)",
        interpretation: "Range-trade bias: buy closer to support and trim near upper resistance.",
        bias: "neutral",
      },
      {
        metric: "Fear & Greed Index",
        details: "26 - Fear",
        interpretation: "Selective Buy bias: fear helps, but support confirmation matters.",
        bias: "buy",
      },
      {
        metric: "Exchange Premium Index",
        details: "-0.5%",
        interpretation: "Neutral bias: demand is cautious but not deeply risk-off.",
        bias: "neutral",
      },
      {
        metric: "Recommended Overall Action",
        details: "-",
        interpretation: "Use gradual entries near support and trim into resistance unless volume confirms breakout.",
        bias: "neutral",
      },
      {
        metric: "Key Support Levels",
        details: "$82, $78, $74",
        interpretation: "Buy Zone: staged entries are preferred near support.",
        bias: "buy",
      },
      {
        metric: "Key Resistance Levels",
        details: "$90, $96, $104",
        interpretation: "Sell / Trim Zone: take profits into resistance unless momentum confirms breakout.",
        bias: "sell",
      },
    ],
    takeaways: {
      trendExpectation: "LTC may remain range-bound unless broader crypto momentum improves.",
      bestStrategy: "Use gradual entries near support and trim into resistance unless volume confirms breakout.",
      riskNote: "LTC can lag during weak altcoin cycles, so confirmation near support matters.",
    },
  }
}

const fallbackIntelligence = {
  BTC: {
    technicalAnalysis: {
      sma20: 72100,
      sma50: 69800,
      trend: "Bullish",
      trendBias: "buy",
      momentum: "Positive",
      momentumScore: 71,
      volatility: "Moderate",
      volatilityScore: 42,
      priceVsSma20: "Above SMA20",
      priceVsSma50: "Above SMA50",
      sevenDayChange: "-1.8%",
      thirtyDayChange: "4.6%",
    },
    keyPriceZones: {
      currentPrice: 73246,
      rangeLow: 68500,
      rangeHigh: 80500,
      baseLow: 71500,
      baseHigh: 77800,
      supportLevels: [73000, 70000, 68500],
      resistanceLevels: [75000, 78000, 80600],
    },
  },
  ETH: {
    technicalAnalysis: {
      sma20: 3820,
      sma50: 3710,
      trend: "Neutral / Improving",
      trendBias: "neutral",
      momentum: "Neutral",
      momentumScore: 59,
      volatility: "Moderate",
      volatilityScore: 46,
      priceVsSma20: "Above SMA20",
      priceVsSma50: "Above SMA50",
      sevenDayChange: "-0.9%",
      thirtyDayChange: "3.2%",
    },
    keyPriceZones: {
      currentPrice: 3850,
      rangeLow: 3550,
      rangeHigh: 4250,
      baseLow: 3700,
      baseHigh: 4050,
      supportLevels: [3700, 3550, 3400],
      resistanceLevels: [4050, 4200, 4350],
    },
  },
  AVAX: {
    technicalAnalysis: {
      sma20: 37.8,
      sma50: 39.4,
      trend: "Neutral",
      trendBias: "neutral",
      momentum: "Negative",
      momentumScore: 43,
      volatility: "High",
      volatilityScore: 72,
      priceVsSma20: "Above SMA20",
      priceVsSma50: "Below SMA50",
      sevenDayChange: "-3.1%",
      thirtyDayChange: "-5.6%",
    },
    keyPriceZones: {
      currentPrice: 38,
      rangeLow: 33,
      rangeHigh: 44,
      baseLow: 35,
      baseHigh: 41,
      supportLevels: [36, 33, 30],
      resistanceLevels: [41, 44, 48],
    },
  },
  DOGE: {
    technicalAnalysis: {
      sma20: 0.166,
      sma50: 0.172,
      trend: "Bearish",
      trendBias: "sell",
      momentum: "Negative",
      momentumScore: 39,
      volatility: "High",
      volatilityScore: 76,
      priceVsSma20: "Below SMA20",
      priceVsSma50: "Below SMA50",
      sevenDayChange: "-2.4%",
      thirtyDayChange: "-6.8%",
    },
    keyPriceZones: {
      currentPrice: 0.165,
      rangeLow: 0.145,
      rangeHigh: 0.195,
      baseLow: 0.155,
      baseHigh: 0.18,
      supportLevels: [0.155, 0.145, 0.132],
      resistanceLevels: [0.18, 0.195, 0.215],
    },
  },
  XRP: {
    technicalAnalysis: {
      sma20: 0.62,
      sma50: 0.64,
      trend: "Neutral",
      trendBias: "neutral",
      momentum: "Neutral",
      momentumScore: 53,
      volatility: "Moderate",
      volatilityScore: 49,
      priceVsSma20: "Above SMA20",
      priceVsSma50: "Below SMA50",
      sevenDayChange: "-1.1%",
      thirtyDayChange: "1.4%",
    },
    keyPriceZones: {
      currentPrice: 0.62,
      rangeLow: 0.56,
      rangeHigh: 0.72,
      baseLow: 0.59,
      baseHigh: 0.68,
      supportLevels: [0.6, 0.56, 0.52],
      resistanceLevels: [0.68, 0.72, 0.78],
    },
  },
  LTC: {
    technicalAnalysis: {
      sma20: 83.6,
      sma50: 86.8,
      trend: "Neutral",
      trendBias: "neutral",
      momentum: "Neutral",
      momentumScore: 56,
      volatility: "Moderate",
      volatilityScore: 51,
      priceVsSma20: "Above SMA20",
      priceVsSma50: "Below SMA50",
      sevenDayChange: "-1.4%",
      thirtyDayChange: "2.2%",
    },
    keyPriceZones: {
      currentPrice: 84,
      rangeLow: 76,
      rangeHigh: 96,
      baseLow: 80,
      baseHigh: 90,
      supportLevels: [82, 78, 74],
      resistanceLevels: [90, 96, 104],
    },
  },
}

const supportedSymbols = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC']

function parsePercent(value) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number(value.replace('%', ''))

  return Number.isFinite(parsed) ? parsed : null
}

function buildFallbackSeries(currentPrice, rangeLow, rangeHigh, days = 365) {
  const low = Number.isFinite(rangeLow) ? rangeLow : currentPrice * 0.9
  const high = Number.isFinite(rangeHigh) ? rangeHigh : currentPrice * 1.1
  const startDate = Date.UTC(2025, 5, 1)

  return Array.from({ length: days }, (_, index) => {
    const progress = index / Math.max(1, days - 1)
    const wave = Math.sin(index / 13) * 0.025 + Math.cos(index / 29) * 0.018
    const trend = low + (high - low) * (0.36 + progress * 0.28)
    const price = Math.max(low * 0.96, trend * (1 + wave))

    return {
      date: new Date(startDate + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      price: Math.round(price * 10000) / 10000,
    }
  })
}

function getRangeSeries(series, days) {
  return series.slice(-days)
}

function buildFallbackPriceHistory(keyPriceZones) {
  const series = buildFallbackSeries(
    keyPriceZones.currentPrice,
    keyPriceZones.rangeLow,
    keyPriceZones.rangeHigh
  )

  return {
    ranges: ['7D', '30D', '90D', '1Y'],
    defaultRange: '30D',
    series: {
      '7D': getRangeSeries(series, 7),
      '30D': getRangeSeries(series, 30),
      '90D': getRangeSeries(series, 90),
      '1Y': series,
    },
  }
}

function buildFallbackHistoricalPerformance(technicalAnalysis) {
  const sevenDayChange = parsePercent(technicalAnalysis.sevenDayChange)
  const thirtyDayChange = parsePercent(technicalAnalysis.thirtyDayChange)

  return {
    change24h: Number.isFinite(sevenDayChange) ? Math.round((sevenDayChange / 7) * 10) / 10 : 0,
    change7d: sevenDayChange,
    change30d: thirtyDayChange,
    change90d: Number.isFinite(thirtyDayChange) ? Math.round(thirtyDayChange * 1.8 * 10) / 10 : null,
    changeYtd: Number.isFinite(thirtyDayChange) ? Math.round(thirtyDayChange * 2.6 * 10) / 10 : null,
  }
}

function buildFallbackMarketStructure(technicalAnalysis) {
  const regime = technicalAnalysis.trend === 'Bullish'
    ? 'Trend'
    : technicalAnalysis.trend === 'Bearish'
      ? 'Correction'
      : technicalAnalysis.momentum === 'Positive'
        ? 'Accumulation'
        : 'Neutral'

  return {
    trend: technicalAnalysis.trend,
    regime,
    priceVsSma20: technicalAnalysis.priceVsSma20,
    priceVsSma50: technicalAnalysis.priceVsSma50,
    priceVsSma200: technicalAnalysis.trend === 'Bullish' ? 'Above SMA200' : 'SMA200 pending',
    volatility: technicalAnalysis.volatility,
    momentum: technicalAnalysis.momentum,
    summary: `${regime} structure with ${technicalAnalysis.momentum.toLowerCase()} momentum and ${technicalAnalysis.volatility.toLowerCase()} volatility.`,
  }
}

function buildFallbackComparison(selectedSymbol) {
  return supportedSymbols.map((symbol) => ({
    symbol,
    name: cryptoDashboardData[symbol].name,
    change7d: parsePercent(fallbackIntelligence[symbol].technicalAnalysis.sevenDayChange),
    change30d: parsePercent(fallbackIntelligence[symbol].technicalAnalysis.thirtyDayChange),
    selected: symbol === selectedSymbol,
  }))
}

function getTechnicalRatingLabel(score) {
  if (score <= 24) return 'Strong Risk-Off'
  if (score <= 44) return 'Risk-Off'
  if (score <= 55) return 'Neutral'
  if (score <= 75) return 'Constructive'
  return 'Strong Constructive'
}

function getTechnicalRatingPosture(score) {
  if (score <= 44) return 'riskOff'
  if (score <= 55) return 'neutral'
  return 'constructive'
}

function buildTechnicalRatingBucket(scores, note) {
  const validScores = scores.filter(Number.isFinite)
  const score = Math.round(validScores.reduce((sum, value) => sum + value, 0) / Math.max(1, validScores.length))
  const counts = validScores.reduce(
    (accumulator, value) => {
      accumulator[getTechnicalRatingPosture(value)] += 1
      return accumulator
    },
    { riskOff: 0, neutral: 0, constructive: 0 }
  )

  return {
    score,
    label: getTechnicalRatingLabel(score),
    posture: getTechnicalRatingPosture(score),
    ...counts,
    note,
  }
}

function scoreFromPriceVsSma(value) {
  if (typeof value !== 'string') return 50
  if (value.toLowerCase().includes('above')) return 68
  if (value.toLowerCase().includes('below')) return 32
  return 50
}

function buildFallbackTechnicalRating(data) {
  const sevenDayChange = parsePercent(data.historicalPerformance?.change7d ?? data.technicalAnalysis?.sevenDayChange)
  const thirtyDayChange = parsePercent(data.historicalPerformance?.change30d ?? data.technicalAnalysis?.thirtyDayChange)
  const premiumValue = parsePremiumValue(data.premiumIndex?.value)
  const volatilityScore = Number(data.technicalAnalysis?.volatilityScore)
  const movingAverageScores = [
    scoreFromPriceVsSma(data.technicalAnalysis?.priceVsSma20),
    scoreFromPriceVsSma(data.technicalAnalysis?.priceVsSma50),
    scoreFromPriceVsSma(data.marketStructure?.priceVsSma200),
    data.technicalAnalysis?.trendBias === 'buy' ? 70 : data.technicalAnalysis?.trendBias === 'sell' ? 30 : 50,
  ]
  const oscillatorScores = [
    Number.isFinite(data.technicalAnalysis?.momentumScore) ? data.technicalAnalysis.momentumScore : 50,
    Number.isFinite(volatilityScore) ? clamp(100 - volatilityScore) : 50,
    Number.isFinite(data.fearGreedIndex?.score) ? data.fearGreedIndex.score <= 44 ? 46 : data.fearGreedIndex.score <= 55 ? 50 : 62 : 50,
    Number.isFinite(sevenDayChange) ? clamp(50 + sevenDayChange * 3) : 50,
    Number.isFinite(thirtyDayChange) ? clamp(50 + thirtyDayChange * 3) : 50,
    Number.isFinite(premiumValue) ? clamp(50 + premiumValue * 120) : 50,
  ]
  const movingAverageScore = movingAverageScores.reduce((sum, value) => sum + value, 0) / movingAverageScores.length
  const oscillatorScore = oscillatorScores.reduce((sum, value) => sum + value, 0) / oscillatorScores.length
  const structureScore = ['Expansion', 'Trend', 'Accumulation'].includes(data.marketStructure?.regime)
    ? 65
    : ['Correction', 'Capitulation', 'Distribution'].includes(data.marketStructure?.regime)
      ? 35
      : 50

  return {
    summary: buildTechnicalRatingBucket(
      [data.marketSignal?.score ?? 50, data.signalConfidence?.score ?? 50, movingAverageScore, oscillatorScore, structureScore],
      'Blends signal score, confidence, structure, momentum, volatility, sentiment, and premium context.'
    ),
    oscillators: buildTechnicalRatingBucket(
      oscillatorScores,
      'Momentum, volatility, sentiment, recent performance, and premium demand posture.'
    ),
    movingAverages: buildTechnicalRatingBucket(
      movingAverageScores,
      'Current price posture versus SMA20, SMA50, and broader moving-average structure.'
    ),
  }
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function parsePremiumValue(value) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number(value.replace(/[%,$,\s]/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

function getIntelligenceLabel(score) {
  if (score <= 24) return 'Weak Setup'
  if (score <= 49) return 'Caution'
  if (score <= 69) return 'Neutral'
  if (score <= 84) return 'Strong Opportunity'
  return 'Exceptional Setup'
}

function buildFallbackAiNarrative(symbol, data) {
  const premiumValue = parsePremiumValue(data.premiumIndex?.value)
  const sevenDayChange = parsePercent(data.historicalPerformance?.change7d)
  const thirtyDayChange = parsePercent(data.historicalPerformance?.change30d)
  let score = Math.round((data.marketSignal?.score ?? 50) * 0.45 + (data.signalConfidence?.score ?? 50) * 0.2 + 15)

  if (data.technicalAnalysis?.trendBias === 'buy') score += 8
  if (data.technicalAnalysis?.trendBias === 'sell') score -= 10
  if (data.technicalAnalysis?.momentum === 'Positive') score += 6
  if (data.technicalAnalysis?.momentum === 'Negative') score -= 7
  if ((data.technicalAnalysis?.volatilityScore ?? 50) >= 70) score -= 9
  if ((data.fearGreedIndex?.score ?? 50) <= 30) score += 5
  if (Number.isFinite(premiumValue) && premiumValue > 0.01) score += 6
  if (Number.isFinite(premiumValue) && premiumValue < -0.01) score -= 6
  if (Number.isFinite(sevenDayChange) && sevenDayChange < -3) score -= 4
  if (Number.isFinite(thirtyDayChange) && thirtyDayChange > 0) score += 4
  if (['Expansion', 'Trend'].includes(data.marketStructure?.regime)) score += 8
  if (['Correction', 'Capitulation', 'Distribution'].includes(data.marketStructure?.regime)) score -= 9

  score = clamp(score)
  const intelligenceScore = { score, label: getIntelligenceLabel(score) }
  const bias = score >= 70 ? 'buy' : score <= 35 || data.technicalAnalysis?.trendBias === 'sell' ? 'sell' : score <= 49 ? 'caution' : 'neutral'
  const riskLevel = score <= 35 || (data.technicalAnalysis?.volatilityScore ?? 50) >= 75 ? 'High' : score <= 60 || (data.technicalAnalysis?.volatilityScore ?? 50) >= 50 ? 'Moderate' : 'Controlled'
  const opportunityLevel = score >= 85 ? 'Exceptional' : score >= 70 ? 'Strong' : score >= 50 ? 'Selective' : 'Limited'
  const action = score >= 70 && riskLevel !== 'High'
    ? 'Accumulate Gradually'
    : score <= 35 || riskLevel === 'High' || data.technicalAnalysis?.trendBias === 'sell'
      ? 'Reduce Risk'
      : ['Accumulation', 'Correction'].includes(data.marketStructure?.regime)
        ? 'Wait For Confirmation'
        : score >= 50
          ? 'Hold'
          : 'Neutral Stance'

  return {
    intelligenceScore,
    aiOutlook: {
      headline: `${symbol} ${intelligenceScore.label}`,
      summary: `${symbol} shows a ${(data.marketStructure?.regime || 'Neutral').toLowerCase()} structure with ${(data.technicalAnalysis?.trend || 'Neutral').toLowerCase()} trend conditions and ${(data.technicalAnalysis?.momentum || 'Neutral').toLowerCase()} momentum.`,
      bias,
    },
    riskAssessment: {
      level: riskLevel,
      summary: `${riskLevel} risk profile based on volatility, trend quality, premium demand, sentiment, and recent performance.`,
      riskFactors: [
        data.technicalAnalysis?.volatility === 'High' ? 'Elevated volatility can increase short-term drawdown risk.' : 'Volatility remains a key monitoring point.',
        data.technicalAnalysis?.momentum === 'Negative' ? 'Momentum is not yet confirming a durable upside move.' : 'Momentum is not the dominant risk factor.',
        Number.isFinite(premiumValue) && premiumValue < -0.01 ? 'Exchange premium is negative, suggesting softer demand.' : 'Premium demand is not flashing a major warning.',
      ],
    },
    opportunityAssessment: {
      level: opportunityLevel,
      summary: `${opportunityLevel} opportunity profile based on market signal, sentiment, structure, premium demand, and nearby support zones.`,
      opportunities: [
        (data.fearGreedIndex?.score ?? 50) <= 30 ? 'Washed-out sentiment can support selective accumulation near support.' : 'Sentiment is balanced enough to wait for confirmation.',
        data.technicalAnalysis?.momentum === 'Positive' ? 'Momentum is constructive enough to monitor for continuation.' : 'Momentum needs improvement before stronger opportunity is confirmed.',
        'Support zones provide clear areas to watch for staged entries.',
      ],
    },
    recommendedAction: {
      action,
      summary: `${action} is the current educational stance. Use support and resistance zones as context, and avoid treating this as financial advice.`,
    },
  }
}

function buildAiRows(aiNarrative) {
  return [
    {
      metric: 'AI Outlook',
      details: aiNarrative.aiOutlook.headline,
      interpretation: aiNarrative.aiOutlook.summary,
      bias: aiNarrative.aiOutlook.bias,
    },
    {
      metric: 'AI Risk Assessment',
      details: aiNarrative.riskAssessment.level,
      interpretation: aiNarrative.riskAssessment.summary,
      bias: aiNarrative.riskAssessment.level === 'High' ? 'sell' : aiNarrative.riskAssessment.level === 'Moderate' ? 'caution' : 'neutral',
    },
    {
      metric: 'AI Opportunity Assessment',
      details: aiNarrative.opportunityAssessment.level,
      interpretation: aiNarrative.opportunityAssessment.summary,
      bias: ['Strong', 'Exceptional'].includes(aiNarrative.opportunityAssessment.level) ? 'buy' : aiNarrative.opportunityAssessment.level === 'Selective' ? 'neutral' : 'caution',
    },
    {
      metric: 'Recommended Action',
      details: aiNarrative.recommendedAction.action,
      interpretation: aiNarrative.recommendedAction.summary,
      bias: aiNarrative.aiOutlook.bias,
    },
  ]
}

Object.entries(fallbackIntelligence).forEach(([symbol, intelligence]) => {
  if (cryptoDashboardData[symbol]) {
    cryptoDashboardData[symbol].technicalAnalysis = intelligence.technicalAnalysis
    cryptoDashboardData[symbol].keyPriceZones = intelligence.keyPriceZones
    cryptoDashboardData[symbol].historicalPerformance = buildFallbackHistoricalPerformance(intelligence.technicalAnalysis)
    cryptoDashboardData[symbol].marketStructure = buildFallbackMarketStructure(intelligence.technicalAnalysis)
    cryptoDashboardData[symbol].priceHistory = buildFallbackPriceHistory(intelligence.keyPriceZones)
    cryptoDashboardData[symbol].comparisonPerformance = buildFallbackComparison(symbol)
    cryptoDashboardData[symbol].premiumSource = 'fallback'
    cryptoDashboardData[symbol].sentimentSource = 'fallback'
    cryptoDashboardData[symbol].fearGreedIndex.source = 'fallback'
    cryptoDashboardData[symbol].signalConfidence = {
      score: 48,
      label: 'Moderate Confidence',
      notes: 'Using fallback premium and sentiment with static market structure',
    }
    const aiNarrative = buildFallbackAiNarrative(symbol, cryptoDashboardData[symbol])
    cryptoDashboardData[symbol].technicalRating = buildFallbackTechnicalRating(cryptoDashboardData[symbol])
    cryptoDashboardData[symbol].intelligenceScore = aiNarrative.intelligenceScore
    cryptoDashboardData[symbol].aiOutlook = aiNarrative.aiOutlook
    cryptoDashboardData[symbol].riskAssessment = aiNarrative.riskAssessment
    cryptoDashboardData[symbol].opportunityAssessment = aiNarrative.opportunityAssessment
    cryptoDashboardData[symbol].recommendedAction = aiNarrative.recommendedAction
    cryptoDashboardData[symbol].outlookRows = [
      ...cryptoDashboardData[symbol].outlookRows.filter((row) => !['AI Outlook', 'AI Risk Assessment', 'AI Opportunity Assessment', 'Recommended Action'].includes(row.metric)),
      ...buildAiRows(aiNarrative),
    ]
    cryptoDashboardData[symbol].providerDiagnostics = {
      price: 'fallback',
      chart: 'fallback',
      premium: 'fallback',
      sentiment: 'fallback',
      cache: 'miss',
    }
  }
})

export default cryptoDashboardData


