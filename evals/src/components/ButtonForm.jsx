import { useState, useEffect, useContext } from 'react';
import { PopulationContext } from '../contexts/PopulationContext';

function ButtonForm({
  name = 'Default',
  primaryColor = 'red',
  impressions, // Now receiving impressions from parent
  onClick,
  onProbabilityChange,
}) {
  const { params, isRunning } = useContext(PopulationContext);
  const colorClasses = ['red', 'green', 'blue', 'yellow', 'purple'];
  // Button states
  const [buttonClass, setButtonClass] = useState(colorClasses[0]);
  const [isTextCentered, setIsTextCentered] = useState(true);
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(primaryColor);

  // Settings states
  const [probability, setProbability] = useState(0.5);
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
  const simulateUserInteraction = (
    currentButtonClass,
    isCurrentTextCentered,
    currentButtonText
  ) => {
    // Start with base click rate
    let baseClickRate = params.baseClickRate;

    // Use a multiplier approach for combining effects
    let multiplier = 1.0;

    // Color impact - specific preference for red
    const hasPreferredColor = currentButtonClass === 'red';
    if (Math.random() < params.colorPreference) {
      // This user cares about red color
      if (hasPreferredColor) {
        // Apply the multiplier (positive or negative) only when red is shown
        multiplier *= 1 + params.colorImpact;
      }
    }

    // Text centering impact
    if (Math.random() < params.centerPreference) {
      // This user cares about alignment
      if (isCurrentTextCentered) {
        // Apply the multiplier (positive or negative) only when text is centered
        multiplier *= 1 + params.centerImpact;
      }
    }

    // Spelling impact
    const hasCorrectSpelling = currentButtonText === baseButtonText;
    if (Math.random() < params.spellingPreference) {
      // This user cares about spelling
      if (hasCorrectSpelling) {
        // Apply the multiplier (positive or negative) only when spelling is correct
        multiplier *= 1 + params.spellingImpact;
      }
    }

    // Apply the multiplier to the base rate
    let clickProbability = baseClickRate * multiplier;

    // Ensure probability is within valid range
    clickProbability = Math.max(0, Math.min(1, clickProbability));

    // Pass the current probability to parent (but don't increment impressions here)
    onProbabilityChange(clickProbability);

    // Determine if click happens (simulating actual user clicking)
    if (Math.random() < clickProbability) {
      onClick();
      return true;
    }
    return false;
  };

  // For efficient tracking of impression processing
  const [lastProcessedImpression, setLastProcessedImpression] = useState(0);

  // Batch processing of impressions - simplified without performance mode
  useEffect(() => {
    if (!isRunning || impressions === lastProcessedImpression) return;

    // Process new impressions
    const newImpressionsCount = impressions - lastProcessedImpression;

    // Process impressions one by one for accurate simulation
    for (let i = 0; i < newImpressionsCount; i++) {
      simulateSingleImpression();
    }

    // Update the last processed impression count
    setLastProcessedImpression(impressions);
  }, [impressions, isRunning]);

  // New helper function to simulate a single impression
  const simulateSingleImpression = () => {
    // Generate all random values at once to ensure consistency
    const randomValue = Math.random();
    const centerValue = Math.random();
    const spellingValue = Math.random();

    // Determine button state for this impression
    const currentButtonClass = getButtonClass(randomValue);
    const isCurrentTextCentered = centerValue < centerProb;
    const currentButtonText = getButtonText(spellingValue);

    // Update UI for this impression
    setButtonClass(currentButtonClass);
    setIsTextCentered(isCurrentTextCentered);
    setTextOffset(getTextOffset(isCurrentTextCentered));
    setButtonText(currentButtonText);

    // Calculate probability and determine click
    const clickProbability = calculateClickProbability(
      currentButtonClass,
      isCurrentTextCentered,
      currentButtonText
    );

    // Update parent with current probability
    onProbabilityChange(clickProbability);

    // Simulate click if probability threshold is met
    if (Math.random() < clickProbability) {
      onClick();
    }
  };

  // Helper function for batch processing
  const processImpressionsBatch = (count) => {
    let totalProbability = 0;
    let totalClicks = 0;

    // Process all impressions but only update UI with the last one
    for (let i = 0; i < count; i++) {
      const randomValue = Math.random();
      const centerValue = Math.random();
      const spellingValue = Math.random();

      // Calculate state for this impression
      const currentButtonClass = getButtonClass(randomValue);
      const isCurrentTextCentered = centerValue < centerProb;
      const currentButtonText = getButtonText(spellingValue);

      // If this is the last impression, update the UI
      if (i === count - 1) {
        setButtonClass(currentButtonClass);
        setIsTextCentered(isCurrentTextCentered);
        setTextOffset(getTextOffset(isCurrentTextCentered));
        setButtonText(currentButtonText);
      }

      // Calculate probability for this impression
      const clickProbability = calculateClickProbability(
        currentButtonClass,
        isCurrentTextCentered,
        currentButtonText
      );

      totalProbability += clickProbability;

      // Determine if this impression would result in a click
      if (Math.random() < clickProbability) {
        totalClicks++;
      }
    }

    // Report average probability to parent
    const avgProbability = totalProbability / count;
    onProbabilityChange(avgProbability);

    // Trigger clicks
    if (totalClicks > 0) {
      // Use batched updates for better performance
      onClick(totalClicks);
    }
  };

  // Helper to get button class based on random value
  const getButtonClass = (randomValue) => {
    if (randomValue < probability) {
      return selectedColor;
    } else {
      const availableColors = colorClasses.filter(
        (color) => color !== selectedColor
      );
      const colorIndex = Math.floor(Math.random() * availableColors.length);
      return availableColors[colorIndex];
    }
  };

  // Helper to get text offset based on centering
  const getTextOffset = (isCentered) => {
    if (isCentered) {
      return { x: 0, y: 0 };
    } else {
      return {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20,
      };
    }
  };

  // Helper to get button text based on spelling probability
  const getButtonText = (randomValue) => {
    if (randomValue < spellingProb) {
      return baseButtonText;
    } else {
      return generateMisspelling(baseButtonText);
    }
  };

  // Improved click probability calculation
  const calculateClickProbability = (
    currentButtonClass,
    isCurrentTextCentered,
    currentButtonText
  ) => {
    // Start with base click rate
    let baseClickRate = params.baseClickRate;
    let multiplier = 1.0;

    // Color impact - specific preference for red
    const hasPreferredColor = currentButtonClass === 'red';
    const userCaresAboutColor = Math.random() < params.colorPreference;

    if (userCaresAboutColor) {
      if (hasPreferredColor) {
        multiplier *= 1 + params.colorImpact;
      }
    }

    // Text centering impact
    const userCaresAboutCentering = Math.random() < params.centerPreference;
    if (userCaresAboutCentering) {
      if (isCurrentTextCentered) {
        multiplier *= 1 + params.centerImpact;
      }
    }

    // Spelling impact
    const hasCorrectSpelling = currentButtonText === baseButtonText;
    const userCaresAboutSpelling = Math.random() < params.spellingPreference;
    if (userCaresAboutSpelling) {
      if (hasCorrectSpelling) {
        multiplier *= 1 + params.spellingImpact;
      }
    }

    // Apply multiplier and ensure valid range
    let clickProbability = baseClickRate * multiplier;
    return Math.max(0, Math.min(1, clickProbability));
  };

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
            <span>{selectedColor} probability:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={probability}
              onChange={(e) => setProbability(parseFloat(e.target.value))}
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
