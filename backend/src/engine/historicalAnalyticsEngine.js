function normalizeHistoricalSeries(chartData) {
  if (!Array.isArray(chartData)) {
    return [];
  }

  return chartData
    .map((point) => {
      if (Array.isArray(point)) {
        return {
          timestamp: Number(point[0]),
          price: Number(point[1])
        };
      }

      return {
        timestamp: point?.timestamp ? Number(point.timestamp) : Date.parse(point?.date),
        price: Number(point?.price ?? point?.close ?? point?.value)
      };
    })
    .filter((point) => Number.isFinite(point.timestamp) && Number.isFinite(point.price))
    .sort((a, b) => a.timestamp - b.timestamp);
}

function formatDate(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 10) / 10;
}

function getChangeFromOffset(series, days) {
  if (!Array.isArray(series) || series.length < 2) {
    return null;
  }

  const current = series[series.length - 1]?.price;
  const targetTimestamp = series[series.length - 1].timestamp - days * 24 * 60 * 60 * 1000;
  const previousPoint = [...series].reverse().find((point) => point.timestamp <= targetTimestamp) || series[0];
  const previous = previousPoint?.price;

  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

function getYtdChange(series) {
  if (!Array.isArray(series) || series.length < 2) {
    return null;
  }

  const currentPoint = series[series.length - 1];
  const yearStart = Date.UTC(new Date(currentPoint.timestamp).getUTCFullYear(), 0, 1);
  const firstYtdPoint = series.find((point) => point.timestamp >= yearStart);

  if (!firstYtdPoint || firstYtdPoint === currentPoint || firstYtdPoint.price === 0) {
    return null;
  }

  return ((currentPoint.price - firstYtdPoint.price) / firstYtdPoint.price) * 100;
}

function buildHistoricalPerformance({ chartData, fallback }) {
  const series = normalizeHistoricalSeries(chartData);

  if (series.length < 2) {
    return fallback;
  }

  return {
    change24h: formatPercent(getChangeFromOffset(series, 1)),
    change7d: formatPercent(getChangeFromOffset(series, 7)),
    change30d: formatPercent(getChangeFromOffset(series, 30)),
    change90d: formatPercent(getChangeFromOffset(series, 90)),
    changeYtd: formatPercent(getYtdChange(series))
  };
}

function buildPriceHistory({ seriesByRange, fallback }) {
  const ranges = ['7D', '30D', '90D', '1Y'];
  const series = ranges.reduce((accumulator, range) => {
    const normalized = normalizeHistoricalSeries(seriesByRange?.[range]?.prices || seriesByRange?.[range]);
    accumulator[range] = normalized.map((point) => ({
      date: formatDate(point.timestamp),
      price: Math.round(point.price * 10000) / 10000
    }));
    return accumulator;
  }, {});

  const hasAnySeries = ranges.some((range) => series[range].length);

  if (!hasAnySeries) {
    return fallback;
  }

  ranges.forEach((range) => {
    if (!series[range].length) {
      const bestAvailable = series['90D'].length
        ? series['90D']
        : series['30D'].length
          ? series['30D']
          : series['7D'];
      series[range] = fallback?.series?.[range] || bestAvailable || [];
    }
  });

  return {
    ranges,
    defaultRange: '30D',
    series
  };
}

module.exports = {
  buildHistoricalPerformance,
  buildPriceHistory,
  normalizeHistoricalSeries
};
