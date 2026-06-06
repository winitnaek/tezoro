function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function getConfidenceLabel(score) {
  if (score <= 39) {
    return 'Low Confidence';
  }

  if (score <= 69) {
    return 'Moderate Confidence';
  }

  if (score <= 84) {
    return 'High Confidence';
  }

  return 'Very High Confidence';
}

function buildSignalConfidence({
  dataSource,
  chartAvailable,
  premiumSource,
  sentimentSource,
  technicalAnalysis,
  keyPriceZones,
  providerErrors = []
}) {
  let score = 40;
  const notes = [];

  if (dataSource === 'live') {
    score += 12;
    notes.push('live price');
  }

  if (chartAvailable) {
    score += 12;
    notes.push('chart data');
  } else {
    score -= 8;
  }

  if (premiumSource === 'live') {
    score += 12;
    notes.push('live premium');
  } else {
    score -= 6;
  }

  if (sentimentSource === 'alternative-me') {
    score += 12;
    notes.push('live sentiment');
  } else {
    score -= 6;
  }

  if (technicalAnalysis) {
    score += 8;
  }

  if (keyPriceZones) {
    score += 8;
  }

  if (providerErrors.length) {
    score -= Math.min(18, providerErrors.length * 4);
  }

  const finalScore = clamp(Math.round(score));

  return {
    score: finalScore,
    label: getConfidenceLabel(finalScore),
    notes: notes.length
      ? `${notes.join(' + ')} available`
      : 'Using fallback market structure'
  };
}

module.exports = { buildSignalConfidence };
