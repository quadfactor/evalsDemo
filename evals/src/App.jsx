import ButtonForm from './components/ButtonForm';
import PopulationSettings from './components/PopulationSettings';
import { PopulationProvider } from './contexts/PopulationContext';
import './App.css';

function App() {
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
          <ButtonForm name="(Variation A)" primaryColor="blue" />
          <ButtonForm name="(Variation B)" primaryColor="red" />
        </div>
      </div>
    </PopulationProvider>
  );
}

export default App;
