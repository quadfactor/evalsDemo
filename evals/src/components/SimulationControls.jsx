import { useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function SimulationControls({ onResetSimulation }) {
  const {
    params,
    setParams,
    isRunning,
    setIsRunning,
    requiredPopulationSize,
    turboProgress,
    totalImpressions,
    sampleSizeReached,
    resetSampleComplete,
    setTurboProgress,
    isChunkedOperationRunning,
  } = useContext(PopulationContext);

  // Handle parameter changes for simulation controls
  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: Number(value) }));
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

  // For turbo mode
  const isTurboRunning =
    isRunning && params.turboMode && turboProgress > 0 && turboProgress < 100;

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

  // Add a status message for chunked operations with counts
  const getChunkedOperationMessage = () => {
    if (!isChunkedOperationRunning) return null;

    // Calculate how many impressions have been processed
    const totalRequired = requiredPopulationSize;
    const totalProcessed = totalImpressions;
    const percentComplete = Math.round((totalProcessed / totalRequired) * 100);

    const formattedTotal = new Intl.NumberFormat().format(totalProcessed);
    const formattedRequired = new Intl.NumberFormat().format(totalRequired);

    return (
      <div className="chunked-operation-message">
        <span>
          Processing simulation: {formattedTotal} of {formattedRequired}{' '}
          impressions ({percentComplete}% complete)
        </span>
      </div>
    );
  };

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
    <div className="simulation-controls-panel">
      <h3 className="controls-title">Simulation Controls</h3>

      <div className="simulation-controls-content">
        <div className="media-controls">
          {/* Play/Pause button */}
          <button
            className={`media-button ${isRunning ? 'pause' : 'play'} ${
              isTurboRunning || isChunkedOperationRunning ? 'turbo-running' : ''
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

          {/* Reset button */}
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

          {/* Fast Forward button */}
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

        {/* Special message during chunked operation */}
        {isChunkedOperationRunning && (
          <div
            className="sample-complete-message"
            style={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderLeftColor: '#2196f3',
            }}
          >
            <span className="info-icon">⏱️</span>
            {getChunkedOperationMessage()}
          </div>
        )}

        {/* Show regular progress indicator for turbo mode */}
        {isChunkedOperationRunning && (
          <div className="progress-indicator">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${turboProgress}%`,
                  backgroundColor: '#2196f3',
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
            <span>{turboProgress}% complete</span>
          </div>
        )}

        {/* Sample complete message */}
        {sampleSizeReached && !isChunkedOperationRunning && (
          <div className="sample-complete-message">
            <span className="info-icon">✓</span>
            <span>
              Sample size reached. Press Reset to run another simulation.
            </span>
          </div>
        )}

        {/* Refresh Rate slider */}
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
            disabled={isRunning && params.turboMode}
          />
          <span>{params.fps} FPS</span>
        </div>

        {/* Fast-forward info box */}
        {params.turboMode && (
          <div className="info-box ff-info">
            <span className="info-icon">{infoIcon}</span>
            <span>
              Fast-forward runs at 100x speed and skips UI updates for maximum
              simulation speed.
            </span>
          </div>
        )}

        {/* Turbo mode progress indicator */}
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
    </div>
  );
}

export default SimulationControls;
