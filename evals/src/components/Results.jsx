import { useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

// Fix statistical confidence calculation
function Results({
  name,
  impressions,
  clicks,
  currentClickProbability,
  totalPopulation,
  otherVariationData = null,
}) {
  const { params, isRunning } = useContext(PopulationContext);

  // Calculate population reach percentage (against the total population)
  const populationReachPercent =
    totalPopulation > 0
      ? ((impressions / totalPopulation) * 100).toFixed(2)
      : '0.00';

  // Calculate expected total impressions for this variation (50% of population)
  const expectedImpressions = totalPopulation / 2;

  // Calculate completion percentage based on expected sample size
  const completionPercent =
    expectedImpressions > 0
      ? Math.min(100, ((impressions / expectedImpressions) * 100).toFixed(1))
      : '0.0';

  // Calculate CR (click rate)
  const cr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  // Is this variation's sample fully collected?
  const isComplete = impressions >= expectedImpressions;

  // Calculate lift compared to other variation with statistical significance
  let lift = null;
  let hasEnoughData = false;
  let isStatisticallySignificant = false;

  if (
    otherVariationData &&
    otherVariationData.impressions > 0 &&
    impressions > 0
  ) {
    // Calculate conversion rates
    const thisCR = clicks / impressions;
    const otherCR = otherVariationData.clicks / otherVariationData.impressions;

    // Calculate minimum sample size needed (5% of expected)
    const minSampleSize = Math.max(30, expectedImpressions * 0.05);
    hasEnoughData =
      impressions > minSampleSize &&
      otherVariationData.impressions > minSampleSize;

    if (otherCR > 0) {
      // Calculate relative lift
      lift = ((thisCR - otherCR) / otherCR) * 100;

      // Calculate statistical significance (z-test for proportions)
      // For 95% confidence, we need z-score > 1.96
      if (hasEnoughData) {
        const pooledProportion =
          (clicks + otherVariationData.clicks) /
          (impressions + otherVariationData.impressions);

        const standardError = Math.sqrt(
          pooledProportion *
            (1 - pooledProportion) *
            (1 / impressions + 1 / otherVariationData.impressions)
        );

        const zScore = Math.abs((thisCR - otherCR) / standardError);
        isStatisticallySignificant = zScore > 1.96; // 95% confidence level
      }
    }
  }

  return (
    <div className={`stats-container ${isComplete ? 'complete' : ''}`}>
      <h3>Results {name}</h3>
      <div className="stats-row">
        <span>Impressions:</span>
        <span>
          {impressions} / {expectedImpressions} ({populationReachPercent}% of
          total population)
        </span>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercent}%` }}
            title={`${completionPercent}% of expected sample size`}
          ></div>
        </div>
        {/* Removed the power indicator line */}
      </div>

      {/* Removed sample complete badge */}

      <div className="stats-row">
        <span>Clicks:</span>
        <span>{clicks}</span>
      </div>
      <div className="stats-row">
        <span>CR:</span>
        <span>{cr.toFixed(2)}%</span>
      </div>

      {/* Lift compared to other variation with statistical significance */}
      {hasEnoughData && lift !== null && (
        <div
          className={`stats-row lift-row ${
            lift >= 0 ? 'positive' : 'negative'
          }`}
        >
          <span>Lift vs other:</span>
          <span className="lift-value">
            {lift > 0 ? '+' : ''}
            {lift.toFixed(2)}%
            {isStatisticallySignificant && (
              <span
                className="significance-marker"
                title="Statistically significant (95% confidence)"
              >
                *
              </span>
            )}
          </span>
        </div>
      )}

      {/* Removed current probability stat */}
      {/* Removed effect multiplier stat */}
    </div>
  );
}

export default Results;
