const { normalizeHistoricalSeries } = require('./historicalAnalyticsEngine');

const SUPPORTED_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'LTC', name: 'Litecoin' }
];

function roundPercent(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 10) / 10;
}

function getChange(series, days) {
  if (!Array.isArray(series) || series.length < 2) {
    return null;
  }

  const currentPoint = series[series.length - 1];
  const targetTimestamp = currentPoint.timestamp - days * 24 * 60 * 60 * 1000;
  const previousPoint = [...series].reverse().find((point) => point.timestamp <= targetTimestamp) || series[0];

  if (!previousPoint || previousPoint.price === 0) {
    return null;
  }

  return ((currentPoint.price - previousPoint.price) / previousPoint.price) * 100;
}

function buildPerformanceComparison({ selectedSymbol, chartDataBySymbol, fallback }) {
  const rows = SUPPORTED_ASSETS.map((asset) => {
    const series = normalizeHistoricalSeries(chartDataBySymbol?.[asset.symbol]?.prices || chartDataBySymbol?.[asset.symbol]);
    const fallbackRow = fallback?.find((row) => row.symbol === asset.symbol);

    return {
      symbol: asset.symbol,
      name: asset.name,
      change7d: roundPercent(getChange(series, 7)) ?? fallbackRow?.change7d ?? null,
      change30d: roundPercent(getChange(series, 30)) ?? fallbackRow?.change30d ?? null,
      selected: asset.symbol === selectedSymbol
    };
  });

  return rows.some((row) => Number.isFinite(row.change7d) || Number.isFinite(row.change30d)) ? rows : fallback;
}

module.exports = {
  SUPPORTED_ASSETS,
  buildPerformanceComparison
};
