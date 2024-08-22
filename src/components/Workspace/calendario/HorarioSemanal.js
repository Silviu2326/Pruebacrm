import React, { useState } from 'react';

const diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HorarioSemanal = ({ onHorarioChange }) => {
  const [horarios, setHorarios] = useState({
    Lunes: { inicio: '', fin: '' },
    Martes: { inicio: '', fin: '' },
    Miércoles: { inicio: '', fin: '' },
    Jueves: { inicio: '', fin: '' },
    Viernes: { inicio: '', fin: '' },
    Sábado: { inicio: '', fin: '' },
    Domingo: { inicio: '', fin: '' },
  });

  const handleHorarioChange = (dia, tipo, value) => {
    const nuevosHorarios = {
      ...horarios,
      [dia]: {
        ...horarios[dia],
        [tipo]: value,
      },
    };
    setHorarios(nuevosHorarios);
    onHorarioChange(nuevosHorarios);  // Actualizar el estado en el componente padre
  };

  const copiarHorario = (fromDia, toDia) => {
    const nuevosHorarios = {
      ...horarios,
      [toDia]: { ...horarios[fromDia] },
    };
    setHorarios(nuevosHorarios);
    onHorarioChange(nuevosHorarios);  // Actualizar el estado en el componente padre
  };

  const aplicarMismoHorarioATodos = (dia) => {
    const nuevoHorario = { ...horarios[dia] };
    const nuevosHorarios = diasDeLaSemana.reduce((acc, d) => {
      acc[d] = nuevoHorario;
      return acc;
    }, {});
    setHorarios(nuevosHorarios);
    onHorarioChange(nuevosHorarios);  // Actualizar el estado en el componente padre
  };

  return (
    <div className="horario-semanal-container">
      {diasDeLaSemana.map((dia) => (
        <div key={dia} className="horario-dia">
          <h3>{dia}</h3>
          <label>
            Hora de Inicio:
            <input
              type="time"
              value={horarios[dia].inicio}
              onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
            />
          </label>
          <label>
            Hora de Fin:
            <input
              type="time"
              value={horarios[dia].fin}
              onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
            />
          </label>
          <button onClick={() => aplicarMismoHorarioATodos(dia)}>Aplicar a Todos</button>
          <select onChange={(e) => copiarHorario(dia, e.target.value)}>
            <option value="">Copiar a...</option>
            {diasDeLaSemana.filter(d => d !== dia).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default HorarioSemanal;
