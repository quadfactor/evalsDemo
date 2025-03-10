import { useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function Results({
  name,
  impressions,
  clicks,
  currentClickProbability,
  onReset,
}) {
  const { params } = useContext(PopulationContext);

  // Calculate the effective multiplier from base rate
  const baseRate = params.baseClickRate;
  const effectiveMultiplier =
    baseRate > 0 ? currentClickProbability / baseRate : 0;

  // Calculate population reach percentage
  const populationReachPercent =
    params.populationSize > 0
      ? ((impressions / params.populationSize) * 100).toFixed(2)
      : '0.00';

  return (
    <div className="stats-container">
      <h3>Results {name}</h3>
      <div className="stats-row">
        <span>Impressions:</span>
        <span>
          {impressions} ({populationReachPercent}% of population)
        </span>
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
      <button type="button" className="reset-button" onClick={onReset}>
        Reset Stats
      </button>
    </div>
  );
}

export default Results;
