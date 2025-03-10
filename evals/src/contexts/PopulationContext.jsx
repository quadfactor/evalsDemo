import { createContext, useState } from 'react';

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
  });

  const [isRunning, setIsRunning] = useState(true);

  return (
    <PopulationContext.Provider
      value={{ params, setParams, isRunning, setIsRunning }}
    >
      {children}
    </PopulationContext.Provider>
  );
}
