function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function average(values) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return '0.0%';
  }

  return `${value.toFixed(1)}%`;
}

function normalizePriceSeries(chartData) {
  if (!Array.isArray(chartData)) {
    return [];
  }

  return chartData
    .map((point) => {
      if (typeof point === 'number') {
        return point;
      }

      if (Array.isArray(point)) {
        return Number(point[1]);
      }

      return Number(point?.price ?? point?.close ?? point?.value);
    })
    .filter(Number.isFinite);
}

function getTrend(currentPrice, sma20, sma50) {
  if (currentPrice > sma20 && sma20 > sma50) {
    return { trend: 'Bullish', trendBias: 'buy' };
  }

  if (currentPrice > sma20 && sma20 <= sma50) {
    return { trend: 'Neutral / Improving', trendBias: 'neutral' };
  }

  if (currentPrice < sma20 && sma20 < sma50) {
    return { trend: 'Bearish', trendBias: 'sell' };
  }

  return { trend: 'Neutral', trendBias: 'neutral' };
}

function alignFallbackTechnicalAnalysis(fallback, currentPrice) {
  if (!fallback || !Number.isFinite(currentPrice)) {
    return fallback ? { ...fallback, source: fallback.source || 'fallback' } : fallback;
  }

  const sma20 = Number(fallback.sma20);
  const sma50 = Number(fallback.sma50);
  const nextFallback = {
    ...fallback,
    source: fallback.source || 'fallback'
  };

  if (Number.isFinite(sma20)) {
    nextFallback.priceVsSma20 = currentPrice >= sma20 ? 'Above SMA20' : 'Below SMA20';
  }

  if (Number.isFinite(sma50)) {
    nextFallback.priceVsSma50 = currentPrice >= sma50 ? 'Above SMA50' : 'Below SMA50';
  }

  if (Number.isFinite(sma20) && Number.isFinite(sma50)) {
    const { trend, trendBias } = getTrend(currentPrice, sma20, sma50);
    nextFallback.trend = trend;
    nextFallback.trendBias = trendBias;
  }

  return nextFallback;
}

function calculateChange(values, days) {
  if (values.length <= days) {
    return 0;
  }

  const current = values[values.length - 1];
  const previous = values[values.length - 1 - days];

  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}

function calculateVolatility(values) {
  if (values.length < 2) {
    return 0;
  }

  const returns = [];
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];

    if (previous > 0 && Number.isFinite(current)) {
      returns.push(((current - previous) / previous) * 100);
    }
  }

  if (!returns.length) {
    return 0;
  }

  const mean = average(returns);
  const variance = average(returns.map((value) => (value - mean) ** 2));

  return Math.sqrt(variance);
}

function classifyVolatility(score) {
  if (score >= 70) {
    return 'High';
  }

  if (score >= 35) {
    return 'Moderate';
  }

  return 'Low';
}

function buildTechnicalAnalysis({ symbol, currentPrice, chartData, fallback, source = 'live' }) {
  const prices = normalizePriceSeries(chartData);
  const effectiveCurrentPrice = Number.isFinite(currentPrice) ? currentPrice : prices[prices.length - 1];

  if (!Number.isFinite(effectiveCurrentPrice) || prices.length < 20) {
    return alignFallbackTechnicalAnalysis(fallback, effectiveCurrentPrice);
  }

  const priceSeries = [...prices.slice(-59), effectiveCurrentPrice];
  const sma20 = average(priceSeries.slice(-20));
  const sma50 = average(priceSeries.slice(-50));

  if (!Number.isFinite(sma20) || !Number.isFinite(sma50)) {
    return alignFallbackTechnicalAnalysis(fallback, effectiveCurrentPrice);
  }

  const sevenDayChangeValue = calculateChange(priceSeries, 7);
  const thirtyDayChangeValue = calculateChange(priceSeries, 30);
  const momentumScore = clamp(Math.round(50 + sevenDayChangeValue * 3 + thirtyDayChangeValue * 1.25));
  const dailyVolatility = calculateVolatility(priceSeries.slice(-30));
  const volatilityScore = clamp(Math.round(dailyVolatility * 18));
  const { trend, trendBias } = getTrend(effectiveCurrentPrice, sma20, sma50);
  const momentum = momentumScore >= 60 ? 'Positive' : momentumScore <= 40 ? 'Negative' : 'Neutral';

  return {
    sma20: Math.round(sma20 * 100) / 100,
    sma50: Math.round(sma50 * 100) / 100,
    trend,
    trendBias,
    momentum,
    momentumScore,
    volatility: classifyVolatility(volatilityScore),
    volatilityScore,
    priceVsSma20: effectiveCurrentPrice >= sma20 ? 'Above SMA20' : 'Below SMA20',
    priceVsSma50: effectiveCurrentPrice >= sma50 ? 'Above SMA50' : 'Below SMA50',
    sevenDayChange: formatPercent(sevenDayChangeValue),
    thirtyDayChange: formatPercent(thirtyDayChangeValue),
    source,
    symbol
  };
}

module.exports = {
  alignFallbackTechnicalAnalysis,
  buildTechnicalAnalysis,
  normalizePriceSeries
};
