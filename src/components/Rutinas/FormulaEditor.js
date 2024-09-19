import React, { useState } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';

const FormulaEditor = ({ variables, functions, operators }) => {
  const [formula, setFormula] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const value = event.target.value;
    setFormula(value);
    validateFormula(value);
  };

  const validateFormula = (formula) => {
    try {
      // Reemplaza las variables por números temporales para validar la fórmula
      const replacedFormula = formula.replace(/Var\d+/g, '1');
      // Evalúa la fórmula para detectar errores de sintaxis
      new Function(`return ${replacedFormula}`)();
      setError(null); // Sin errores
    } catch (err) {
      setError('Error en la fórmula: ' + err.message);
    }
  };

  const insertText = (text) => {
    setFormula((prev) => prev + text);
    validateFormula(formula + text);
  };

  return (
    <div className="formula-editor-container">
      <h3 className="tab-section-title">Fórmula</h3>
      
      <div className="toolbar">
        <span>Barra de Herramientas:</span>
        {operators.map((op, index) => (
          <button
            key={index}
            className="toolbar-button"
            onClick={() => insertText(op)}
          >
            {op}
          </button>
        ))}
        {functions.map((func, index) => (
          <button
            key={index}
            className="toolbar-button"
            onClick={() => insertText(`${func}()`)}
          >
            {func}
          </button>
        ))}
      </div>

      <div className="variables-list">
        <span>Variables Disponibles:</span>
        {variables.map((variable, index) => (
          <button
            key={index}
            className="variable-button"
            onClick={() => insertText(variable)}
          >
            {variable}
          </button>
        ))}
      </div>

      <textarea
        className="formula-editor-textarea"
        value={formula}
        onChange={handleChange}
        placeholder="Escribe tu fórmula aquí..."
      ></textarea>

      {error && <div className="error-message">{error}</div>}

      <button className="add-condition-button">
        Añadir Condición
      </button>

      <div className="preview">
        <h3>Previsualización de Fórmula:</h3>
        <p>{formula}</p>
      </div>
    </div>
  );
};

export default FormulaEditor;
