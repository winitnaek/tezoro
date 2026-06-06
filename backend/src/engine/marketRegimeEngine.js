const { normalizeHistoricalSeries } = require('./historicalAnalyticsEngine');

function average(values) {
  if (!values.length) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getSma(values, days) {
  if (values.length < days) {
    return null;
  }

  return average(values.slice(-days));
}

function formatPriceVsSma(currentPrice, sma, label) {
  if (!Number.isFinite(currentPrice) || !Number.isFinite(sma)) {
    return `SMA${label} pending`;
  }

  return currentPrice >= sma ? `Above SMA${label}` : `Below SMA${label}`;
}

function classifyRegime({ trend, momentumScore, volatilityScore, priceVsSma20, priceVsSma50, priceVsSma200 }) {
  const positiveMomentum = momentumScore >= 60;
  const weakMomentum = momentumScore <= 40;
  const highVolatility = volatilityScore >= 70;
  const above20 = priceVsSma20.startsWith('Above');
  const above50 = priceVsSma50.startsWith('Above');
  const above200 = priceVsSma200.startsWith('Above');

  if (weakMomentum && highVolatility && !above20 && !above50) {
    return 'Capitulation';
  }

  if (weakMomentum && (!above20 || !above50)) {
    return 'Correction';
  }

  if (positiveMomentum && above20 && above50 && above200) {
    return 'Expansion';
  }

  if (trend === 'Bullish' && above20 && above50) {
    return 'Trend';
  }

  if (!above20 && above50 && !highVolatility) {
    return 'Distribution';
  }

  if (above20 && !above50 && !highVolatility) {
    return 'Accumulation';
  }

  return 'Neutral';
}

function getSummary(regime, trend, momentum, volatility) {
  const regimeText = {
    Accumulation: 'Market structure is rebuilding near support while momentum stabilizes.',
    Expansion: 'Market structure shows broad upside participation across trend measures.',
    Trend: 'Directional trend remains intact, but confirmation near key levels still matters.',
    Distribution: 'Upside is losing consistency and rallies may meet supply.',
    Correction: 'Recent structure is defensive with pressure below short-term averages.',
    Capitulation: 'High volatility and weak momentum signal stressed market conditions.',
    Neutral: 'Market structure is mixed and range behavior is more likely.'
  };

  return `${regimeText[regime] || regimeText.Neutral} Trend: ${trend}. Momentum: ${momentum}. Volatility: ${volatility}.`;
}

function buildMarketStructure({ technicalAnalysis, chartData, currentPrice, fallback }) {
  const historicalSeries = normalizeHistoricalSeries(chartData);
  const prices = historicalSeries.map((point) => point.price);
  const effectiveCurrentPrice = Number.isFinite(currentPrice) ? currentPrice : prices[prices.length - 1];

  if (!technicalAnalysis || !Number.isFinite(effectiveCurrentPrice)) {
    return fallback;
  }

  const sma200 = getSma(prices, 200);
  const priceVsSma20 = technicalAnalysis.priceVsSma20 || 'SMA20 pending';
  const priceVsSma50 = technicalAnalysis.priceVsSma50 || 'SMA50 pending';
  const priceVsSma200 = formatPriceVsSma(effectiveCurrentPrice, sma200, 200);
  const regime = classifyRegime({
    trend: technicalAnalysis.trend,
    momentumScore: technicalAnalysis.momentumScore ?? 50,
    volatilityScore: technicalAnalysis.volatilityScore ?? 50,
    priceVsSma20,
    priceVsSma50,
    priceVsSma200
  });

  return {
    trend: technicalAnalysis.trend || fallback?.trend || 'Neutral',
    regime,
    priceVsSma20,
    priceVsSma50,
    priceVsSma200,
    volatility: technicalAnalysis.volatility || fallback?.volatility || 'Moderate',
    momentum: technicalAnalysis.momentum || fallback?.momentum || 'Neutral',
    summary: getSummary(
      regime,
      technicalAnalysis.trend || 'Neutral',
      technicalAnalysis.momentum || 'Neutral',
      technicalAnalysis.volatility || 'Moderate'
    )
  };
}

module.exports = { buildMarketStructure };
