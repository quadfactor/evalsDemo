import { useState, useEffect, useContext, useMemo } from 'react';
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

  // For high-volume processing in batches
  const processBatchSize = useMemo(() => {
    // Dynamically adjust batch size based on FPS
    if (params.fps <= 30) return 1;
    if (params.fps <= 100) return 5;
    if (params.fps <= 500) return 20;
    return 50; // For extremely high fps
  }, [params.fps]);

  // Reset all simulation stats
  const resetAllStats = () => {
    setImpressionsA(0);
    setClicksA(0);
    setProbabilityA(0);
    setImpressionsB(0);
    setClicksB(0);
    setProbabilityB(0);
  };

  // Population distribution logic with batch processing
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Process a batch of users at once for high FPS settings
      for (let i = 0; i < processBatchSize; i++) {
        // Randomly assign a user to either variation A or B
        if (Math.random() < 0.5) {
          // Assign to variation A
          setImpressionsA((prev) => prev + 1);
        } else {
          // Assign to variation B
          setImpressionsB((prev) => prev + 1);
        }
      }
    }, 1000 / (params.fps / processBatchSize)); // Adjusted interval for batch size

    return () => clearInterval(interval);
  }, [isRunning, params.fps, processBatchSize]);

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
