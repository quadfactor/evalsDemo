function Results({
  name,
  impressions,
  clicks,
  currentClickProbability,
  onReset,
}) {
  return (
    <div className="stats-container">
      <h3>Results {name}</h3>
      <div className="stats-row">
        <span>Impressions:</span>
        <span>{impressions}</span>
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
      <button type="button" className="reset-button" onClick={onReset}>
        Reset Stats
      </button>
    </div>
  );
}

export default Results;
