import { useContext, useState } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function PopulationSettings({ onResetSimulation }) {
  const { params, setParams, isRunning, setIsRunning } =
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
        <div className="simulation-controls">
          <button
            className={`control-button ${isRunning ? 'stop' : 'start'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Stop Simulation' : 'Start Simulation'}
          </button>

          <button className="control-button reset" onClick={handleReset}>
            Reset Simulation
          </button>

          <div className="population-size">
            <label htmlFor="population-size">Population:</label>
            <input
              id="population-size"
              type="number"
              min="1000"
              max="1000000"
              step="1000"
              value={params.populationSize}
              onChange={(e) =>
                handleParamChange(
                  'populationSize',
                  Math.max(1000, e.target.value)
                )
              }
              className="population-input"
            />
          </div>
        </div>

        <div className="slider-group">
          <span>Simulation speed:</span>
          <input
            type="range"
            min="1"
            max="1000"
            step={params.fps > 100 ? 100 : params.fps > 30 ? 10 : 1}
            value={params.fps}
            onChange={(e) => handleParamChange('fps', e.target.value)}
          />
          <span>{params.fps} FPS</span>
        </div>

        <div className="slider-group">
          <span>Base click rate:</span>
          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.05"
            value={params.baseClickRate}
            onChange={(e) => handleParamChange('baseClickRate', e.target.value)}
          />
          <span>{Math.round(params.baseClickRate * 100)}%</span>
        </div>

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
            onChange={(e) => handleParamChange('centerImpact', e.target.value)}
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
