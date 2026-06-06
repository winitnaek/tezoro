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

function parsePremiumValue(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value.replace(/[%,$,\s]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function getIntelligenceLabel(score) {
  if (score <= 24) {
    return 'Weak Setup';
  }

  if (score <= 49) {
    return 'Caution';
  }

  if (score <= 69) {
    return 'Neutral';
  }

  if (score <= 84) {
    return 'Strong Opportunity';
  }

  return 'Exceptional Setup';
}

function getRiskLevel(score, volatilityScore) {
  if (score <= 35 || volatilityScore >= 75) {
    return 'High';
  }

  if (score <= 60 || volatilityScore >= 50) {
    return 'Moderate';
  }

  return 'Controlled';
}

function getOpportunityLevel(score) {
  if (score >= 85) {
    return 'Exceptional';
  }

  if (score >= 70) {
    return 'Strong';
  }

  if (score >= 50) {
    return 'Selective';
  }

  return 'Limited';
}

function getBias(score, technicalAnalysis) {
  if (score >= 70) {
    return 'buy';
  }

  if (score <= 35 || technicalAnalysis?.trendBias === 'sell') {
    return 'sell';
  }

  if (score <= 49) {
    return 'caution';
  }

  return 'neutral';
}

function getRecommendedAction(score, riskLevel, marketStructure, technicalAnalysis) {
  if (score >= 70 && riskLevel !== 'High') {
    return 'Accumulate Gradually';
  }

  if (score <= 35 || riskLevel === 'High' || technicalAnalysis?.trendBias === 'sell') {
    return 'Reduce Risk';
  }

  if (marketStructure?.regime === 'Accumulation' || marketStructure?.regime === 'Correction') {
    return 'Wait For Confirmation';
  }

  if (score >= 50) {
    return 'Hold';
  }

  return 'Neutral Stance';
}

function buildRiskFactors({ fearGreedIndex, historicalPerformance, technicalAnalysis, premiumIndex, marketStructure }) {
  const factors = [];
  const premiumValue = parsePremiumValue(premiumIndex?.value);
  const change7d = parsePercent(historicalPerformance?.change7d);
  const change30d = parsePercent(historicalPerformance?.change30d);

  if ((technicalAnalysis?.volatilityScore ?? 0) >= 60 || technicalAnalysis?.volatility === 'High') {
    factors.push('Elevated volatility can increase short-term drawdown risk.');
  }

  if (technicalAnalysis?.trendBias === 'sell' || technicalAnalysis?.momentum === 'Negative') {
    factors.push('Trend and momentum are not yet confirming a durable upside move.');
  }

  if (Number.isFinite(premiumValue) && premiumValue < -0.01) {
    factors.push('Exchange premium is negative, suggesting softer demand or selling pressure.');
  }

  if (Number.isFinite(change7d) && change7d < -2) {
    factors.push('Recent 7D performance remains weak.');
  }

  if (Number.isFinite(change30d) && change30d < -5) {
    factors.push('The 30D trend is still under pressure.');
  }

  if (['Correction', 'Capitulation', 'Distribution'].includes(marketStructure?.regime)) {
    factors.push(`${marketStructure.regime} regime can limit follow-through until structure improves.`);
  }

  if ((fearGreedIndex?.score ?? 50) <= 24) {
    factors.push('Extreme fear can create volatility before stabilization.');
  }

  return factors.length ? factors.slice(0, 4) : ['No major single-factor risk dominates, but confirmation still matters.'];
}

function buildOpportunities({ fearGreedIndex, historicalPerformance, technicalAnalysis, premiumIndex, keyPriceZones, marketStructure }) {
  const opportunities = [];
  const premiumValue = parsePremiumValue(premiumIndex?.value);
  const change30d = parsePercent(historicalPerformance?.change30d);

  if (technicalAnalysis?.trendBias === 'buy' || technicalAnalysis?.momentum === 'Positive') {
    opportunities.push('Trend or momentum is constructive enough to monitor for continuation.');
  }

  if ((fearGreedIndex?.score ?? 50) <= 30) {
    opportunities.push('Washed-out sentiment can support selective long-term accumulation near support.');
  }

  if (Number.isFinite(premiumValue) && premiumValue > 0.01) {
    opportunities.push('Positive exchange premium points to stronger spot-side demand.');
  }

  if (Number.isFinite(change30d) && change30d > 0) {
    opportunities.push('30D performance is positive, showing improving medium-term structure.');
  }

  if (['Accumulation', 'Expansion', 'Trend'].includes(marketStructure?.regime)) {
    opportunities.push(`${marketStructure.regime} regime can create cleaner setups if key levels hold.`);
  }

  if (Array.isArray(keyPriceZones?.supportLevels) && keyPriceZones.supportLevels.length) {
    opportunities.push('Support zones provide clear areas to watch for staged entries.');
  }

  return opportunities.length ? opportunities.slice(0, 4) : ['Opportunity is limited until price action and demand signals improve.'];
}

function calculateIntelligenceScore({
  marketSignal,
  signalConfidence,
  fearGreedIndex,
  historicalPerformance,
  marketStructure,
  technicalAnalysis,
  premiumIndex
}) {
  let score = Math.round((marketSignal?.score ?? 50) * 0.45 + (signalConfidence?.score ?? 50) * 0.2 + 15);
  const premiumValue = parsePremiumValue(premiumIndex?.value);
  const change7d = parsePercent(historicalPerformance?.change7d);
  const change30d = parsePercent(historicalPerformance?.change30d);

  if (technicalAnalysis?.trendBias === 'buy') {
    score += 8;
  } else if (technicalAnalysis?.trendBias === 'sell') {
    score -= 10;
  }

  if (technicalAnalysis?.momentum === 'Positive') {
    score += 6;
  } else if (technicalAnalysis?.momentum === 'Negative') {
    score -= 7;
  }

  if ((technicalAnalysis?.volatilityScore ?? 50) >= 70) {
    score -= 9;
  } else if ((technicalAnalysis?.volatilityScore ?? 50) <= 35) {
    score += 4;
  }

  if ((fearGreedIndex?.score ?? 50) <= 30) {
    score += 5;
  } else if ((fearGreedIndex?.score ?? 50) >= 75) {
    score -= 4;
  }

  if (Number.isFinite(premiumValue) && premiumValue > 0.01) {
    score += 6;
  } else if (Number.isFinite(premiumValue) && premiumValue < -0.01) {
    score -= 6;
  }

  if (Number.isFinite(change7d) && change7d > 0) {
    score += 3;
  } else if (Number.isFinite(change7d) && change7d < -3) {
    score -= 4;
  }

  if (Number.isFinite(change30d) && change30d > 0) {
    score += 4;
  } else if (Number.isFinite(change30d) && change30d < -6) {
    score -= 6;
  }

  if (['Expansion', 'Trend'].includes(marketStructure?.regime)) {
    score += 8;
  } else if (['Correction', 'Capitulation', 'Distribution'].includes(marketStructure?.regime)) {
    score -= 9;
  }

  return clamp(score);
}

function buildAiNarrative(input) {
  const {
    symbol,
    marketSignal,
    signalConfidence,
    fearGreedIndex,
    historicalPerformance,
    marketStructure,
    technicalAnalysis,
    premiumIndex,
    keyPriceZones
  } = input;
  const score = calculateIntelligenceScore(input);
  const intelligenceScore = {
    score,
    label: getIntelligenceLabel(score)
  };
  const bias = getBias(score, technicalAnalysis);
  const riskLevel = getRiskLevel(score, technicalAnalysis?.volatilityScore ?? 50);
  const opportunityLevel = getOpportunityLevel(score);
  const riskFactors = buildRiskFactors(input);
  const opportunities = buildOpportunities(input);
  const action = getRecommendedAction(score, riskLevel, marketStructure, technicalAnalysis);
  const regime = marketStructure?.regime || 'Neutral';
  const trend = technicalAnalysis?.trend || marketStructure?.trend || 'Neutral';
  const momentum = technicalAnalysis?.momentum || marketStructure?.momentum || 'Neutral';

  return {
    intelligenceScore,
    aiOutlook: {
      headline: `${symbol} ${intelligenceScore.label}`,
      summary: `${symbol} shows a ${regime.toLowerCase()} structure with ${trend.toLowerCase()} trend conditions and ${momentum.toLowerCase()} momentum. The setup is ${bias === 'buy' ? 'constructive' : bias === 'sell' ? 'defensive' : bias === 'caution' ? 'cautious' : 'balanced'} while signal confidence remains ${signalConfidence?.label || 'moderate'}.`,
      bias
    },
    riskAssessment: {
      level: riskLevel,
      summary: `${riskLevel} risk profile based on volatility, trend quality, premium demand, sentiment, and recent performance.`,
      riskFactors
    },
    opportunityAssessment: {
      level: opportunityLevel,
      summary: `${opportunityLevel} opportunity profile based on market signal, sentiment, structure, premium demand, and nearby support zones.`,
      opportunities
    },
    recommendedAction: {
      action,
      summary: `${action} is the current educational stance. Use support and resistance zones as context, and avoid treating this as financial advice.`
    }
  };
}

module.exports = { buildAiNarrative };
