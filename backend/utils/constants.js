export const RECOMMENDATION = {
  STRONG_MATCH:    'Strong Match',
  GOOD_MATCH:      'Good Match',
  POTENTIAL_MATCH: 'Potential Match',
  NOT_RECOMMENDED: 'Not Recommended',
};

// Score thresholds that map a percentage to a recommendation tier
export const SCORE_THRESHOLDS = {
  STRONG: 80,
  GOOD:   60,
};

/**
 * Maps a numeric ATS score (0–100) to a recommendation label.
 * @param {number} score
 * @returns {string}
 */
export function scoreToRecommendation(score) {
  if (score >= SCORE_THRESHOLDS.STRONG) return RECOMMENDATION.STRONG_MATCH;
  if (score >= SCORE_THRESHOLDS.GOOD)   return RECOMMENDATION.GOOD_MATCH;
  return RECOMMENDATION.NOT_RECOMMENDED;
}
