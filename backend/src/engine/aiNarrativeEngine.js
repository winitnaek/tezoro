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

function getNearestDistancePercent(currentPrice, levels = []) {
  if (!Number.isFinite(currentPrice) || !Array.isArray(levels) || !levels.length) {
    return null;
  }

  const distances = levels
    .filter(Number.isFinite)
    .map((level) => Math.abs(currentPrice - level) / currentPrice * 100);

  if (!distances.length) {
    return null;
  }

  return Math.min(...distances);
}

function isSupportNearby(keyPriceZones) {
  const distance = getNearestDistancePercent(keyPriceZones?.currentPrice, keyPriceZones?.supportLevels);
  return Number.isFinite(distance) && distance <= 4;
}

function isResistanceNearby(keyPriceZones) {
  const distance = getNearestDistancePercent(keyPriceZones?.currentPrice, keyPriceZones?.resistanceLevels);
  return Number.isFinite(distance) && distance <= 4;
}

function getDecisionPosture({ marketSignal, fearGreedIndex, riskLevel, marketStructure, technicalAnalysis, keyPriceZones }) {
  const signalScore = marketSignal?.score ?? 50;
  const trend = `${technicalAnalysis?.trend || marketStructure?.trend || ''}`.toLowerCase();
  const regime = `${marketStructure?.regime || ''}`.toLowerCase();
  const momentumScore = technicalAnalysis?.momentumScore ?? 50;
  const momentum = `${technicalAnalysis?.momentum || marketStructure?.momentum || ''}`.toLowerCase();
  const improvingMomentum = momentum === 'positive' || momentumScore >= 60;
  const bearishStructure = trend.includes('bearish') || regime.includes('correction') || regime.includes('capitulation') || regime.includes('distribution');
  const elevatedFear = (fearGreedIndex?.score ?? 50) <= 30;

  if (isResistanceNearby(keyPriceZones) && improvingMomentum) {
    return 'Breakout Watch';
  }

  if (elevatedFear && isSupportNearby(keyPriceZones) && improvingMomentum) {
    return 'Opportunistic';
  }

  if (signalScore < 45 || bearishStructure || riskLevel === 'High') {
    return 'Defensive';
  }

  if (signalScore <= 60 || momentum === 'neutral') {
    return 'Neutral';
  }

  return 'Opportunistic';
}

function getSuggestedApproach(posture, riskLevel, marketStructure, technicalAnalysis) {
  if (posture === 'Defensive') {
    return riskLevel === 'High' ? 'Reduce risk if support fails.' : 'Wait for confirmation near support.';
  }

  if (posture === 'Opportunistic') {
    return 'Favor staged accumulation only near key support.';
  }

  if (posture === 'Breakout Watch') {
    return 'Hold core exposure and avoid chasing strength.';
  }

  if (['Accumulation', 'Correction'].includes(marketStructure?.regime) || technicalAnalysis?.momentum === 'Neutral') {
    return 'Maintain a neutral stance until the signal improves.';
  }

  return 'Wait for confirmation near support.';
}

function buildDecisionBullets({ fearGreedIndex, marketSignal, marketStructure, technicalAnalysis, premiumIndex, keyPriceZones }, riskFactors, opportunities) {
  const premiumValue = parsePremiumValue(premiumIndex?.value);
  const risks = [];
  const opportunityBullets = [];
  const why = [];

  if (technicalAnalysis?.momentum === 'Negative' || (technicalAnalysis?.momentumScore ?? 50) < 45) {
    risks.push('Weak momentum');
  }

  if (Number.isFinite(premiumValue) && premiumValue < -0.01) {
    risks.push('Premium demand is negative');
  }

  if (`${technicalAnalysis?.priceVsSma20 || ''}`.includes('Below')) {
    risks.push('Price remains below SMA20');
  }

  if (isResistanceNearby(keyPriceZones)) {
    risks.push('Resistance is holding');
  }

  if ((fearGreedIndex?.score ?? 50) <= 30) {
    opportunityBullets.push('Fear is elevated');
  }

  if (isSupportNearby(keyPriceZones) || Array.isArray(keyPriceZones?.supportLevels)) {
    opportunityBullets.push('Support zone is nearby');
  }

  if (technicalAnalysis?.momentum === 'Positive' || (technicalAnalysis?.momentumScore ?? 50) >= 60) {
    opportunityBullets.push('Momentum is improving');
  }

  if (marketStructure?.regime === 'Accumulation' || technicalAnalysis?.trendBias === 'neutral') {
    opportunityBullets.push('Price is stabilizing near key levels');
  }

  why.push(`Market Signal is ${marketSignal?.label || marketSignal?.status || 'pending'}.`);
  why.push(`Market Structure is ${marketStructure?.regime || 'Neutral'}.`);
  why.push(`Fear & Greed is ${fearGreedIndex?.category || 'Pending'}.`);

  if (Number.isFinite(premiumValue)) {
    why.push(premiumValue < 0 ? 'Premium demand remains weak.' : premiumValue > 0 ? 'Premium demand is constructive.' : 'Premium demand is balanced.');
  }

  if (technicalAnalysis?.priceVsSma20) {
    why.push(`Price is ${technicalAnalysis.priceVsSma20}.`);
  }

  return {
    keyRisks: (risks.length ? risks : riskFactors.map((factor) => factor.replace(/\.$/, ''))).slice(0, 4),
    opportunities: (opportunityBullets.length ? opportunityBullets : opportunities.map((item) => item.replace(/\.$/, ''))).slice(0, 4),
    whyThisOutlook: why.slice(0, 5)
  };
}

function buildMarketStory(symbol, posture, marketStructure, technicalAnalysis, fearGreedIndex, signalConfidence) {
  const regime = marketStructure?.regime || 'neutral';
  const trend = technicalAnalysis?.trend || marketStructure?.trend || 'neutral';
  const momentum = technicalAnalysis?.momentum || marketStructure?.momentum || 'neutral';
  const sentiment = fearGreedIndex?.category || 'sentiment';
  const confirmation = signalConfidence?.label || 'moderate confidence';

  if (posture === 'Defensive') {
    return `${symbol} remains under pressure as ${trend.toLowerCase()} trend conditions and ${momentum.toLowerCase()} momentum limit confirmation. ${sentiment} can create opportunity, but the setup needs stronger confirmation before risk improves.`;
  }

  if (posture === 'Breakout Watch') {
    return `${symbol} is testing an important area as ${momentum.toLowerCase()} momentum improves near resistance. A cleaner breakout setup still depends on follow-through and ${confirmation.toLowerCase()}.`;
  }

  if (posture === 'Opportunistic') {
    return `${symbol} shows a selective opportunity as ${sentiment.toLowerCase()} sentiment meets nearby support and ${regime.toLowerCase()} structure. Confirmation still matters, so the setup is better suited to staged decisions than chasing strength.`;
  }

  return `${symbol} is showing a balanced setup with ${regime.toLowerCase()} structure and ${momentum.toLowerCase()} momentum. The outlook remains neutral until market signal and confirmation improve.`;
}

function buildAiDecisionBrief(input, intelligenceScore, riskAssessment, opportunityAssessment, recommendedAction) {
  const posture = getDecisionPosture({
    ...input,
    riskLevel: riskAssessment.level
  });
  const marketStory = buildMarketStory(
    input.symbol,
    posture,
    input.marketStructure,
    input.technicalAnalysis,
    input.fearGreedIndex,
    input.signalConfidence
  );
  const suggestedApproach = getSuggestedApproach(posture, riskAssessment.level, input.marketStructure, input.technicalAnalysis);
  const bullets = buildDecisionBullets(input, riskAssessment.riskFactors, opportunityAssessment.opportunities);

  return {
    posture,
    marketStory,
    suggestedApproach: suggestedApproach || recommendedAction.summary,
    keyRisks: bullets.keyRisks,
    opportunities: bullets.opportunities,
    whyThisOutlook: bullets.whyThisOutlook,
    confidenceLabel: input.signalConfidence?.label || intelligenceScore.label
  };
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

  const riskAssessment = {
    level: riskLevel,
    summary: `${riskLevel} risk profile based on volatility, trend quality, premium demand, sentiment, and recent performance.`,
    riskFactors
  };
  const opportunityAssessment = {
    level: opportunityLevel,
    summary: `${opportunityLevel} opportunity profile based on market signal, sentiment, structure, premium demand, and nearby support zones.`,
    opportunities
  };
  const recommendedAction = {
    action,
    summary: `${action} is the current educational stance. Use support and resistance zones as context, and avoid treating this as financial advice.`
  };

  return {
    intelligenceScore,
    aiOutlook: {
      headline: `${symbol} ${intelligenceScore.label}`,
      summary: `${symbol} shows a ${regime.toLowerCase()} structure with ${trend.toLowerCase()} trend conditions and ${momentum.toLowerCase()} momentum. The setup is ${bias === 'buy' ? 'constructive' : bias === 'sell' ? 'defensive' : bias === 'caution' ? 'cautious' : 'balanced'} while signal confidence remains ${signalConfidence?.label || 'moderate'}.`,
      bias
    },
    riskAssessment,
    opportunityAssessment,
    recommendedAction,
    aiDecisionBrief: buildAiDecisionBrief(input, intelligenceScore, riskAssessment, opportunityAssessment, recommendedAction)
  };
}

module.exports = { buildAiNarrative };
