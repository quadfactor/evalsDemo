import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const colorClasses = ['green', 'blue', 'yellow', 'purple'];
  const [probability, setProbability] = useState(0.5);
  const [fps, setFps] = useState(3);
  const [centerProb, setCenterProb] = useState(1); // New state
  const [buttonClass, setButtonClass] = useState(colorClasses[0]);
  const [isTextCentered, setIsTextCentered] = useState(true); // New state
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });
  const [spellingProb, setSpellingProb] = useState(1);
  const [buttonText, setButtonText] = useState('Click Me!');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const getMisspelledText = () => {
    const variants = [
      'Clik Me!',
      'Click Mee!',
      'Clikc Me!',
      'Clck Me!',
      'Click M!',
      'Klik Me!',
      'Click mei!',
      'Clik Meh!',
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.random();
      const centerValue = Math.random();
      const spellingValue = Math.random();

      // Color logic
      if (randomValue < probability) {
        setButtonClass('red');
      } else {
        const colorIndex = Math.floor(Math.random() * colorClasses.length);
        setButtonClass(colorClasses[colorIndex]);
      }

      // Text alignment logic
      if (centerValue < centerProb) {
        setTextOffset({ x: 0, y: 0 });
        setIsTextCentered(true);
      } else {
        setTextOffset({
          x: (Math.random() - 0.5) * 40, // -20px to +20px
          y: (Math.random() - 0.5) * 20, // -10px to +10px
        });
        setIsTextCentered(false);
      }

      // Spelling logic
      if (spellingValue < spellingProb) {
        setButtonText('Click Me!');
      } else {
        setButtonText(getMisspelledText());
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [probability, fps, centerProb, spellingProb]);

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
    <div className="container">
      <div className="settings-panel">
        <h3 className="settings-title">Control Panel</h3>
        <div className="slider-controls">
          <div className="slider-group">
            <span>Red probability:</span>
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
    </div>
  );
}

export default App;
