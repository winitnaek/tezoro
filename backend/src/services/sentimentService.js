const axios = require('axios');
const { getFearGreedCategory, getFearGreedDescription, getFearGreedSignal } = require('../engine/fearGreedEngine');
const { getOrSetCache } = require('./cacheService');

const SENTIMENT_TTL_MS = 10 * 60 * 1000;

async function fetchLiveFearGreed() {
  const response = await axios.get('https://api.alternative.me/fng/', {
    params: { limit: 1, format: 'json' },
    timeout: 5000
  });
  const score = Number(response.data?.data?.[0]?.value);

  if (!Number.isFinite(score)) {
    return null;
  }

  const category = getFearGreedCategory(score);
  const { bias, badgeLabel } = getFearGreedSignal(score);

  return {
    score,
    category,
    description: getFearGreedDescription(category),
    bias,
    badgeLabel,
    source: 'alternative-me'
  };
}

async function getSentiment(fallbackFearGreedIndex) {
  try {
    const { value, cacheStatus } = await getOrSetCache('sentiment', 'fear-greed', SENTIMENT_TTL_MS, fetchLiveFearGreed);

    if (value) {
      return {
        fearGreedIndex: value,
        sentimentSource: 'alternative-me',
        providerDiagnostic: 'alternative-me',
        cacheStatus
      };
    }
  } catch (error) {
    // Fall through to fallback sentiment.
  }

  return {
    fearGreedIndex: {
      ...fallbackFearGreedIndex,
      source: 'fallback'
    },
    sentimentSource: 'fallback',
    providerDiagnostic: 'fallback',
    cacheStatus: 'miss'
  };
}

module.exports = { getSentiment };
