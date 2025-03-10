import ButtonForm from './components/ButtonForm';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>A/B Testing Simulator</h1>
      <p className="description">
        Simulate how different button characteristics affect click rates. Set
        population parameters and observe how users interact with different
        variations.
      </p>
      <div className="forms-container">
        <ButtonForm name="(Variation A)" primaryColor="blue" />
        <ButtonForm name="(Variation B)" primaryColor="red" />
      </div>
    </div>
  );
}

export default App;
