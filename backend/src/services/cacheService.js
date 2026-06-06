const cacheStore = new Map();

function getCacheKey(namespace, key) {
  return `${namespace}:${key}`;
}

function getCached(namespace, key) {
  const cacheKey = getCacheKey(namespace, key);
  const entry = cacheStore.get(cacheKey);

  if (!entry || entry.expiresAt <= Date.now()) {
    cacheStore.delete(cacheKey);
    return null;
  }

  return entry.value;
}

function setCached(namespace, key, value, ttlMs) {
  cacheStore.set(getCacheKey(namespace, key), {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

async function getOrSetCache(namespace, key, ttlMs, factory) {
  const cached = getCached(namespace, key);

  if (cached !== null) {
    return { value: cached, cacheStatus: 'hit' };
  }

  const value = await factory();
  setCached(namespace, key, value, ttlMs);

  return { value, cacheStatus: 'miss' };
}

module.exports = {
  getCached,
  getOrSetCache,
  setCached
};
