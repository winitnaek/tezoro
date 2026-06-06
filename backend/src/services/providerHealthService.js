const axios = require('axios');
const { getCached, setCached } = require('./cacheService');

const HEALTH_TIMEOUT_MS = 3500;

async function checkProvider(fn) {
  try {
    await fn();
    return 'UP';
  } catch (error) {
    return 'DOWN';
  }
}

async function checkCoinGecko() {
  await axios.get(process.env.COINGECKO_PING_URL || 'https://api.coingecko.com/api/v3/ping', {
    timeout: HEALTH_TIMEOUT_MS
  });
}

async function checkCoinbase() {
  await axios.get(process.env.COINBASE_SPOT_URL || 'https://api.coinbase.com/v2/prices/BTC-USD/spot', {
    timeout: HEALTH_TIMEOUT_MS
  });
}

async function checkSentimentProvider() {
  await axios.get(process.env.SENTIMENT_API_URL || 'https://api.alternative.me/fng/', {
    params: { limit: 1 },
    timeout: HEALTH_TIMEOUT_MS
  });
}

async function checkCache() {
  setCached('health', 'cache', 'UP', 1000);

  if (getCached('health', 'cache') !== 'UP') {
    throw new Error('Cache read/write failed');
  }
}

async function getProviderHealth() {
  const [coingecko, coinbase, sentiment, cache] = await Promise.all([
    checkProvider(checkCoinGecko),
    checkProvider(checkCoinbase),
    checkProvider(checkSentimentProvider),
    checkProvider(checkCache)
  ]);
  const providers = {
    coingecko,
    coinbase,
    sentiment,
    cache
  };

  return {
    status: 'UP',
    providers
  };
}

module.exports = { getProviderHealth };
