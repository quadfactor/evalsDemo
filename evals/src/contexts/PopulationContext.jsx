import { createContext, useState, useCallback, useMemo } from 'react';

export const PopulationContext = createContext();

export function PopulationProvider({ children }) {
  const [params, setParams] = useState({
    baseClickRate: 0.3,
    colorPreference: 0.3,
    colorImpact: 0,
    centerPreference: 0.4,
    centerImpact: 0,
    spellingPreference: 0.6,
    spellingImpact: 0,
    confidenceLevel: 0.95,
    minimumDetectableEffect: 0.1,
    fps: 5, // Changed default from 3 to 5
    turboMode: false,
    turboSpeedMultiplier: 100, // Fixed at 100x speed
  });

  // Add state to track if sample size has been reached
  const [sampleSizeReached, setSampleSizeReached] = useState(false);
  // Add state to track total impressions
  const [totalImpressions, setTotalImpressions] = useState(0);

  // Calculate required population size automatically
  const requiredPopulationSize = useMemo(() => {
    // Statistical formula for sample size calculation
    // n = (Z²×p×(1-p))/e²
    // where Z is Z-score for confidence level, p is baseline conversion rate, e is margin of error

    // Z-scores for common confidence levels
    const zScores = {
      0.8: 1.28,
      0.85: 1.44,
      0.9: 1.65,
      0.95: 1.96,
      0.99: 2.58,
    };

    const z = zScores[params.confidenceLevel] || 1.96; // Default to 95% confidence
    const p = params.baseClickRate; // Baseline conversion rate
    const mde = params.minimumDetectableEffect; // Minimum detectable effect

    // Calculate sample size per variation
    const sampleSizePerVariation = Math.ceil(
      (Math.pow(z, 2) * p * (1 - p) * 2) / Math.pow(p * mde, 2)
    );

    // Total population size (2 variations)
    return sampleSizePerVariation * 2;
  }, [
    params.confidenceLevel,
    params.baseClickRate,
    params.minimumDetectableEffect,
  ]);

  // Optimize parameter updates to reduce re-renders
  const setParamsOptimized = useCallback((updater) => {
    setParams(updater);
  }, []);

  const [isRunning, setIsRunning] = useState(false);
  const [turboProgress, setTurboProgress] = useState(0); // Track progress in turbo mode

  // Function to update total impressions
  const updateTotalImpressions = useCallback(
    (newTotal) => {
      setTotalImpressions(newTotal);

      // Check if sample size has been reached
      if (newTotal >= requiredPopulationSize) {
        setSampleSizeReached(true);
        // Automatically stop simulation when sample size is reached
        setIsRunning(false);
        // Turn off turbo mode when sample size is reached
        if (params.turboMode) {
          setParams((prev) => ({ ...prev, turboMode: false }));
        }
      }
    },
    [requiredPopulationSize, params.turboMode]
  );

  // Function to reset sample complete flag
  const resetSampleComplete = useCallback(() => {
    setSampleSizeReached(false);
    setTotalImpressions(0);
  }, []);

  return (
    <PopulationContext.Provider
      value={{
        params,
        setParams: setParamsOptimized,
        isRunning,
        setIsRunning,
        requiredPopulationSize,
        turboProgress,
        setTurboProgress,
        totalImpressions,
        updateTotalImpressions,
        sampleSizeReached,
        resetSampleComplete,
      }}
    >
      {children}
    </PopulationContext.Provider>
  );
}
