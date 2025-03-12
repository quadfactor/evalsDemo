import { useContext, useState, useEffect } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function PopulationSettings({ onResetSimulation }) {
  const { params, setParams, sampleSizeReached, requiredPopulationSize } =
    useContext(PopulationContext);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // Format impact values to show as multiplicative percentages
  const formatImpact = (value) => {
    // For a value of 0.1, this will show as "+10%"
    const percentChange = value * 100;
    const sign = percentChange >= 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(0)}%`;
  };

  // Add useEffect to handle sample size completion
  useEffect(() => {
    // When sample size is reached, ensure turbo mode is turned off
    if (sampleSizeReached && params.turboMode) {
      handleParamChange('turboMode', false);
    }
  }, [sampleSizeReached]);

  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  // Helper for rendering a section title
  const renderSectionTitle = (title) => (
    <div className="settings-section-title">{title}</div>
  );

  return (
    <div className={`settings-panel ${!isPanelOpen ? 'collapsed' : ''}`}>
      <div className="settings-header">
        <h3 className="settings-title">Population Parameters</h3>
        <button
          className="collapse-button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          {isPanelOpen ? '−' : '+'}
        </button>
      </div>
      <div className="slider-controls">
        {/* Statistical Controls Section */}
        {renderSectionTitle('Statistical Controls')}

        <div className="settings-group">
          {/* Move population info into statistical controls */}
          <div className="population-info">
            <div
              className="population-badge"
              title="Required population size based on statistical significance"
            >
              Population: {formatNumber(requiredPopulationSize)}
            </div>
          </div>

          <div className="slider-group">
            <span>Confidence Level:</span>
            <select
              className="confidence-select"
              value={params.confidenceLevel}
              onChange={(e) =>
                handleParamChange('confidenceLevel', e.target.value)
              }
            >
              <option value="0.80">80%</option>
              <option value="0.85">85%</option>
              <option value="0.90">90%</option>
              <option value="0.95">95%</option>
              <option value="0.99">99%</option>
            </select>
            <span>{Math.round(params.confidenceLevel * 100)}%</span>
          </div>

          <div className="slider-group">
            <span>Min. Detectable Effect:</span>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={params.minimumDetectableEffect}
              onChange={(e) =>
                handleParamChange('minimumDetectableEffect', e.target.value)
              }
            />
            <span>{Math.round(params.minimumDetectableEffect * 100)}%</span>
          </div>

          <div className="slider-group">
            <span>Base click rate:</span>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={params.baseClickRate}
              onChange={(e) =>
                handleParamChange('baseClickRate', e.target.value)
              }
            />
            <span>{Math.round(params.baseClickRate * 100)}%</span>
          </div>
        </div>

        {/* User Preferences Section */}
        {renderSectionTitle('User Preferences')}

        <div className="settings-group">
          <div className="slider-group">
            <span>Red color preference:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.colorPreference}
              onChange={(e) =>
                handleParamChange('colorPreference', e.target.value)
              }
            />
            <span>{Math.round(params.colorPreference * 100)}%</span>
          </div>

          <div className="slider-group">
            <span>Red color effect:</span>
            <input
              type="range"
              className="impact-slider"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={params.colorImpact}
              onChange={(e) => handleParamChange('colorImpact', e.target.value)}
              title="Positive values boost red button clicks, negative values reduce non-red button clicks"
            />
            <span>{formatImpact(params.colorImpact)}</span>
          </div>

          <div className="slider-group">
            <span>Center preference:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.centerPreference}
              onChange={(e) =>
                handleParamChange('centerPreference', e.target.value)
              }
            />
            <span>{Math.round(params.centerPreference * 100)}%</span>
          </div>

          <div className="slider-group">
            <span>Center text effect:</span>
            <input
              type="range"
              className="impact-slider"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={params.centerImpact}
              onChange={(e) =>
                handleParamChange('centerImpact', e.target.value)
              }
              title="Positive values boost centered text clicks, negative values reduce non-centered text clicks"
            />
            <span>{formatImpact(params.centerImpact)}</span>
          </div>

          <div className="slider-group">
            <span>Spelling preference:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={params.spellingPreference}
              onChange={(e) =>
                handleParamChange('spellingPreference', e.target.value)
              }
            />
            <span>{Math.round(params.spellingPreference * 100)}%</span>
          </div>

          <div className="slider-group">
            <span>Correct spelling effect:</span>
            <input
              type="range"
              className="impact-slider"
              min="-0.5"
              max="0.5"
              step="0.05"
              value={params.spellingImpact}
              onChange={(e) =>
                handleParamChange('spellingImpact', e.target.value)
              }
              title="Positive values boost correct spelling clicks, negative values reduce incorrect spelling clicks"
            />
            <span>{formatImpact(params.spellingImpact)}</span>
          </div>
        </div>
      </div>

      <div className="settings-info">
        <p>
          <strong>How effects work:</strong>
        </p>
        <p>
          Positive values (+) increase clicks when the attribute is present.
        </p>
        <p>
          Negative values (-) decrease clicks when the attribute is present.
        </p>
        <p>Multiple effects combine multiplicatively.</p>
      </div>
    </div>
  );
}

export default PopulationSettings;
