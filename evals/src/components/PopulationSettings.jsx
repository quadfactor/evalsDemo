import { useContext, useState } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function PopulationSettings() {
  const { params, setParams } = useContext(PopulationContext);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: Number(value) }));
  };

  // Format impact values to show sign
  const formatImpact = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(0)}%`;
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
          <span>Color impact:</span>
          <input
            type="range"
            className="impact-slider"
            min="-0.5"
            max="0.5"
            step="0.05"
            value={params.colorImpact}
            onChange={(e) => handleParamChange('colorImpact', e.target.value)}
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
          <span>Center impact:</span>
          <input
            type="range"
            className="impact-slider"
            min="-0.5"
            max="0.5"
            step="0.05"
            value={params.centerImpact}
            onChange={(e) => handleParamChange('centerImpact', e.target.value)}
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
          <span>Spelling impact:</span>
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
          />
          <span>{formatImpact(params.spellingImpact)}</span>
        </div>
      </div>
    </div>
  );
}

export default PopulationSettings;
