import React, { useState } from 'react';
import { Ruler, Scale, Target } from 'lucide-react';  // Importamos los iconos de Lucide
import './EsqueletoClienteCuestionario.css'; // Estilos personalizados

const EsqueletoClienteCuestionario = ({ onComplete }) => {
  // Estados para almacenar los datos del cliente
  const [heightRange, setHeightRange] = useState({ min: 150, max: 200 });
  const [weightRange, setWeightRange] = useState({ min: 50, max: 100 });
  const [goal, setGoal] = useState('');
  const [error, setError] = useState(null);

  // Función para manejar la validación y enviar los datos
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!goal) {
      setError('Por favor, seleccione un objetivo.');
      return;
    }

    // Enviar los datos del cliente al componente padre
    onComplete({
      heightRange,
      weightRange,
      goal,
    });
  };

  return (
    <div className="esqueletoclientecuestionario-container">
      <h2 className="esqueletoclientecuestionario-title">Información del Cliente</h2>
      <form onSubmit={handleSubmit}>

        {/* Rango de Altura */}
        <div className="esqueletoclientecuestionario-form-group">
          <label className="esqueletoclientecuestionario-label">
            <Ruler className="esqueletoclientecuestionario-icon" size={24} /> Rango de Altura (cm)
          </label>
          <div className="esqueletoclientecuestionario-range-inputs">
            <input
              type="number"
              value={heightRange.min}
              onChange={(e) => setHeightRange({ ...heightRange, min: e.target.value })}
              min="100"
              max="250"
              placeholder="150"
            />
            <input
              type="number"
              value={heightRange.max}
              onChange={(e) => setHeightRange({ ...heightRange, max: e.target.value })}
              min="100"
              max="250"
              placeholder="200"
            />
          </div>
        </div>

        {/* Rango de Peso */}
        <div className="esqueletoclientecuestionario-form-group">
          <label className="esqueletoclientecuestionario-label">
            <Scale className="esqueletoclientecuestionario-icon" size={24} /> Rango de Peso (kg)
          </label>
          <div className="esqueletoclientecuestionario-range-inputs">
            <input
              type="number"
              value={weightRange.min}
              onChange={(e) => setWeightRange({ ...weightRange, min: e.target.value })}
              min="30"
              max="200"
              placeholder="50"
            />
            <input
              type="number"
              value={weightRange.max}
              onChange={(e) => setWeightRange({ ...weightRange, max: e.target.value })}
              min="30"
              max="200"
              placeholder="100"
            />
          </div>
        </div>

        {/* Objetivo */}
        <div className="esqueletoclientecuestionario-form-group">
          <label className="esqueletoclientecuestionario-label">
            <Target className="esqueletoclientecuestionario-icon" size={24} /> Objetivo
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione un objetivo</option>
            <option value="cardio">Cardio</option>
            <option value="fuerza">Fuerza</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="resistencia">Resistencia</option>
            <option value="movilidad">Movilidad</option>
            <option value="coordinacion">Coordinación</option>
            <option value="definicion">Definición</option>
            <option value="recomposicion">Recomposición</option>
            <option value="rehabilitacion">Rehabilitación</option>
            <option value="otra">Otra</option>
          </select>
        </div>

        {/* Error de validación */}
        {error && <p className="esqueletoclientecuestionario-error-message">{error}</p>}

        {/* Botón de Siguiente */}
        <button type="submit" className="esqueletoclientecuestionario-submit-button">Siguiente</button>
      </form>
    </div>
  );
};

export default EsqueletoClienteCuestionario;
