const axios = require('axios');
const { getOrSetCache } = require('./cacheService');

const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  AVAX: 'avalanche-2',
  DOGE: 'dogecoin',
  XRP: 'ripple',
  LTC: 'litecoin'
};

const PREMIUM_TTL_MS = 2 * 60 * 1000;

function formatPremium(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getPremiumLabel(symbol) {
  return symbol === 'BTC' ? 'Coinbase Premium Index' : 'Exchange Premium Index';
}

function getPremiumBias(premiumPercent) {
  if (Math.abs(premiumPercent) < 0.05) {
    return { bias: 'neutral', badgeLabel: 'Balanced' };
  }

  if (premiumPercent > 0) {
    return { bias: 'buy', badgeLabel: 'Demand Strong' };
  }

  return { bias: 'sell', badgeLabel: 'Demand Weak' };
}

function getPremiumDescription(premiumPercent) {
  if (Math.abs(premiumPercent) < 0.05) {
    return 'Exchange pricing is closely aligned with global markets, suggesting balanced demand.';
  }

  if (premiumPercent > 0) {
    return 'Coinbase/exchange pricing is stronger than global markets, suggesting stronger buying demand.';
  }

  return 'Coinbase/exchange pricing is weaker than global markets, suggesting softer demand or selling pressure.';
}

async function fetchCoinbaseSpot(symbol) {
  const response = await axios.get(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`, {
    timeout: 5000
  });
  const amount = Number(response.data?.data?.amount);

  return Number.isFinite(amount) ? amount : null;
}

async function fetchGlobalReference(symbol) {
  const id = COINGECKO_IDS[symbol];

  if (!id) {
    return null;
  }

  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: id,
      vs_currencies: 'usd'
    },
    timeout: 5000
  });
  const price = Number(response.data?.[id]?.usd);

  return Number.isFinite(price) ? price : null;
}

async function calculatePremium(symbol, fallbackPremium) {
  try {
    const { value, cacheStatus } = await getOrSetCache('premium', symbol, PREMIUM_TTL_MS, async () => {
      const [coinbasePrice, globalAveragePrice] = await Promise.all([
        fetchCoinbaseSpot(symbol),
        fetchGlobalReference(symbol)
      ]);

      if (!Number.isFinite(coinbasePrice) || !Number.isFinite(globalAveragePrice) || globalAveragePrice === 0) {
        return null;
      }

      const premiumPercent = ((coinbasePrice - globalAveragePrice) / globalAveragePrice) * 100;
      const { bias, badgeLabel } = getPremiumBias(premiumPercent);

      return {
        premiumIndexLabel: getPremiumLabel(symbol),
        premiumIndex: {
          value: formatPremium(premiumPercent),
          description: getPremiumDescription(premiumPercent),
          bias,
          badgeLabel
        },
        premiumSource: 'live',
        providerDiagnostic: 'live coinbase-global'
      };
    });

    if (value) {
      return {
        ...value,
        cacheStatus
      };
    }
  } catch (error) {
    // Fall through to fallback premium.
  }

  return {
    premiumIndexLabel: getPremiumLabel(symbol),
    premiumIndex: fallbackPremium,
    premiumSource: 'fallback',
    providerDiagnostic: 'fallback',
    cacheStatus: 'miss'
  };
}

module.exports = { calculatePremium };
