import { useState } from 'react';
import ButtonForm from './components/ButtonForm';
import Results from './components/Results';
import PopulationSettings from './components/PopulationSettings';
import { PopulationProvider } from './contexts/PopulationContext';
import './App.css';

function App() {
  // Results state for Variation A
  const [impressionsA, setImpressionsA] = useState(0);
  const [clicksA, setClicksA] = useState(0);
  const [probabilityA, setProbabilityA] = useState(0);

  // Results state for Variation B
  const [impressionsB, setImpressionsB] = useState(0);
  const [clicksB, setClicksB] = useState(0);
  const [probabilityB, setProbabilityB] = useState(0);

  const resetStatsA = () => {
    setImpressionsA(0);
    setClicksA(0);
  };

  const resetStatsB = () => {
    setImpressionsB(0);
    setClicksB(0);
  };

  return (
    <PopulationProvider>
      <div className="container">
        <h1>A/B Testing Simulator</h1>
        <p className="description">
          Simulate how different button characteristics affect click rates. Set
          population parameters and observe how users interact with different
          variations.
        </p>
        <PopulationSettings />

        <div className="forms-container">
          <div className="variation-container">
            <Results
              name="(Variation A)"
              impressions={impressionsA}
              clicks={clicksA}
              currentClickProbability={probabilityA}
              onReset={resetStatsA}
            />
            <ButtonForm
              name="(Variation A)"
              primaryColor="blue"
              onImpression={() => setImpressionsA((prev) => prev + 1)}
              onClick={() => setClicksA((prev) => prev + 1)}
              onProbabilityChange={setProbabilityA}
            />
          </div>
          <div className="variation-container">
            <Results
              name="(Variation B)"
              impressions={impressionsB}
              clicks={clicksB}
              currentClickProbability={probabilityB}
              onReset={resetStatsB}
            />
            <ButtonForm
              name="(Variation B)"
              primaryColor="red"
              onImpression={() => setImpressionsB((prev) => prev + 1)}
              onClick={() => setClicksB((prev) => prev + 1)}
              onProbabilityChange={setProbabilityB}
            />
          </div>
        </div>
      </div>
    </PopulationProvider>
  );
}

export default App;
