import { useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function Results({
  name,
  impressions,
  clicks,
  currentClickProbability,
  totalPopulation,
}) {
  const { params } = useContext(PopulationContext);

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

  return (
    <div className="stats-container">
      <h3>Results {name}</h3>
      <div className="stats-row">
        <span>Impressions:</span>
        <span>
          {impressions} ({populationReachPercent}% of total population)
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionPercent}%` }}
          title={`${completionPercent}% of expected sample size`}
        ></div>
      </div>
      <div className="stats-row">
        <span>Clicks:</span>
        <span>{clicks}</span>
      </div>
      <div className="stats-row">
        <span>CTR:</span>
        <span>
          {impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0}%
        </span>
      </div>
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
