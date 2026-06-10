function getFearGreedCategory(score) {
  const normalizedScore = Number(score);

  if (!Number.isFinite(normalizedScore)) {
    return 'Neutral';
  }

  if (normalizedScore <= 24) {
    return 'Extreme Fear';
  }

  if (normalizedScore <= 44) {
    return 'Fear';
  }

  if (normalizedScore <= 55) {
    return 'Neutral';
  }

  if (normalizedScore <= 74) {
    return 'Greed';
  }

  return 'Extreme Greed';
}

function getFearGreedDescription(category) {
  switch (category) {
    case 'Extreme Fear':
      return 'Extreme Fear often signals long-term buying opportunities. Consider accumulating gradually near support levels instead of entering all at once.';
    case 'Fear':
      return 'Fear suggests caution, but it can create selective buying opportunities if price is near support and risk is managed.';
    case 'Neutral':
      return 'Neutral sentiment points to a balanced market. Wait for confirmation before adding or reducing exposure aggressively.';
    case 'Greed':
      return 'Greed signals improving momentum, but entries should avoid chasing extended moves far above support.';
    case 'Extreme Greed':
      return 'Extreme Greed can signal overheated conditions. Consider protecting gains and avoiding oversized late entries.';
    default:
      return 'Market sentiment is mixed. Use support and resistance levels to guide staged decisions.';
  }
}

function getFearGreedSignal(score) {
  const normalizedScore = Number(score);

  if (!Number.isFinite(normalizedScore)) {
    return { bias: 'neutral', badgeLabel: 'Neutral' };
  }

  if (normalizedScore <= 24) {
    return { bias: 'buy', badgeLabel: 'Accumulation Watch' };
  }

  if (normalizedScore <= 44) {
    return { bias: 'buy', badgeLabel: 'Selective Buy Zone' };
  }

  if (normalizedScore <= 55) {
    return { bias: 'neutral', badgeLabel: 'Neutral' };
  }

  if (normalizedScore <= 74) {
    return { bias: 'sell', badgeLabel: 'Caution' };
  }

  return { bias: 'sell', badgeLabel: 'Trim / Risk Watch' };
}

module.exports = { getFearGreedCategory, getFearGreedDescription, getFearGreedSignal };
