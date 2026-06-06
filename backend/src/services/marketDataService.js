const axios = require('axios');
const { getOrSetCache } = require('./cacheService');

const PRICE_TTL_MS = 2 * 60 * 1000;
const CHART_TTL_MS = 10 * 60 * 1000;
const LONG_CHART_TTL_MS = 30 * 60 * 1000;
const COMPARISON_TTL_MS = 10 * 60 * 1000;
const SUPPORTED_SYMBOLS = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'];

const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  AVAX: 'avalanche-2',
  DOGE: 'dogecoin',
  XRP: 'ripple',
  LTC: 'litecoin'
};

const CHART_RANGES = {
  '7D': { days: 7, ttlMs: CHART_TTL_MS },
  '30D': { days: 30, ttlMs: CHART_TTL_MS },
  '90D': { days: 90, ttlMs: LONG_CHART_TTL_MS },
  '1Y': { days: 365, ttlMs: LONG_CHART_TTL_MS }
};

async function fetchCoinbasePrice(symbol) {
  const product = `${symbol}-USD`;
  const response = await axios.get(`https://api.coinbase.com/v2/prices/${product}/spot`, {
    timeout: 5000
  });
  const amount = Number(response.data?.data?.amount);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return {
    priceUsd: amount,
    change24h: null,
    provider: 'coinbase'
  };
}

async function fetchCoinbaseDailyCandles(symbol, days) {
  const product = `${symbol}-USD`;
  const response = await axios.get(`https://api.exchange.coinbase.com/products/${product}/candles`, {
    params: {
      granularity: 86400
    },
    headers: {
      'User-Agent': 'Tezoro Market Dashboard'
    },
    timeout: 7000
  });
  const candles = response.data;

  if (!Array.isArray(candles) || !candles.length) {
    return null;
  }

  const prices = candles
    .map((candle) => {
      const timestampSeconds = Number(candle?.[0]);
      const close = Number(candle?.[4]);

      if (!Number.isFinite(timestampSeconds) || !Number.isFinite(close)) {
        return null;
      }

      return [timestampSeconds * 1000, close];
    })
    .filter(Boolean)
    .sort((a, b) => a[0] - b[0]);

  if (!prices.length) {
    return null;
  }

  return {
    prices: deriveRangePrices(prices, days),
    provider: 'coinbase'
  };
}

async function fetchCoinMarketCapPrice(symbol) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
    params: {
      symbol,
      convert: 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': apiKey,
      Accept: 'application/json'
    },
    timeout: 5000
  });

  const quote = response.data?.data?.[symbol]?.quote?.USD;

  if (!quote || typeof quote.price !== 'number') {
    return null;
  }

  return {
    priceUsd: quote.price,
    change24h: typeof quote.percent_change_24h === 'number' ? quote.percent_change_24h : null,
    provider: 'coinmarketcap'
  };
}

async function fetchCoinGeckoPrice(symbol) {
  const id = COINGECKO_IDS[symbol];

  if (!id) {
    return null;
  }

  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: id,
      vs_currencies: 'usd',
      include_24hr_change: 'true'
    },
    timeout: 5000
  });

  const coin = response.data?.[id];

  if (!coin || typeof coin.usd !== 'number') {
    return null;
  }

  return {
    priceUsd: coin.usd,
    change24h: typeof coin.usd_24h_change === 'number' ? coin.usd_24h_change : null,
    provider: 'coingecko'
  };
}

async function getMarketChartData(symbol) {
  const id = COINGECKO_IDS[symbol];

  if (!id) {
    return null;
  }

  try {
    const { value, cacheStatus } = await getOrSetCache('chart', symbol, CHART_TTL_MS, async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: 60,
          interval: 'daily'
        },
        timeout: 7000
      });
      const prices = response.data?.prices;

      if (!Array.isArray(prices) || !prices.length) {
        return null;
      }

      return {
        prices,
        provider: 'coingecko'
      };
    });

    return value ? { ...value, cacheStatus } : null;
  } catch (error) {
    try {
      const { value, cacheStatus } = await getOrSetCache('chart:coinbase', symbol, CHART_TTL_MS, async () =>
        fetchCoinbaseDailyCandles(symbol, 60)
      );

      return value ? { ...value, cacheStatus } : null;
    } catch (coinbaseError) {
      return null;
    }
  }
}

async function getMarketChartRangeData(symbol, range = '30D') {
  const id = COINGECKO_IDS[symbol];
  const rangeConfig = CHART_RANGES[range] || CHART_RANGES['30D'];

  if (!id) {
    return null;
  }

  try {
    const { value, cacheStatus } = await getOrSetCache(`chart:${range}`, symbol, rangeConfig.ttlMs, async () => {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: rangeConfig.days,
          interval: 'daily'
        },
        timeout: 7000
      });
      const prices = response.data?.prices;

      if (!Array.isArray(prices) || !prices.length) {
        return null;
      }

      return {
        prices,
        provider: 'coingecko',
        range
      };
    });

    return value ? { ...value, cacheStatus } : null;
  } catch (error) {
    try {
      const { value, cacheStatus } = await getOrSetCache(`chart:coinbase:${range}`, symbol, rangeConfig.ttlMs, async () => {
        const candleData = await fetchCoinbaseDailyCandles(symbol, rangeConfig.days);

        return candleData ? { ...candleData, range } : null;
      });

      return value ? { ...value, cacheStatus } : null;
    } catch (coinbaseError) {
      return null;
    }
  }
}

function deriveRangePrices(prices, days) {
  if (!Array.isArray(prices) || !prices.length) {
    return [];
  }

  const latestTimestamp = Number(prices[prices.length - 1]?.[0]);

  if (!Number.isFinite(latestTimestamp)) {
    return prices.slice(-days);
  }

  const startTimestamp = latestTimestamp - days * 24 * 60 * 60 * 1000;
  const filtered = prices.filter((point) => Number(point?.[0]) >= startTimestamp);

  return filtered.length ? filtered : prices.slice(-days);
}

async function getPriceHistoryData(symbol) {
  const ranges = ['1Y', '90D', '30D', '7D'];
  let sourceRange = null;
  let sourceResult = null;

  for (const range of ranges) {
    sourceResult = await getMarketChartRangeData(symbol, range);

    if (Array.isArray(sourceResult?.prices) && sourceResult.prices.length) {
      sourceRange = range;
      break;
    }
  }

  if (!sourceResult || !sourceRange) {
    return Object.keys(CHART_RANGES).reduce((accumulator, range) => {
      accumulator[range] = null;
      return accumulator;
    }, {});
  }

  return Object.entries(CHART_RANGES).reduce((accumulator, [range, rangeConfig]) => {
    accumulator[range] = {
      prices: deriveRangePrices(sourceResult.prices, rangeConfig.days),
      provider: sourceResult.provider,
      range,
      sourceRange,
      cacheStatus: sourceResult.cacheStatus
    };
    return accumulator;
  }, {});
}

async function getComparisonChartData() {
  try {
    const { value, cacheStatus } = await getOrSetCache('comparison', 'tracked-assets', COMPARISON_TTL_MS, async () => {
      const results = await Promise.all(
        SUPPORTED_SYMBOLS.map(async (symbol) => [symbol, await getMarketChartRangeData(symbol, '30D')])
      );

      return results.reduce((accumulator, [symbol, result]) => {
        accumulator[symbol] = result;
        return accumulator;
      }, {});
    });

    return { chartDataBySymbol: value, cacheStatus };
  } catch (error) {
    return { chartDataBySymbol: null, cacheStatus: 'miss' };
  }
}

function getCoinGeckoId(symbol) {
  return COINGECKO_IDS[symbol] || null;
}

async function fetchLiveMarketPrice(symbol) {
  const { value, cacheStatus } = await getOrSetCache('price', symbol, PRICE_TTL_MS, async () => {
    const providerErrors = [];

    try {
      const coinbaseData = await fetchCoinbasePrice(symbol);
      if (coinbaseData) {
        return coinbaseData;
      }
    } catch (error) {
      providerErrors.push(`coinbase: ${error.response?.status || error.message}`);
    }

    try {
      const coinMarketCapData = await fetchCoinMarketCapPrice(symbol);
      if (coinMarketCapData) {
        return coinMarketCapData;
      }
    } catch (error) {
      providerErrors.push(`coinmarketcap: ${error.response?.status || error.message}`);
    }

    try {
      const coinGeckoData = await fetchCoinGeckoPrice(symbol);
      if (coinGeckoData) {
        return coinGeckoData;
      }
    } catch (error) {
      providerErrors.push(`coingecko: ${error.response?.status || error.message}`);
    }

    return {
      priceUsd: null,
      change24h: null,
      provider: 'fallback',
      providerErrors
    };
  });

  return {
    ...value,
    cacheStatus
  };
}

module.exports = {
  fetchCoinbasePrice,
  fetchCoinGeckoPrice,
  fetchCoinMarketCapPrice,
  fetchLiveMarketPrice,
  getCoinGeckoId,
  getComparisonChartData,
  getMarketChartData,
  getMarketChartRangeData,
  getPriceHistoryData
};
