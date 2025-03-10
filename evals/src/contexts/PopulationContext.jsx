import { createContext, useState, useCallback } from 'react';

export const PopulationContext = createContext();

export function PopulationProvider({ children }) {
  const [params, setParams] = useState({
    baseClickRate: 0.3,
    colorPreference: 0.3, // Percentage of users who prefer red color
    colorImpact: 0, // Can be negative or positive
    centerPreference: 0.4,
    centerImpact: 0, // Can be negative or positive
    spellingPreference: 0.6,
    spellingImpact: 0, // Can be negative or positive
    populationSize: 10000, // Default population size
    fps: 3, // Global FPS setting
    performanceMode: true, // New parameter to control optimization
  });

  // Optimize parameter updates to reduce re-renders
  const setParamsOptimized = useCallback((updater) => {
    setParams(updater);
  }, []);

  const [isRunning, setIsRunning] = useState(true);

  return (
    <PopulationContext.Provider
      value={{ params, setParams: setParamsOptimized, isRunning, setIsRunning }}
    >
      {children}
    </PopulationContext.Provider>
  );
}
