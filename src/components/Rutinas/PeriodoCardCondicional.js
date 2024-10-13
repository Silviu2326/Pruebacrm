import React, { useState } from 'react';

const PeriodoCardCondicional = ({ exercise, onApply, onCancel }) => {
  const [isConditional, setIsConditional] = useState(exercise.conditional);

  const handleApply = () => {
    onApply({ ...exercise, conditional: isConditional });
  };

  return (
    <div className="PeriodoCard-condicional-container">
      <h3 className="PeriodoCard-condicional-title">Configurar Condición</h3>
      <div className="PeriodoCard-condicional-form">
        <label>¿Condicional?</label>
        <input
          type="checkbox"
          checked={isConditional}
          onChange={() => setIsConditional(!isConditional)}
          className="PeriodoCard-condicional-checkbox"
        />

        <div className="PeriodoCard-condicional-buttons">
          <button onClick={handleApply} className="PeriodoCard-condicional-apply">Aplicar</button>
          <button onClick={onCancel} className="PeriodoCard-condicional-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default PeriodoCardCondicional;
