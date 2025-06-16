import React, { useState } from 'react';

export default function CPPCalculator() {
  const [fuentes, setFuentes] = useState([{ monto: '', tasa: '' }]);
  const [resultado, setResultado] = useState('');
  const [proceso, setProceso] = useState('');
  const [formula, setFormula] = useState('');

  const handleChange = (index, e) => {
    const newFuentes = [...fuentes];
    newFuentes[index][e.target.name] = e.target.value;
    setFuentes(newFuentes);
  };

  const agregarFuente = () => {
    setFuentes([...fuentes, { monto: '', tasa: '' }]);
  };

  const calcular = () => {
    let totalMonto = 0;
    let totalContrib = 0;
    let nombresMontos = [];
    let valoresMontos = [];
    let contribuciones = [];

    fuentes.forEach((f, i) => {
      const monto = parseFloat(f.monto);
      const tasa = parseFloat(f.tasa);

      if (!isNaN(monto) && !isNaN(tasa)) {
        const contrib = monto * (tasa / 100);
        const nombre = `Monto ${String.fromCharCode(65 + i)}`;
        nombresMontos.push(nombre);
        valoresMontos.push(monto);
        contribuciones.push(`${nombre}: ${monto} × ${tasa}% = ${contrib.toFixed(2)}`);
        totalMonto += monto;
        totalContrib += contrib;
      }
    });

    // Limpiar resultados anteriores
    setResultado('');
    setProceso('');
    setFormula('');

    if (totalMonto <= 0 || contribuciones.length === 0) {
      setResultado('Introduce al menos un monto y una tasa válidos.');
      return;
    }

    // Mostrar proceso paso a paso
    let procesoHTML = '<strong>Proceso:</strong><ul>';
    procesoHTML += `<li>Suma de montos: `;
    for (let i = 0; i < nombresMontos.length; i++) {
      procesoHTML += `${nombresMontos[i]} = $${valoresMontos[i].toFixed(2)}${i < nombresMontos.length - 1 ? ', ' : ''}`;
    }
    procesoHTML += ` → Total = $${totalMonto.toFixed(2)}</li>`;

    contribuciones.forEach(c => procesoHTML += `<li>${c}</li>`);
    procesoHTML += '</ul>';
    setProceso(procesoHTML);

    // Fórmula reemplazada
    let formulaHTML = '<h3>Fórmula utilizada</h3>';
    formulaHTML += '<p><em>CPP = Σ(montoᵢ × tasaᵢ) / Σ(montoᵢ)</em></p>';
    formulaHTML += '<p><strong>Reemplazando:</strong><br />';
    formulaHTML += `Σ(montoᵢ × tasaᵢ) = ${contribuciones.map(c => c.split(" = ")[1]).join(" + ")} = ${totalContrib.toFixed(2)}<br />`;
    formulaHTML += `Σ(montoᵢ) = ${nombresMontos.join(" + ")} = ${totalMonto.toFixed(2)}<br />`;
    formulaHTML += `CPP = ${totalContrib.toFixed(2)} / ${totalMonto.toFixed(2)} = ${(totalContrib / totalMonto * 100).toFixed(2)}%</p>`;
    setFormula(formulaHTML);

    // Resultado final
    setResultado(`Costo Promedio Ponderado: ${(totalContrib / totalMonto * 100).toFixed(2)}%`);
  };

  return (
    <div>
      <h2>Calculadora de Costo Promedio Ponderado</h2>

      {fuentes.map((f, i) => (
        <div key={i} className="fuente">
          <label>Monto {String.fromCharCode(65 + i)}</label>
          <input
            type="number"
            name="monto"
            value={f.monto}
            onChange={(e) => handleChange(i, e)}
            placeholder="Monto"
          />
          <input
            type="number"
            name="tasa"
            value={f.tasa}
            onChange={(e) => handleChange(i, e)}
            placeholder="Tasa %"
          />
        </div>
      ))}

      <button onClick={agregarFuente}>+ Agregar Fuente</button>
      <button onClick={calcular}>Calcular</button>

      {/* Mostrar Proceso */}
      <div className="resultado" dangerouslySetInnerHTML={{ __html: proceso }} />

      {/* Mostrar Fórmula */}
      <div className="resultado" dangerouslySetInnerHTML={{ __html: formula }} />

      {/* Mostrar Resultado final */}
      {resultado && <div className="resultado"><h2>{resultado}</h2></div>}
    </div>
  );
}