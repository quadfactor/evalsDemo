import { useContext, useState } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function PopulationSettings({ onResetSimulation }) {
  const {
    params,
    setParams,
    isRunning,
    setIsRunning,
    requiredPopulationSize,
    turboProgress,
  } = useContext(PopulationContext);
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

  // Handle reset simulation
  const handleReset = () => {
    // Stop the simulation first
    setIsRunning(false);

    // Reset stats
    onResetSimulation();

    // Add a small delay before allowing to restart
    setTimeout(() => {
      // Can optionally restart simulation automatically
      // setIsRunning(true);
    }, 100);
  };

  // Handle population size change
  const handlePopulationChange = (value) => {
    // Reset stats if population size changes
    if (params.populationSize !== Number(value)) {
      // Optional: auto-reset when changing population
      // onResetSimulation();
    }

    handleParamChange('populationSize', Math.max(1000, value));
  };

  // Helper for rendering FPS slider as a normal slider without hints
  const renderFPSControl = () => {
    const fpsValue = params.fps;

    return (
      <div className="slider-group">
        <span>Simulation speed:</span>
        <input
          type="range"
          className="fps-slider"
          min="1"
          max="30"
          step="1"
          value={fpsValue}
          onChange={(e) =>
            handleParamChange('fps', parseInt(e.target.value, 10))
          }
        />
        <span>{fpsValue} FPS</span>
      </div>
    );
  };

  // For turbo mode
  const isTurboRunning =
    isRunning && params.turboMode && turboProgress > 0 && turboProgress < 100;

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
        {/* Simulation Controls Section - Redesigned as media player controls */}
        {renderSectionTitle('Simulation Controls')}

        <div className="settings-group">
          <div className="media-controls">
            {/* Play/Pause button */}
            <button
              className={`media-button ${isRunning ? 'pause' : 'play'} ${
                isTurboRunning ? 'turbo-running' : ''
              }`}
              onClick={() => !isTurboRunning && setIsRunning(!isRunning)}
              disabled={isTurboRunning}
              title={isRunning ? 'Pause Simulation' : 'Play Simulation'}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Play'}
            </button>

            {/* Stop button (previously Reset) */}
            <button
              className="media-button stop"
              onClick={handleReset}
              disabled={isTurboRunning}
              title="Stop and Reset Simulation"
            >
              ⏹️ Stop
            </button>

            {/* Fast Forward button (replaces Turbo Mode checkbox) */}
            <button
              className={`media-button ff ${params.turboMode ? 'active' : ''}`}
              onClick={() =>
                !isRunning && handleParamChange('turboMode', !params.turboMode)
              }
              disabled={isRunning}
              title="Toggle Fast Forward Mode"
            >
              {params.turboMode ? '⏩ On' : '⏩ Off'}
            </button>
          </div>

          {/* Speed slider */}
          <div className="slider-group">
            <span>Normal speed:</span>
            <input
              type="range"
              className="speed-slider"
              min="1"
              max="30"
              step="1"
              value={params.fps}
              onChange={(e) =>
                handleParamChange('fps', parseInt(e.target.value, 10))
              }
              disabled={isRunning}
            />
            <span>{params.fps}x</span>
          </div>

          {/* Fast-forward speed multiplier slider */}
          <div
            className={`slider-group ${
              params.turboMode ? 'active' : 'inactive'
            }`}
          >
            <span>FF speed:</span>
            <input
              type="range"
              className={`speed-slider ${params.turboMode ? 'ff-active' : ''}`}
              min="10"
              max="1000"
              step="10"
              value={params.turboSpeedMultiplier}
              onChange={(e) =>
                handleParamChange('turboSpeedMultiplier', e.target.value)
              }
              disabled={isRunning || !params.turboMode}
            />
            <span>x{params.turboSpeedMultiplier}</span>
          </div>

          {params.turboMode && (
            <div className="info-box ff-info">
              <span className="info-icon">ℹ️</span>
              <span>
                Fast-forward skips UI updates for maximum simulation speed
              </span>
            </div>
          )}

          {isTurboRunning && (
            <div className="progress-indicator">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${turboProgress}%` }}
                ></div>
              </div>
              <span>{turboProgress}% complete</span>
            </div>
          )}
        </div>

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
