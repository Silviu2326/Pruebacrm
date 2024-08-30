// HorarioSemanal.js
import React, { useState, useEffect } from 'react';
import './HorasDisponibles.css';

const HorarioSemanal = ({ horariosValidos, eventType }) => {
  const horas = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);
  const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  const [selecciones, setSelecciones] = useState({});
  const [modoSeleccion, setModoSeleccion] = useState('valido');

  useEffect(() => {
    // Cargar las selecciones guardadas desde el localStorage al montar el componente
    const storedSelecciones = localStorage.getItem('horarioSemanal');
    if (storedSelecciones) {
      setSelecciones(JSON.parse(storedSelecciones));
    }

    if (horariosValidos.length > 0 && eventType) {
      const seleccionesIniciales = {};

      horariosValidos.forEach((horario) => {
        if (horario.eventType.toLowerCase() === eventType.toLowerCase()) {
          horario.horariosSemanales.forEach((hs) => {
            const dia = hs.dia.toLowerCase();

            hs.horas.forEach((h) => {
              const horaInicio = parseInt(h.horaInicio.split(':')[0], 10);
              const horaFin = parseInt(h.horaFin.split(':')[0], 10);

              for (let hora = horaInicio; hora < horaFin; hora++) {
                const key = `${dia}-${hora}:00 - ${hora + 1}:00`;
                seleccionesIniciales[key] = h.valido ? 'valido' : 'no-valido';
              }
            });
          });
        }
      });

      setSelecciones(seleccionesIniciales);
    }
  }, [horariosValidos, eventType]);

  const handleCellClick = (dia, hora) => {
    const key = `${dia}-${hora}`;
    setSelecciones(prevSelecciones => {
      const newState = {
        ...prevSelecciones,
        [key]: prevSelecciones[key] === modoSeleccion ? null : modoSeleccion,
      };
      return newState;
    });
  };

  const handleModoSeleccionChange = (modo) => {
    setModoSeleccion(modo);
  };

  const handleGuardarYSalir = () => {
    // Guardar las selecciones en localStorage
    localStorage.setItem('horarioSemanal', JSON.stringify(selecciones));
    alert('Horario guardado exitosamente.');
  };

  return (
    <div>
      <div className="botones-seleccion">
        <button
          className={`boton-seleccion ${modoSeleccion === 'valido' ? 'activo' : ''}`}
          onClick={() => handleModoSeleccionChange('valido')}
        >
          Marcar como Válido (Verde)
        </button>
        <button
          className={`boton-seleccion ${modoSeleccion === 'no-valido' ? 'activo' : ''}`}
          onClick={() => handleModoSeleccionChange('no-valido')}
        >
          Marcar como No Válido (Rojo)
        </button>
      </div>
      <div className="horario-semanal-container">
        <div className="horas-column">
          {horas.map(hora => (
            <div key={hora}>{hora}</div>
          ))}
        </div>
        {dias.map((dia) => (
          <div key={dia} className="horario-dia">
            <div className="horas-disponibles-dia">{dia}</div>
            {horas.map((hora) => {
              const key = `${dia}-${hora}`;
              const estado = selecciones[key] || '';  // Si no hay estado, asigna una cadena vacía.
              return (
                <div
                  key={hora}
                  className={`horas-disponibles-hora ${estado}`}
                  onClick={() => handleCellClick(dia, hora)}
                >
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleGuardarYSalir} className="guardar-horario-button">
        Guardar y Salir
      </button>
    </div>
  );
};

export default HorarioSemanal;
