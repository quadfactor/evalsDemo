import { useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function Results({
  name,
  impressions,
  clicks,
  currentClickProbability,
  totalPopulation,
  otherVariationData = null, // Add this parameter to receive other variation data
}) {
  const { params, isRunning } = useContext(PopulationContext);

  // Calculate the effective multiplier from base rate
  const baseRate = params.baseClickRate;
  const effectiveMultiplier =
    baseRate > 0 ? currentClickProbability / baseRate : 0;

  // Calculate population reach percentage (against the total population)
  const populationReachPercent =
    totalPopulation > 0
      ? ((impressions / totalPopulation) * 100).toFixed(2)
      : '0.00';

  // Calculate expected total impressions for this variation (50% of population)
  const expectedImpressions = totalPopulation / 2;
  const completionPercent =
    expectedImpressions > 0
      ? Math.min(100, ((impressions / expectedImpressions) * 100).toFixed(1))
      : '0.0';

  // Calculate CTR
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  // Is this variation's sample fully collected?
  const isComplete = impressions >= expectedImpressions;

  // Calculate lift compared to other variation
  let lift = null;
  let hasEnoughData = false;
  if (
    otherVariationData &&
    otherVariationData.impressions > 0 &&
    impressions > 0
  ) {
    const thisCTR = clicks / impressions;
    const otherCTR = otherVariationData.clicks / otherVariationData.impressions;

    // Only show lift when we have a reasonable sample size (at least 5% of expected)
    const minSampleSize = expectedImpressions * 0.05;
    hasEnoughData =
      impressions > minSampleSize &&
      otherVariationData.impressions > minSampleSize;

    if (otherCTR > 0) {
      lift = ((thisCTR - otherCTR) / otherCTR) * 100;
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
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionPercent}%` }}
          title={`${completionPercent}% of expected sample size`}
        ></div>
      </div>
      {isComplete && !isRunning && (
        <div className="completion-badge">Sample Complete</div>
      )}
      <div className="stats-row">
        <span>Clicks:</span>
        <span>{clicks}</span>
      </div>
      <div className="stats-row">
        <span>CTR:</span>
        <span>{ctr.toFixed(2)}%</span>
      </div>

      {/* Lift compared to other variation */}
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
          </span>
        </div>
      )}

      <div className="stats-row">
        <span>Current probability:</span>
        <span>{(currentClickProbability * 100).toFixed(2)}%</span>
      </div>
      <div className="stats-row">
        <span>Effect multiplier:</span>
        <span>{effectiveMultiplier.toFixed(2)}x</span>
      </div>
    </div>
  );
}

export default Results;
