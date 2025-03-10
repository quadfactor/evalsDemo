import { useState, useEffect, useContext } from 'react';
import ButtonForm from './components/ButtonForm';
import Results from './components/Results';
import PopulationSettings from './components/PopulationSettings';
import {
  PopulationProvider,
  PopulationContext,
} from './contexts/PopulationContext';
import './App.css';

function AppContent() {
  const { params, isRunning } = useContext(PopulationContext);

  // Results state for Variation A
  const [impressionsA, setImpressionsA] = useState(0);
  const [clicksA, setClicksA] = useState(0);
  const [probabilityA, setProbabilityA] = useState(0);

  // Results state for Variation B
  const [impressionsB, setImpressionsB] = useState(0);
  const [clicksB, setClicksB] = useState(0);
  const [probabilityB, setProbabilityB] = useState(0);

  // Reset all simulation stats
  const resetAllStats = () => {
    setImpressionsA(0);
    setClicksA(0);
    setProbabilityA(0);
    setImpressionsB(0);
    setClicksB(0);
    setProbabilityB(0);
  };

  // Population distribution logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Randomly assign a user to either variation A or B
      if (Math.random() < 0.5) {
        // Assign to variation A
        setImpressionsA((prev) => prev + 1);
      } else {
        // Assign to variation B
        setImpressionsB((prev) => prev + 1);
      }
    }, 1000 / params.fps);

    return () => clearInterval(interval);
  }, [isRunning, params.fps]);

  return (
    <div className="container">
      <h1>A/B Testing Simulator</h1>
      <p className="description">
        Simulate how different button characteristics affect click rates. Set
        population parameters and observe how users interact with different
        variations.
      </p>
      <PopulationSettings onResetSimulation={resetAllStats} />

      <div className="forms-container">
        <div className="variation-container">
          <Results
            name="(Variation A)"
            impressions={impressionsA}
            clicks={clicksA}
            currentClickProbability={probabilityA}
            totalPopulation={params.populationSize}
          />
          <ButtonForm
            name="(Variation A)"
            primaryColor="blue"
            impressions={impressionsA}
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
            totalPopulation={params.populationSize}
          />
          <ButtonForm
            name="(Variation B)"
            primaryColor="red"
            impressions={impressionsB}
            onClick={() => setClicksB((prev) => prev + 1)}
            onProbabilityChange={setProbabilityB}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <PopulationProvider>
      <AppContent />
    </PopulationProvider>
  );
}

export default App;
