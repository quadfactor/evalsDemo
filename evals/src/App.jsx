import ButtonForm from './components/ButtonForm';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="forms-container">
        <ButtonForm name="(Variation A)" />
        <ButtonForm name="(Variation B)" />
      </div>
    </div>
  );
}

export default App;
