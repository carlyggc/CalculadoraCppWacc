import React, { useState } from 'react';
import CPPCalculator from './components/CPPCalculator';
import WACCCalculator from './components/WACCCalculator';
import './App.css';

function App() {
  const [modo, setModo] = useState('cpp');

  return (
    <div className="App">
      <h1>Calculadora de Costo Promedio Ponderado</h1>
      <div>
        <label htmlFor="selector">Selecciona el modo:</label>
        <select id="selector" onChange={(e) => setModo(e.target.value)} value={modo}>
          <option value="cpp">Costo Promedio Ponderado (CPP)</option>
          <option value="wacc">WACC (múltiples deudas)</option>
        </select>
      </div>

      {modo === 'cpp' && <CPPCalculator />}
      {modo === 'wacc' && <WACCCalculator />}
    </div>
  );
}

export default App;