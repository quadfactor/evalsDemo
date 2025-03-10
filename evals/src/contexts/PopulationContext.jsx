import { createContext, useState } from 'react';

export const PopulationContext = createContext();

export function PopulationProvider({ children }) {
  const [params, setParams] = useState({
    baseClickRate: 0.3,
    colorPreference: 0.3, // Percentage of users who prefer red color
    colorImpact: 0.2,
    centerPreference: 0.4,
    centerImpact: 0.15,
    spellingPreference: 0.6,
    spellingImpact: 0.25,
  });

  return (
    <PopulationContext.Provider value={{ params, setParams }}>
      {children}
    </PopulationContext.Provider>
  );
}
