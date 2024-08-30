import React, { useState } from 'react';
import './Horariovalidosemanal.css';
import { FaCog } from 'react-icons/fa';
import ConfigurarEventosPermitidos from './ConfigurarEventosPermitidos';

const Horariovalidosemanal = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const initialDayState = {
    horarios: Array(24).fill(false),
    eventos: Array(24).fill([])
  };

  const [selectedDay, setSelectedDay] = useState(0);
  const [dayData, setDayData] = useState({
    Lunes: JSON.parse(JSON.stringify(initialDayState)),
    Martes: JSON.parse(JSON.stringify(initialDayState)),
    Miércoles: JSON.parse(JSON.stringify(initialDayState)),
    Jueves: JSON.parse(JSON.stringify(initialDayState)),
    Viernes: JSON.parse(JSON.stringify(initialDayState)),
    Sábado: JSON.parse(JSON.stringify(initialDayState)),
    Domingo: JSON.parse(JSON.stringify(initialDayState)),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);

  const toggleHorario = (day, index) => {
    const newDayData = JSON.parse(JSON.stringify(dayData)); // Copia profunda
    newDayData[day].horarios[index] = !newDayData[day].horarios[index];
    setDayData(newDayData);
    console.log(`Toggled horario for ${day} at hour ${index}:`, newDayData[day].horarios);
  };

  const marcarTodoComoValido = (day) => {
    const newDayData = JSON.parse(JSON.stringify(dayData)); // Copia profunda
    newDayData[day].horarios = Array(24).fill(true);
    setDayData(newDayData);
    console.log(`Marked all as valid for ${day}:`, newDayData[day].horarios);
  };

  const marcarTodoComoNoValido = (day) => {
    const newDayData = JSON.parse(JSON.stringify(dayData)); // Copia profunda
    newDayData[day].horarios = Array(24).fill(false);
    newDayData[day].eventos = Array(24).fill([]);
    setDayData(newDayData);
    console.log(`Marked all as not valid for ${day}:`, newDayData[day]);
  };

  const handleDayChange = (dayIndex) => {
    setSelectedDay(dayIndex);
    console.log(`Changed day to ${daysOfWeek[dayIndex]}`);
  };

  const handleSettingsClick = (index) => {
    setSelectedHour(index);
    setModalVisible(true);
    console.log(`Clicked settings for ${daysOfWeek[selectedDay]} at hour ${index}`);
  };

  const handleSaveConfig = (tipoEvento, horaInicioEdit, horaFinEdit) => {
    const day = daysOfWeek[selectedDay];
    const newDayData = JSON.parse(JSON.stringify(dayData)); // Copia profunda
    
    const horaInicio = parseFloat(horaInicioEdit.replace(':', '.'));
    const horaFin = parseFloat(horaFinEdit.replace(':', '.'));

    console.log(`Saving event for ${day}: ${tipoEvento} from ${horaInicioEdit} to ${horaFinEdit}`);

    for (let i = Math.floor(horaInicio); i < Math.ceil(horaFin); i++) {
      // Añadir el evento a cada intervalo de tiempo correspondiente
      newDayData[day].eventos[i] = [...newDayData[day].eventos[i], {
        tipoEvento,
        horaInicio: horaInicioEdit,
        horaFin: horaFinEdit,
        displayTime: `${horaInicioEdit} - ${horaFinEdit}`
      }];
      newDayData[day].horarios[i] = true; // Marca las horas como válidas
    }

    setDayData(newDayData);
    console.log(`Updated day data for ${day}:`, newDayData[day]);
  };

  const currentDayData = dayData[daysOfWeek[selectedDay]];

  return (
    <div className="Horariovalidosemanal-container">
      <h2 className="Horariovalidosemanal-title">Horario Semanal</h2>
      <div className="Horariovalidosemanal-controls">
        <button onClick={() => marcarTodoComoValido(daysOfWeek[selectedDay])} className="Horariovalidosemanal-button">
          Marcar Todo como Válido
        </button>
        <div className="Horariovalidosemanal-navigation">
          <button
            onClick={() => handleDayChange((selectedDay - 1 + 7) % 7)}
            className="Horariovalidosemanal-nav-button"
          >
            {'<'}
          </button>
          <select
            value={selectedDay}
            onChange={(e) => handleDayChange(parseInt(e.target.value))}
            className="Horariovalidosemanal-select"
          >
            {daysOfWeek.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleDayChange((selectedDay + 1) % 7)}
            className="Horariovalidosemanal-nav-button"
          >
            {'>'}
          </button>
        </div>
        <button onClick={() => marcarTodoComoNoValido(daysOfWeek[selectedDay])} className="Horariovalidosemanal-button">
          Marcar Todo como No Válido
        </button>
      </div>
      <div className="Horariovalidosemanal-day-title">
        {daysOfWeek[selectedDay]}
      </div>
      <div className="Horariovalidosemanal-list">
        {currentDayData.horarios.map((valido, index) => (
          <div key={index} className={`Horariovalidosemanal-item ${valido ? 'valido' : ''}`}>
            <div className="Horariovalidosemanal-time-row">
              <span className="Horariovalidosemanal-time">
                {`${index.toString().padStart(2, '0')}:00 - ${(index + 1).toString().padStart(2, '0')}:00`}
              </span>
              <label className="Horariovalidosemanal-switch">
                <input
                  type="checkbox"
                  checked={valido}
                  onChange={() => toggleHorario(daysOfWeek[selectedDay], index)}
                  className="Horariovalidosemanal-checkbox"
                />
                <span className="Horariovalidosemanal-slider" />
                <span className="Horariovalidosemanal-label">
                  {valido ? 'Válido' : 'No Válido'}
                </span>
              </label>
              {valido && (
                <FaCog 
                  className="Horariovalidosemanal-settings-icon" 
                  onClick={() => handleSettingsClick(index)}
                />
              )}
            </div>
            {currentDayData.eventos[index].length > 0 && (
              currentDayData.eventos[index].map((evento, idx) => (
                <div key={idx} className="Horariovalidosemanal-event">
                  <span className="Horariovalidosemanal-event-label">
                    {evento.tipoEvento} ({evento.horaInicio} - {evento.horaFin})
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      {modalVisible && (
        <ConfigurarEventosPermitidos
          horaInicio={`${selectedHour.toString().padStart(2, '0')}:00`}
          horaFin={`${(selectedHour + 1).toString().padStart(2, '0')}:00`}
          dia={daysOfWeek[selectedDay]}
          eventosExistentes={currentDayData.eventos[selectedHour]}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default Horariovalidosemanal;
