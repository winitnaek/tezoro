import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

async function readSource(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8')
}

test('CryptoSelector keeps BTC free and premium assets visible with locks', async () => {
  const source = await readSource('src/components/CryptoSelector.jsx')

  assert.match(source, /const cryptoSymbols = \['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'\]/)
  assert.match(source, /const premiumSymbols = \['ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'\]/)
  assert.match(source, /premiumFeatureEnabled = false/)
  assert.match(source, /premiumFeatureEnabled && premiumSymbols\.includes/)
  assert.match(source, /crypto-lock-icon/)
  assert.match(source, /onPremiumAssetClick/)
})

test('UpgradeModal exposes premium assets and future features', async () => {
  const source = await readSource('src/components/UpgradeModal.jsx')

  assert.match(source, /Unlock Premium Assets/)
  assert.match(source, /Historical Analytics/)
  assert.match(source, /AI Intelligence/)
  assert.match(source, /Future Premium Features/)
  assert.match(source, /Learn More/)
})

test('SystemStatusCard renders diagnostics labels', async () => {
  const source = await readSource('src/components/SystemStatusCard.jsx')

  assert.match(source, /Price Provider/)
  assert.match(source, /Premium Provider/)
  assert.match(source, /Sentiment Provider/)
  assert.match(source, /Cache Status/)
})
