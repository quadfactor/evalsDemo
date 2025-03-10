import { useState, useEffect, useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function ButtonForm({
  name = 'Default',
  primaryColor = 'red',
  onImpression,
  onClick,
  onProbabilityChange,
}) {
  const { params } = useContext(PopulationContext);
  const colorClasses = ['red', 'green', 'blue', 'yellow', 'purple'];
  // Button states
  const [buttonClass, setButtonClass] = useState(colorClasses[0]);
  const [isTextCentered, setIsTextCentered] = useState(true);
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(primaryColor);

  // Settings states
  const [probability, setProbability] = useState(0.5);
  const [fps, setFps] = useState(3);
  const [centerProb, setCenterProb] = useState(1);
  const [spellingProb, setSpellingProb] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [baseButtonText, setBaseButtonText] = useState('Click Me!');
  const [buttonText, setButtonText] = useState(baseButtonText);

  const generateMisspelling = (text) => {
    const modifications = [
      (str) => str.replace(/[aeiou]/i, ''), // Remove random vowel
      (str) => str.replace(/(.)(.*)/i, '$2$1'), // Move first letter to end
      (str) => str.replace(/(.)/i, '$1$1'), // Double a random letter
      (str) => str.replace(/\s+/g, ''), // Remove spaces
      (str) =>
        str.replace(/([a-z])/i, (char) =>
          char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
        ), // Random case
      (str) =>
        str.replace(
          /[aeiou]/i,
          (vowel) => 'aeiou'[Math.floor(Math.random() * 5)]
        ), // Replace vowel
    ];

    const modification =
      modifications[Math.floor(Math.random() * modifications.length)];
    return modification(text);
  };

  // Calculate if user would click based on current button state
  const simulateUserInteraction = () => {
    // Base chance
    let clickProbability = params.baseClickRate;

    // Color impact
    const hasPreferredColor = buttonClass === selectedColor;
    if (Math.random() < params.colorPreference) {
      // This user cares about color
      clickProbability += hasPreferredColor
        ? params.colorImpact
        : -params.colorImpact;
    }

    // Text centering impact
    if (Math.random() < params.centerPreference) {
      // This user cares about alignment
      clickProbability += isTextCentered
        ? params.centerImpact
        : -params.centerImpact;
    }

    // Spelling impact
    const hasCorrectSpelling = buttonText === baseButtonText;
    if (Math.random() < params.spellingPreference) {
      // This user cares about spelling
      clickProbability += hasCorrectSpelling
        ? params.spellingImpact
        : -params.spellingImpact;
    }

    // Ensure probability is within valid range
    clickProbability = Math.max(0, Math.min(1, clickProbability));

    // Pass the current probability to parent
    onProbabilityChange(clickProbability);

    // Increment impressions
    onImpression();

    // Determine if click happens
    if (Math.random() < clickProbability) {
      onClick();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.random();
      const centerValue = Math.random();
      const spellingValue = Math.random();

      // Color logic
      if (randomValue < probability) {
        setButtonClass(selectedColor);
      } else {
        const availableColors = colorClasses.filter(
          (color) => color !== selectedColor
        );
        const colorIndex = Math.floor(Math.random() * availableColors.length);
        setButtonClass(availableColors[colorIndex]);
      }

      // Text alignment logic
      if (centerValue < centerProb) {
        setTextOffset({ x: 0, y: 0 });
        setIsTextCentered(true);
      } else {
        setTextOffset({
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 20,
        });
        setIsTextCentered(false);
      }

      // Updated spelling logic
      if (spellingValue < spellingProb) {
        setButtonText(baseButtonText);
      } else {
        setButtonText(generateMisspelling(baseButtonText));
      }

      // Simulate user interaction after state updates
      setTimeout(() => {
        simulateUserInteraction();
      }, 50);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [
    probability,
    fps,
    centerProb,
    spellingProb,
    selectedColor,
    baseButtonText,
    params.baseClickRate,
    params.colorPreference,
    params.colorImpact,
    params.centerPreference,
    params.centerImpact,
    params.spellingPreference,
    params.spellingImpact,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted!\nName: ${formData.name}\nEmail: ${formData.email}`);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className={`settings-panel ${!isPanelOpen ? 'collapsed' : ''}`}>
        <div className="settings-header">
          <h3 className="settings-title">Control Panel {name}</h3>
          <button
            className="collapse-button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            {isPanelOpen ? '−' : '+'}
          </button>
        </div>
        <div className="slider-controls">
          <div className="slider-group">
            <span>Primary Color:</span>
            <select
              className="color-select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {colorClasses.map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="slider-group">
            <span>Update rate:</span>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
            />
            <span>{fps} FPS</span>
          </div>
          <div className="slider-group">
            <span>{selectedColor} probability:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={probability}
              onChange={(e) => setProbability(e.target.value)}
            />
            <span>{Math.round(probability * 100)}%</span>
          </div>
          <div className="slider-group">
            <span>Center probability:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={centerProb}
              onChange={(e) => setCenterProb(Number(e.target.value))}
            />
            <span>{Math.round(centerProb * 100)}%</span>
          </div>
          <div className="slider-group">
            <span>Correct spelling:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={spellingProb}
              onChange={(e) => setSpellingProb(Number(e.target.value))}
            />
            <span>{Math.round(spellingProb * 100)}%</span>
          </div>
          <div className="slider-group">
            <span>Button Text:</span>
            <input
              type="text"
              className="form-input"
              value={baseButtonText}
              onChange={(e) => setBaseButtonText(e.target.value)}
              placeholder="Enter button text"
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="button-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <button
          type="submit"
          className={`cta-button ${buttonClass} ${
            isTextCentered ? 'text-centered' : ''
          }`}
          style={
            !isTextCentered
              ? {
                  transform: `translate(${textOffset.x}px, ${textOffset.y}px)`,
                }
              : undefined
          }
        >
          {buttonText}
        </button>
      </form>
    </>
  );
}

export default ButtonForm;
