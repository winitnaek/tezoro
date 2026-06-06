const assert = require('node:assert/strict');
const test = require('node:test');

const axios = require('axios');
const { getProviderHealth } = require('../src/services/providerHealthService');

test('providerHealthService reports provider and cache statuses', async () => {
  const originalGet = axios.get;
  axios.get = async () => ({ data: { ok: true } });

  try {
    const health = await getProviderHealth();

    assert.equal(health.status, 'UP');
    assert.deepEqual(health.providers, {
      coingecko: 'UP',
      coinbase: 'UP',
      sentiment: 'UP',
      cache: 'UP'
    });
  } finally {
    axios.get = originalGet;
  }
});
