import React, { useState } from 'react';

export default function WACCCalculator() {
  const [deudas, setDeudas] = useState([{ monto: '', tasa: '' }]);
  const [capitalPropio, setCapitalPropio] = useState('');
  const [tasaPropia, setTasaPropia] = useState('');
  const [impuesto, setImpuesto] = useState('');
  const [resultado, setResultado] = useState('');
  const [proceso, setProceso] = useState('');
  const [formula, setFormula] = useState('');

  const handleChangeDeuda = (index, e) => {
    const newDeudas = [...deudas];
    newDeudas[index][e.target.name] = e.target.value;
    setDeudas(newDeudas);
  };

  const addDeuda = () => setDeudas([...deudas, { monto: '', tasa: '' }]);

  const calcular = () => {
    const E = parseFloat(capitalPropio);
    const Re = parseFloat(tasaPropia);
    const T = parseFloat(impuesto);

    if ([E, Re, T].some(isNaN)) {
      setResultado('Completa todos los campos del capital y tasa impositiva.');
      return;
    }

    let D_total = 0;
    let contribDeudas = [];
    let nombresDeudas = [];
    let valoresDeudas = [];
    let contribuciones = [];

    deudas.forEach((d, i) => {
      const D = parseFloat(d.monto);
      const Rd = parseFloat(d.tasa);
      if (!isNaN(D) && !isNaN(Rd)) {
        const nombre = `Deuda ${String.fromCharCode(65 + i)}`;
        nombresDeudas.push(nombre);
        valoresDeudas.push(D);
        contribuciones.push(`${nombre}: ${D} × ${Rd}% = ${(D * (Rd / 100)).toFixed(2)}`);
        D_total += D;
        contribDeudas.push({ D, Rd });
      }
    });

    if (contribDeudas.length === 0) {
      setResultado('Agrega al menos una deuda válida.');
      return;
    }

    const V = E + D_total;
    let wacc = (E / V) * (Re / 100);

    // Mostrar proceso paso a paso
    let procesoHTML = '<strong>Proceso:</strong><ul>';
    procesoHTML += `<li>Suma de montos: `;
    for (let i = 0; i < nombresDeudas.length; i++) {
      procesoHTML += `${nombresDeudas[i]} = $${valoresDeudas[i].toFixed(2)}${i < nombresDeudas.length - 1 ? ', ' : ''}`;
    }
    procesoHTML += ` → Total Deudas = $${D_total.toFixed(2)}</li>`;
    procesoHTML += `<li>Capital propio: $${E.toFixed(2)}</li>`;
    procesoHTML += '</ul>';

    contribuciones.forEach(c => procesoHTML += `<li>${c}</li>`);
    procesoHTML += '</ul>';
    setProceso(procesoHTML);

    // Fórmula reemplazada
    let formulaHTML = '<h3>Fórmula utilizada</h3>';
    formulaHTML += '<p><em>WACC = (E/V × Re) + Σ[(D/V × Rd × (1 - T))]</em></p>';
    formulaHTML += '<p><strong>Reemplazando:</strong><br />';
    formulaHTML += `E = Capital propio = $${E.toFixed(2)}<br />`;
    formulaHTML += `V = E + D = $${V.toFixed(2)}<br />`;
    formulaHTML += `Re = Tasa del capital propio = ${Re}%<br />`;
    formulaHTML += `T = Tasa impositiva = ${T}%<br />`;
    formulaHTML += `Σ(D/V × Rd × (1 - T)) = ${contribDeudas.map(({ D, Rd }) => {
      const peso = D / V;
      const costoDespuesImpuesto = Rd / 100 * (1 - T / 100);
      return `${peso.toFixed(2)} × ${Rd}% × (1 - ${T}%) = ${(peso * Rd / 100 * (1 - T / 100)).toFixed(2)}`;
    }).join(" + ")}<br />`;
    formulaHTML += `WACC = (${(E / V * Re).toFixed(2)} + ${contribDeudas.reduce((acc, { D, Rd }) => {
      const peso = D / V;
      const costoDespuesImpuesto = Rd / 100 * (1 - T / 100);
      return acc + (peso * Rd / 100 * (1 - T / 100));
    }, 0).toFixed(2)}) = ${(wacc * 100).toFixed(2)}%</p>`;
    setFormula(formulaHTML);

    // Calcular WACC
    contribDeudas.forEach(({ D, Rd }) => {
      const peso = D / V;
      const costoDespuesImpuesto = Rd / 100 * (1 - T / 100);
      wacc += peso * costoDespuesImpuesto;
    });

    setResultado(`WACC: ${(wacc * 100).toFixed(2)}%`);
  };

  return (
    <div>
      <h2>WACC (con múltiples deudas)</h2>
      <div className="fuente">
        <label>Capital propio ($)</label>
        <input type="number" value={capitalPropio} onChange={(e) => setCapitalPropio(e.target.value)} />
      </div>
      <div className="fuente">
        <label>Tasa del capital propio (%)</label>
        <input type="number" value={tasaPropia} onChange={(e) => setTasaPropia(e.target.value)} />
      </div>
      {deudas.map((d, i) => (
        <div key={i} className="fuente">
          <label>Deuda {i + 1}</label>
          <input type="number" name="monto" value={d.monto} onChange={(e) => handleChangeDeuda(i, e)} placeholder="Monto" />
          <input type="number" name="tasa" value={d.tasa} onChange={(e) => handleChangeDeuda(i, e)} placeholder="Tasa %" />
        </div>
      ))}
      <button onClick={addDeuda}>+ Agregar Deuda</button>
      <div className="fuente">
        <label>Tasa impositiva (%)</label>
        <input type="number" value={impuesto} onChange={(e) => setImpuesto(e.target.value)} />
      </div>
      <button onClick={calcular}>Calcular</button>

      {/* Mostrar Proceso */}
      proceso && <div className="resultado" dangerouslySetInnerHTML={{ __html: proceso }} />

      {/* Mostrar Fórmula */}
      formula && <div className="resultado" dangerouslySetInnerHTML={{ __html: formula }} />

      {/* Mostrar Resultado final */}
      {resultado && <div className="resultado"><h2>{resultado}</h2></div>}
    </div>
  );
}