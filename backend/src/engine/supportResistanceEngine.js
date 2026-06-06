const { normalizePriceSeries } = require('./technicalAnalysisEngine');

function roundLevel(value, symbol) {
  if (!Number.isFinite(value)) {
    return value;
  }

  if (symbol === 'BTC') {
    return Math.round(value / 100) * 100;
  }

  if (symbol === 'ETH' || symbol === 'LTC') {
    return Math.round(value / 10) * 10;
  }

  if (symbol === 'DOGE' || symbol === 'XRP') {
    return Math.round(value * 1000) / 1000;
  }

  return Math.round(value * 100) / 100;
}

function percentile(values, ratio) {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)));

  return sorted[index];
}

function uniqueLevels(levels) {
  return [...new Set(levels.filter(Number.isFinite))];
}

function buildKeyPriceZones({ symbol, currentPrice, chartData, fallback }) {
  const prices = normalizePriceSeries(chartData);
  const effectiveCurrentPrice = Number.isFinite(currentPrice) ? currentPrice : prices[prices.length - 1];

  if (!Number.isFinite(effectiveCurrentPrice) || prices.length < 20) {
    return fallback;
  }

  const recent = [...prices.slice(-59), effectiveCurrentPrice].filter(Number.isFinite);
  const rangeLow = roundLevel(percentile(recent, 0.08), symbol);
  const rangeHigh = roundLevel(percentile(recent, 0.92), symbol);
  const baseLow = roundLevel(percentile(recent, 0.28), symbol);
  const baseHigh = roundLevel(percentile(recent, 0.72), symbol);
  const supportLevels = uniqueLevels([
    roundLevel(percentile(recent, 0.38), symbol),
    roundLevel(percentile(recent, 0.18), symbol),
    rangeLow
  ]);
  const resistanceLevels = uniqueLevels([
    roundLevel(percentile(recent, 0.62), symbol),
    roundLevel(percentile(recent, 0.82), symbol),
    rangeHigh
  ]);

  return {
    currentPrice: roundLevel(effectiveCurrentPrice, symbol),
    rangeLow,
    rangeHigh,
    baseLow,
    baseHigh,
    supportLevels,
    resistanceLevels
  };
}

module.exports = { buildKeyPriceZones, roundLevel };
