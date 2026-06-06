function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function getLabel(score) {
  if (score <= 24) {
    return 'Strong Bearish';
  }

  if (score <= 44) {
    return 'Bearish / Caution';
  }

  if (score <= 55) {
    return 'Neutral';
  }

  if (score <= 69) {
    return 'Constructive';
  }

  if (score <= 84) {
    return 'Bullish Momentum';
  }

  return 'Strong Bullish';
}

function getStatus(label, volatilityScore) {
  const risk = volatilityScore >= 70 ? 'High Risk' : volatilityScore >= 35 ? 'Moderate Risk' : 'Controlled Risk';

  if (label.includes('Bullish')) {
    return `${label} / ${risk}`;
  }

  if (label.includes('Bearish')) {
    return `${label} / Defensive`;
  }

  if (label === 'Constructive') {
    return `Constructive / ${risk}`;
  }

  return `Neutral / ${risk}`;
}

function buildMarketSignal({ technicalAnalysis, fearGreedIndex, premiumIndex, premiumSource, sentimentSource }) {
  const trendStrength = technicalAnalysis?.trendBias === 'buy'
    ? 78
    : technicalAnalysis?.trendBias === 'sell'
      ? 28
      : 52;
  const momentum = Number.isFinite(technicalAnalysis?.momentumScore) ? technicalAnalysis.momentumScore : 50;
  const volatilityRisk = Number.isFinite(technicalAnalysis?.volatilityScore) ? technicalAnalysis.volatilityScore : 45;
  const fearScore = Number.isFinite(fearGreedIndex?.score) ? fearGreedIndex.score : 50;
  const sentimentSupport = fearScore <= 24 ? 72 : fearScore <= 44 ? 58 : fearScore <= 55 ? 50 : fearScore <= 74 ? 46 : 34;
  const premiumDemand = premiumIndex?.bias === 'sell' ? 30 : premiumIndex?.bias === 'buy' ? 70 : 50;
  const livePremiumAdjustment = premiumSource === 'live' ? 3 : -2;
  const liveSentimentAdjustment = sentimentSource === 'alternative-me' ? 3 : 0;
  const score = clamp(Math.round(
    trendStrength * 0.32 +
    momentum * 0.3 +
    (100 - volatilityRisk) * 0.16 +
    sentimentSupport * 0.14 +
    premiumDemand * 0.08 +
    livePremiumAdjustment +
    liveSentimentAdjustment
  ));
  const label = getLabel(score);

  return {
    score,
    label,
    status: getStatus(label, volatilityRisk),
    signals: [
      { label: 'Trend Strength', value: clamp(Math.round(trendStrength)) },
      { label: 'Momentum', value: clamp(Math.round(momentum)) },
      { label: 'Volatility Risk', value: clamp(Math.round(volatilityRisk)) }
    ]
  };
}

module.exports = { buildMarketSignal };
