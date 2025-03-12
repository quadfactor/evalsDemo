import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import ButtonForm from './components/ButtonForm';
import Results from './components/Results';
import PopulationSettings from './components/PopulationSettings';
import {
  PopulationProvider,
  PopulationContext,
} from './contexts/PopulationContext';
import './App.css';

function AppContent() {
  const {
    params,
    isRunning,
    setIsRunning,
    requiredPopulationSize,
    setTurboProgress,
    turboProgress,
    updateTotalImpressions,
    isChunkedOperationRunning,
    setIsChunkedOperationRunning,
  } = useContext(PopulationContext);

  // Results state for Variation A
  const [impressionsA, setImpressionsA] = useState(0);
  const [clicksA, setClicksA] = useState(0);
  const [probabilityA, setProbabilityA] = useState(0);

  // Results state for Variation B
  const [impressionsB, setImpressionsB] = useState(0);
  const [clicksB, setClicksB] = useState(0);
  const [probabilityB, setProbabilityB] = useState(0);

  // Prepare variation data objects for lift comparison
  const variationA = { impressions: impressionsA, clicks: clicksA };
  const variationB = { impressions: impressionsB, clicks: clicksB };

  // For high-volume processing in batches - simplified with fixed processing size
  const processBatchSize = useMemo(() => {
    // Fixed batch size since FPS is now limited to max 30
    return 1; // Process impressions one by one for consistent simulation
  }, []);

  // Update total impressions whenever impressions change
  useEffect(() => {
    const total = impressionsA + impressionsB;
    updateTotalImpressions(total);
  }, [impressionsA, impressionsB, updateTotalImpressions]);

  // Reset all simulation stats
  const resetAllStats = () => {
    setImpressionsA(0);
    setClicksA(0);
    setProbabilityA(0);
    setImpressionsB(0);
    setClicksB(0);
    setProbabilityB(0);
  };

  // Helper function to simulate a click based on parameters
  const simulateClick = (variation, params) => {
    // Start with base click rate
    let clickProbability = params.baseClickRate;
    let multiplier = 1.0;

    // Apply each effect based on probability
    // Color effect (assuming variation B is red)
    if (variation === 'B' && Math.random() < params.colorPreference) {
      multiplier *= 1 + params.colorImpact;
    }

    // Apply other effects similar to ButtonForm logic
    // ...simplified for performance...

    // Apply multiplier
    clickProbability *= multiplier;

    // Determine if click happens
    return Math.random() < clickProbability;
  };

  // Helper function to calculate click probability based on parameters
  const calculateClickProbability = (variation, params) => {
    // Start with base click rate
    let clickProbability = params.baseClickRate;
    let multiplier = 1.0;

    // Apply each effect based on probability
    // Color effect (assuming variation B is red)
    if (variation === 'B' && Math.random() < params.colorPreference) {
      multiplier *= 1 + params.colorImpact;
    }

    // Apply other effects similar to ButtonForm logic
    // Apply multiplier
    clickProbability *= multiplier;

    return clickProbability;
  };

  // Simulate multiple steps at once for turbo mode - IMPROVED VERSION
  const simulateTurboMode = useCallback(() => {
    if (!isRunning || !params.turboMode) return;

    // Stop normal simulation and mark chunked operation as running
    setIsRunning(false);
    setIsChunkedOperationRunning(true);
    setTurboProgress(1); // Set initial progress

    // Get current state for processing
    let currentImpressions = { a: impressionsA, b: impressionsB };
    let currentClicks = { a: clicksA, b: clicksB };
    const halfPopulation = requiredPopulationSize / 2;

    // Calculate how many iterations we need
    const totalIterationsNeeded =
      requiredPopulationSize - (impressionsA + impressionsB);

    // Create a function that processes one chunk of the simulation
    const processChunk = (processedSoFar, resolve) => {
      // Determine chunk size
      const chunkSize = Math.min(
        params.turboChunkSize,
        totalIterationsNeeded - processedSoFar
      );

      // Process this chunk
      for (let i = 0; i < chunkSize; i++) {
        // Assign to variation and compute clicks
        const assignToA =
          (Math.random() < 0.5 && currentImpressions.a < halfPopulation) ||
          currentImpressions.b >= halfPopulation;

        if (assignToA) {
          currentImpressions.a++;

          // Simulate click based on params
          if (simulateClick('A', params)) {
            currentClicks.a++;
          }
        } else {
          currentImpressions.b++;

          // Simulate click based on params
          if (simulateClick('B', params)) {
            currentClicks.b++;
          }
        }

        // Check if we've reached the target population
        if (
          currentImpressions.a >= halfPopulation &&
          currentImpressions.b >= halfPopulation
        ) {
          break;
        }
      }

      // Calculate progress as a percentage
      const totalProcessed = processedSoFar + chunkSize;
      const progress = Math.floor(
        (totalProcessed / totalIterationsNeeded) * 100
      );
      setTurboProgress(progress);

      // If we've processed everything or reached population target
      if (
        totalProcessed >= totalIterationsNeeded ||
        (currentImpressions.a >= halfPopulation &&
          currentImpressions.b >= halfPopulation)
      ) {
        // Update state with final values
        setImpressionsA(currentImpressions.a);
        setClicksA(currentClicks.a);
        setImpressionsB(currentImpressions.b);
        setClicksB(currentClicks.b);

        // Calculate and update probabilities
        const probA = calculateClickProbability('A', params);
        const probB = calculateClickProbability('B', params);
        setProbabilityA(probA);
        setProbabilityB(probB);

        // Complete operation
        setTurboProgress(100);
        setIsChunkedOperationRunning(false);

        // Resolve the promise to indicate completion
        resolve();
      } else {
        // Schedule next chunk with a small delay to allow UI updates
        setTimeout(() => {
          processChunk(totalProcessed, resolve);
        }, params.turboPauseMs);
      }
    };

    // Create a promise to track completion
    new Promise((resolve) => {
      processChunk(0, resolve);
    }).then(() => {
      // When all chunks are done
      console.log('Turbo simulation completed');
    });
  }, [
    isRunning,
    params,
    requiredPopulationSize,
    impressionsA,
    impressionsB,
    clicksA,
    clicksB,
    setIsRunning,
    setTurboProgress,
    setIsChunkedOperationRunning,
  ]);

  // Function to simulate test click for calculating probability
  const simulateTestClick = (variation, params) => {
    // Use the more accurate calculation function
    return calculateClickProbability(variation, params);
  };

  // Effect to start turbo mode when enabled
  useEffect(() => {
    if (
      isRunning &&
      params.turboMode &&
      !turboProgress &&
      !isChunkedOperationRunning
    ) {
      simulateTurboMode();
    }
  }, [
    isRunning,
    params.turboMode,
    simulateTurboMode,
    turboProgress,
    isChunkedOperationRunning,
  ]);

  // Regular simulation effect (only runs if not in turbo mode or turbo is complete)
  useEffect(() => {
    if (
      !isRunning ||
      (params.turboMode && turboProgress > 0 && turboProgress < 100) ||
      isChunkedOperationRunning
    )
      return;

    // Calculate whether we've reached the target sample size
    const halfPopulation = requiredPopulationSize / 2;
    const sampleReached =
      impressionsA >= halfPopulation && impressionsB >= halfPopulation;

    // Automatically stop the simulation if sample size is reached
    if (sampleReached) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      // Process a batch of users at once for high FPS settings
      for (let i = 0; i < processBatchSize; i++) {
        // Randomly assign a user to either variation A or B
        if (Math.random() < 0.5) {
          // Assign to variation A but check if we're at capacity first
          if (impressionsA < halfPopulation) {
            setImpressionsA((prev) => prev + 1);
          } else {
            // If A is full, assign to B
            setImpressionsB((prev) => prev + 1);
          }
        } else {
          // Assign to variation B but check if we're at capacity first
          if (impressionsB < halfPopulation) {
            setImpressionsB((prev) => prev + 1);
          } else {
            // If B is full, assign to A
            setImpressionsA((prev) => prev + 1);
          }
        }
      }
    }, 1000 / (params.fps / processBatchSize));

    return () => clearInterval(interval);
  }, [
    isRunning,
    params.fps,
    processBatchSize,
    requiredPopulationSize,
    impressionsA,
    impressionsB,
    setIsRunning,
    params.turboMode,
    turboProgress,
    isChunkedOperationRunning,
  ]);

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
            totalPopulation={requiredPopulationSize}
            otherVariationData={variationB} // Pass variation B data for lift comparison
          />
          <ButtonForm
            name="(Variation A)"
            primaryColor="blue"
            impressions={impressionsA}
            onClick={(count = 1) => setClicksA((prev) => prev + count)}
            onProbabilityChange={setProbabilityA}
          />
        </div>
        <div className="variation-container">
          <Results
            name="(Variation B)"
            impressions={impressionsB}
            clicks={clicksB}
            currentClickProbability={probabilityB}
            totalPopulation={requiredPopulationSize}
            otherVariationData={variationA} // Pass variation A data for lift comparison
          />
          <ButtonForm
            name="(Variation B)"
            primaryColor="red"
            impressions={impressionsB}
            onClick={(count = 1) => setClicksB((prev) => prev + count)}
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
