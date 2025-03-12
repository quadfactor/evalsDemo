import { useContext, useState, useEffect } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function PopulationSettings({ onResetSimulation }) {
  const {
    params,
    setParams,
    isRunning,
    setIsRunning,
    requiredPopulationSize,
    turboProgress,
    totalImpressions, // Add this to track total impressions from context
    sampleSizeReached, // Add this to track if sample size is reached
    resetSampleComplete, // Add this function to reset sample complete flag
    setTurboProgress, // Add this prop to ensure we have access to it
    isChunkedOperationRunning,
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
    // Don't allow reset while a chunked operation is in progress
    if (isChunkedOperationRunning) {
      return;
    }

    // Stop the simulation first
    setIsRunning(false);

    // Reset stats and sample complete flag
    onResetSimulation();
    resetSampleComplete();

    // Important: Reset turbo progress to ensure fast forward works after reset
    setTurboProgress(0);

    // Add a small delay before allowing to restart
    setTimeout(() => {
      // Keep turbo mode setting intact if it was previously enabled
      if (params.turboMode) {
        // Ensure turbo mode is retained with 100x speed
        handleParamChange('turboSpeedMultiplier', 100);
        // Restart simulation automatically if in turbo mode
        setIsRunning(true);
      }
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

  // Add useEffect to handle sample size completion
  useEffect(() => {
    // When sample size is reached, ensure turbo mode is turned off
    if (sampleSizeReached && params.turboMode) {
      handleParamChange('turboMode', false);
    }
  }, [sampleSizeReached]);

  // Function to toggle fast forward mode
  const toggleFastForward = () => {
    // Don't allow enabling if sample size reached
    if (sampleSizeReached && !params.turboMode) {
      return;
    }

    // Don't allow toggling while a chunked operation is in progress
    if (isChunkedOperationRunning) {
      return;
    }

    // Toggle turbo mode
    const newTurboMode = !params.turboMode;
    handleParamChange('turboMode', newTurboMode);

    // Always set to default 100x when enabling
    if (newTurboMode) {
      handleParamChange('turboSpeedMultiplier', 100);

      // Reset turbo progress to ensure it starts fresh
      setTurboProgress(0);

      // Start the simulation if it's not already running
      if (!isRunning) {
        setIsRunning(true);
      }
    }
  };

  // Format numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  // Helper for rendering a section title
  const renderSectionTitle = (title) => (
    <div className="settings-section-title">{title}</div>
  );

  // Define SVG icons
  const playIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const pauseIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  // Replace stop icon with refresh/reset icon
  const resetIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );

  const fastForwardIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
    </svg>
  );

  const infoIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
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
        {/* Simulation Controls Section - Redesigned with SVG icons */}
        {renderSectionTitle('Simulation Controls')}

        <div className="settings-group">
          <div className="media-controls">
            {/* Play/Pause button with SVG icons - now disabled when sample size reached or chunked operation running */}
            <button
              className={`media-button ${isRunning ? 'pause' : 'play'} ${
                isTurboRunning || isChunkedOperationRunning
                  ? 'turbo-running'
                  : ''
              } ${sampleSizeReached ? 'disabled' : ''}`}
              onClick={() =>
                !isTurboRunning &&
                !isChunkedOperationRunning &&
                setIsRunning(!isRunning)
              }
              disabled={
                isTurboRunning || sampleSizeReached || isChunkedOperationRunning
              }
              title={
                isChunkedOperationRunning
                  ? 'Simulation processing in chunks, please wait...'
                  : sampleSizeReached
                  ? 'Sample size reached, reset to run again'
                  : isRunning
                  ? 'Pause Simulation'
                  : 'Play Simulation'
              }
            >
              {isRunning ? pauseIcon : playIcon}
              <span>{isRunning ? 'Pause' : 'Play'}</span>
            </button>

            {/* Reset button with refresh icon - disabled during chunked operations */}
            <button
              className="media-button reset"
              onClick={handleReset}
              disabled={isTurboRunning || isChunkedOperationRunning}
              title={
                isChunkedOperationRunning
                  ? 'Simulation processing in chunks, please wait...'
                  : 'Reset Simulation'
              }
            >
              {resetIcon}
              <span>Reset</span>
            </button>

            {/* Fast Forward button with SVG icon - disabled during chunked operations */}
            <button
              className={`media-button ff ${params.turboMode ? 'active' : ''}`}
              onClick={toggleFastForward}
              disabled={sampleSizeReached || isChunkedOperationRunning}
              title={
                isChunkedOperationRunning
                  ? 'Simulation processing in chunks, please wait...'
                  : sampleSizeReached
                  ? 'Sample size reached, reset to run again'
                  : 'Toggle Fast Forward Mode (100x speed)'
              }
            >
              {fastForwardIcon}
              <span>{params.turboMode ? 'On' : 'Off'}</span>
            </button>
          </div>

          {/* Add a special message during chunked operation */}
          {isChunkedOperationRunning && (
            <div className="sample-complete-message">
              <span className="info-icon">⏱️</span>
              <span>
                Processing large simulation in chunks to prevent browser
                freezing...
              </span>
            </div>
          )}

          {/* Show sample complete message when needed */}
          {sampleSizeReached && !isChunkedOperationRunning && (
            <div className="sample-complete-message">
              <span className="info-icon">✓</span>
              <span>
                Sample size reached. Press Reset to run another simulation.
              </span>
            </div>
          )}

          {/* Speed slider - Updated to "Refresh Rate" */}
          <div className="slider-group">
            <span>Refresh Rate:</span>
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
              disabled={
                isRunning && params.turboMode
              } /* Only disable when in turbo mode */
            />
            <span>{params.fps} FPS</span>
          </div>

          {/* Remove Fast-forward speed multiplier slider */}

          {/* Update info box to include the fixed speed */}
          {params.turboMode && (
            <div className="info-box ff-info">
              <span className="info-icon">{infoIcon}</span>
              <span>
                Fast-forward runs at 100x speed and skips UI updates for maximum
                simulation speed.
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
