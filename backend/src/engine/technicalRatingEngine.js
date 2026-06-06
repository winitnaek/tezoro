function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function parsePercent(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value.replace('%', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePremium(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value.replace(/[%,$,\s]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function labelFromScore(score) {
  if (score <= 24) {
    return 'Strong Risk-Off';
  }

  if (score <= 44) {
    return 'Risk-Off';
  }

  if (score <= 55) {
    return 'Neutral';
  }

  if (score <= 75) {
    return 'Constructive';
  }

  return 'Strong Constructive';
}

function postureFromScore(score) {
  if (score <= 44) {
    return 'riskOff';
  }

  if (score <= 55) {
    return 'neutral';
  }

  return 'constructive';
}

function countPostures(scores) {
  return scores.reduce(
    (counts, score) => {
      counts[postureFromScore(score)] += 1;
      return counts;
    },
    { riskOff: 0, neutral: 0, constructive: 0 }
  );
}

function average(values) {
  const validValues = values.filter(Number.isFinite);

  if (!validValues.length) {
    return 50;
  }

  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

function scoreFromPriceVsSma(value) {
  if (typeof value !== 'string') {
    return 50;
  }

  if (value.toLowerCase().includes('above')) {
    return 68;
  }

  if (value.toLowerCase().includes('below')) {
    return 32;
  }

  return 50;
}

function scoreFromChange(change) {
  if (!Number.isFinite(change)) {
    return 50;
  }

  return clamp(50 + change * 3);
}

function scoreFromFearGreed(score) {
  if (!Number.isFinite(score)) {
    return 50;
  }

  if (score <= 24) {
    return 42;
  }

  if (score <= 44) {
    return 46;
  }

  if (score <= 55) {
    return 50;
  }

  if (score <= 74) {
    return 62;
  }

  return 68;
}

function scoreFromPremium(value) {
  if (!Number.isFinite(value)) {
    return 50;
  }

  return clamp(50 + value * 120);
}

function buildBucket({ label, scores, note }) {
  const score = Math.round(average(scores));

  return {
    score,
    label: labelFromScore(score),
    posture: postureFromScore(score),
    ...countPostures(scores),
    note
  };
}

function buildTechnicalRating({
  marketSignal,
  signalConfidence,
  fearGreedIndex,
  historicalPerformance,
  marketStructure,
  technicalAnalysis,
  premiumIndex
}) {
  const sevenDayChange = parsePercent(historicalPerformance?.change7d ?? technicalAnalysis?.sevenDayChange);
  const thirtyDayChange = parsePercent(historicalPerformance?.change30d ?? technicalAnalysis?.thirtyDayChange);
  const premiumValue = parsePremium(premiumIndex?.value);
  const volatilityScore = Number(technicalAnalysis?.volatilityScore);
  const movingAverageScores = [
    scoreFromPriceVsSma(technicalAnalysis?.priceVsSma20),
    scoreFromPriceVsSma(technicalAnalysis?.priceVsSma50),
    scoreFromPriceVsSma(marketStructure?.priceVsSma200),
    technicalAnalysis?.trendBias === 'buy' ? 70 : technicalAnalysis?.trendBias === 'sell' ? 30 : 50
  ];
  const oscillatorScores = [
    Number.isFinite(technicalAnalysis?.momentumScore) ? technicalAnalysis.momentumScore : 50,
    Number.isFinite(volatilityScore) ? clamp(100 - volatilityScore) : 50,
    scoreFromFearGreed(Number(fearGreedIndex?.score)),
    scoreFromChange(sevenDayChange),
    scoreFromChange(thirtyDayChange),
    scoreFromPremium(premiumValue)
  ];
  const summaryScores = [
    Number.isFinite(marketSignal?.score) ? marketSignal.score : 50,
    Number.isFinite(signalConfidence?.score) ? signalConfidence.score : 50,
    average(movingAverageScores),
    average(oscillatorScores),
    ['Expansion', 'Trend', 'Accumulation'].includes(marketStructure?.regime) ? 65 : ['Correction', 'Capitulation', 'Distribution'].includes(marketStructure?.regime) ? 35 : 50
  ];

  return {
    summary: buildBucket({
      label: 'Summary',
      scores: summaryScores,
      note: 'Blends signal score, confidence, structure, momentum, volatility, sentiment, and premium context.'
    }),
    oscillators: buildBucket({
      label: 'Oscillators',
      scores: oscillatorScores,
      note: 'Momentum, volatility, sentiment, recent performance, and premium demand posture.'
    }),
    movingAverages: buildBucket({
      label: 'Moving Averages',
      scores: movingAverageScores,
      note: 'Current price posture versus SMA20, SMA50, and broader moving-average structure.'
    })
  };
}

module.exports = {
  buildTechnicalRating,
  labelFromScore
};
