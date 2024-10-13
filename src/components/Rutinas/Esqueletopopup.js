import React, { useState } from 'react';
import { Ruler } from 'lucide-react';  // Importamos el icono de regla de Lucide
import './Esqueletopopup.css';
import ReglasDeVariables from './ReglasDeVariables'; // Importamos el componente de reglas
import Mapadeperiodos from './Mapadeperiodos'; // Importamos el componente de mapa de periodos
import Chatesqueleto from './Chatesqueleto'; // Importamos el nuevo componente del chat
import EsqueletoClienteCuestionario from './EsqueletoClienteCuestionario'; // Importamos el nuevo componente de cuestionario

const Esqueletopopup = ({ show, onClose, theme }) => {
  const [periods, setPeriods] = useState([
    {
      week: 'Semana 1',
      days: Array(7).fill(false), // Inicialmente, ningún día está seleccionado
    },
    {
      week: 'Semana 2',
      days: Array(7).fill(false),
    },
  ]);
  
  const [selectedPeriod, setSelectedPeriod] = useState({ start: null, end: null });
  const [addedPeriods, setAddedPeriods] = useState([]); // Periodos añadidos
  const [showRules, setShowRules] = useState(false); // Estado para mostrar las reglas de variables
  const [showPeriodMap, setShowPeriodMap] = useState(false); // Estado para mostrar el mapa de periodos
  const [showChat, setShowChat] = useState(false); // Estado para mostrar el chat
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false); // Nuevo estado para el cuestionario
  const [clientInfo, setClientInfo] = useState(null); // Guardar la información del cliente

  // Lista de colores predefinidos para los periodos
  const periodColors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A2', '#33FFF3'];

  // Función para obtener el color de un periodo basado en su índice
  const getPeriodColor = (index) => periodColors[index % periodColors.length]; // Ciclar colores si se excede el número de colores

  // Función para añadir más semanas a la tabla
  const handleAddWeeks = () => {
    const newPeriods = [...periods];
    const weeksToAdd = 2; // Añadimos 2 semanas como ejemplo
    for (let i = 0; i < weeksToAdd; i++) {
      newPeriods.push({
        week: `Semana ${newPeriods.length + 1}`,
        days: Array(7).fill(false), // Inicialmente, ningún día está seleccionado
      });
    }
    setPeriods(newPeriods);
  };

  // Función para asegurar que tenemos suficientes semanas
  const ensureWeeks = (minWeeks) => {
    if (periods.length >= minWeeks) return;
    const newPeriods = [...periods];
    for (let i = periods.length; i < minWeeks; i++) {
      newPeriods.push({
        week: `Semana ${i + 1}`,
        days: Array(7).fill(false),
      });
    }
    setPeriods(newPeriods);
  };

  // Función para manejar la selección de días
  const handleDaySelect = (weekIndex, dayIndex) => {
    // Evitamos seleccionar días que ya están en periodos añadidos
    if (isDayInAddedPeriods(weekIndex, dayIndex)) return;

    if (selectedPeriod.start === null) {
      // Seleccionar día de inicio
      setSelectedPeriod({ start: { weekIndex, dayIndex }, end: null });
    } else if (selectedPeriod.end === null) {
      // Seleccionar día de fin
      const newSelectedPeriod = { ...selectedPeriod, end: { weekIndex, dayIndex } };
      setSelectedPeriod(newSelectedPeriod);
    } else {
      // Reiniciar selección si ya hay un periodo seleccionado
      setSelectedPeriod({ start: { weekIndex, dayIndex }, end: null });
    }
  };

  // Función para determinar si un día está en un periodo previamente añadido
  const isDayInAddedPeriods = (weekIndex, dayIndex) => {
    return addedPeriods.some(period => {
      const startPos = period.start.weekIndex * 7 + period.start.dayIndex;
      const endPos = period.end.weekIndex * 7 + period.end.dayIndex;
      const currentPos = weekIndex * 7 + dayIndex;
      const minPos = Math.min(startPos, endPos);
      const maxPos = Math.max(startPos, endPos);
      return minPos <= currentPos && currentPos <= maxPos;
    });
  };

  // Función para determinar si una celda (día) está seleccionada como parte del periodo actual
  const isDayInSelectedPeriod = (weekIndex, dayIndex) => {
    const { start, end } = selectedPeriod;
    if (!start || !end) return false;

    const startPos = start.weekIndex * 7 + start.dayIndex;
    const endPos = end.weekIndex * 7 + end.dayIndex;
    const currentPos = weekIndex * 7 + dayIndex;
    const minPos = Math.min(startPos, endPos);
    const maxPos = Math.max(startPos, endPos);
    return minPos <= currentPos && currentPos <= maxPos;
  };

  // Función para añadir el periodo a la lista
  const handleAddPeriod = () => {
    if (selectedPeriod.start && selectedPeriod.end) {
      setAddedPeriods([...addedPeriods, { ...selectedPeriod, color: getPeriodColor(addedPeriods.length) }]);
      setSelectedPeriod({ start: null, end: null }); // Limpiar la selección después de añadir
    }
  };

  // Función para mostrar el componente de reglas de variables
  const handleShowRules = () => setShowRules(true);

  // Función para mostrar el mapa de periodos
  const handleShowPeriodMap = () => setShowPeriodMap(true);

  // Función para determinar el color del periodo para un día específico
  const getDayColor = (weekIndex, dayIndex) => {
    const period = addedPeriods.find(period => {
      const startPos = period.start.weekIndex * 7 + period.start.dayIndex;
      const endPos = period.end.weekIndex * 7 + period.end.dayIndex;
      const currentPos = weekIndex * 7 + dayIndex;
      const minPos = Math.min(startPos, endPos);
      const maxPos = Math.max(startPos, endPos);
      return minPos <= currentPos && currentPos <= maxPos;
    });
    return period ? period.color : null;
  };

  // Función para manejar la finalización del cuestionario
  const handleQuestionnaireComplete = (clientData) => {
    setClientInfo(clientData);
    setQuestionnaireCompleted(true);
  };

  if (!show) return null;

  return (
    <div className={`esqueletopopup-overlay ${theme}`}>
      <div className="esqueletopopup-container" style={{ height: '94%', width: '86%' }}>
      {!questionnaireCompleted ? (
  <EsqueletoClienteCuestionario onComplete={handleQuestionnaireComplete} />
        ) : showRules ? (
          // Mostramos el componente ReglasDeVariables
          <ReglasDeVariables onClose={() => setShowRules(false)} />
        ) : showPeriodMap ? (
          // Mostramos el componente Mapadeperiodos con la lista de periodos añadidos como prop
          <Mapadeperiodos periods={addedPeriods} onClose={() => setShowPeriodMap(false)} />
        ) : showChat ? (
          // Mostramos el componente Chatesqueleto
          <Chatesqueleto
            onClose={() => setShowChat(false)}
            onSubmit={(newPeriods) => {
              // Asignar colores a los nuevos periodos
              const coloredPeriods = newPeriods.map((period, index) => ({
                ...period,
                color: getPeriodColor(addedPeriods.length + index),
              }));

              // Asegurarnos de tener suficientes semanas
              const maxWeekIndex = Math.max(
                ...coloredPeriods.flatMap((period) => [period.start.weekIndex, period.end.weekIndex])
              );
              ensureWeeks(maxWeekIndex + 1); // +1 porque los índices comienzan desde 0

              // Actualizar los periodos añadidos
              setAddedPeriods([...addedPeriods, ...coloredPeriods]);
            }}
          />
        ) : (
          <>
            <h2>Generar Esqueleto</h2>
            <p>Selecciona los días para crear un periodo.</p>

            {/* Botón para abrir el chat */}
            <button
              className="button"
              onClick={() => setShowChat(true)}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '20px',
              }}
            >
              Abrir Chat
            </button>

            {/* Botón para ver el mapa de periodos */}
            {addedPeriods.length > 0 && (
              <button
                className="button"
                onClick={handleShowPeriodMap}
                style={{
                  background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                  color: 'var(--button-text-dark)',
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '20px',
                }}
              >
                Ver Mapa de Periodos
              </button>
            )}

            {/* Botón para añadir más semanas */}
            <button
              className="button"
              onClick={handleAddWeeks}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '20px',
              }}
            >
              Añadir Semanas
            </button>

            {/* Tabla dinámica de semanas */}
            {periods.length > 0 && (
              <table className={`period-table ${theme}`}>
                <thead>
                  <tr>
                    <th>Semana</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, weekIndex) => (
                    <tr key={weekIndex}>
                      <td>{period.week}</td>
                      {period.days.map((_, dayIndex) => (
                        <td
                          key={dayIndex}
                          className={`day-cell ${isDayInAddedPeriods(weekIndex, dayIndex) ? 'occupied' : ''} ${isDayInSelectedPeriod(weekIndex, dayIndex) ? 'selected' : ''}`}
                          onClick={() => handleDaySelect(weekIndex, dayIndex)}
                          style={{
                            backgroundColor: getDayColor(weekIndex, dayIndex) || '', // Aplicar el color del periodo si existe
                          }}
                        >
                          {`Día ${dayIndex + 1}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Botón para añadir periodo */}
            {selectedPeriod.start && selectedPeriod.end && (
              <button
                className="button"
                onClick={handleAddPeriod}
                style={{
                  background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                  color: 'var(--button-text-dark)',
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '20px',
                }}
              >
                Añadir Periodo
              </button>
            )}

            {/* Lista de periodos añadidos */}
            {addedPeriods.length > 0 && (
              <div>
                <h3>Periodos Añadidos:</h3>
                <ul>
                  {addedPeriods.map((period, index) => (
                    <li key={index} style={{ color: period.color }}>
                      Periodo {index + 1}: Semana {period.start.weekIndex + 1} Día {period.start.dayIndex + 1} - Semana {period.end.weekIndex + 1} Día {period.end.dayIndex + 1}
                      {/* Botón de reglas de variables */}
                      <button
                        className="button-icon"
                        onClick={handleShowRules}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          marginLeft: '10px',
                        }}
                      >
                        <Ruler size={18} color={period.color} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botón para cerrar el popup */}
            <button
              className="button"
              onClick={onClose}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px',
              }}
            >
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Esqueletopopup;
