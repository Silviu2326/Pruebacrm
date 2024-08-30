import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import './HorarioDia.css';
import ConfigurarEventosPermitidos from './ConfigurarEventosPermitidos';

const Horariodia = ({ fecha, onGuardar }) => {
  const horas = Array.from({ length: 24 }, (_, i) => i); // Array de 0 a 23 para representar las horas del día
  const [horarios, setHorarios] = useState(Array(24).fill(false)); // Estado para almacenar si cada hora es válida
  const [eventos, setEventos] = useState(Array(24).fill([])); // Estado para almacenar los eventos por hora
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [horaSeleccionada, setHoraSeleccionada] = useState(null); // Estado para la hora seleccionada

  const handleCellClick = (hora) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[hora] = !nuevosHorarios[hora]; // Alterna el estado entre válido y no válido
    setHorarios(nuevosHorarios);
  };

  const handleConfigClick = (hora) => {
    setHoraSeleccionada(hora);
    setModalVisible(true);
  };

  const handleGuardar = () => {
    // Llama a la función para guardar el horario, pasándole la fecha y los datos actuales
    onGuardar(fecha, { horarios, eventos });
  };

  const handleSaveConfig = (tipoEvento, horaInicioEdit, horaFinEdit) => {
    const nuevosEventos = [...eventos];
    const horaInicio = parseFloat(horaInicioEdit.replace(':', '.'));
    const horaFin = parseFloat(horaFinEdit.replace(':', '.'));

    for (let i = Math.floor(horaInicio); i < Math.ceil(horaFin); i++) {
      nuevosEventos[i] = [...nuevosEventos[i], { 
        tipoEvento, 
        horaInicio: horaInicioEdit, 
        horaFin: horaFinEdit, 
        displayTime: `${horaInicioEdit} - ${horaFinEdit}` 
      }];
      horarios[i] = true; // Marca la hora como válida
    }

    setEventos(nuevosEventos);
    setModalVisible(false);
  };

  return (
    <div className="horariodia-container">
      <h3 className="horariodia-title">Horario para {fecha}</h3>
      <div className="horariodia-botones-seleccion">
        <button 
          className="horariodia-boton-seleccion" 
          onClick={() => setHorarios(Array(24).fill(true))}
        >
          Marcar como Válido (Verde)
        </button>
        <button 
          className="horariodia-boton-seleccion" 
          onClick={() => setHorarios(Array(24).fill(false))}
        >
          Marcar como No Válido (Rojo)
        </button>
      </div>
      <div className="horariodia-horas-column">
        {horas.map((hora) => (
          <div 
            key={hora} 
            className={`horariodia-horas-disponibles-hora ${horarios[hora] ? 'valido' : ''}`} 
            onClick={() => handleCellClick(hora)}
          >
            <span className="horariodia-time">
              {`${hora.toString().padStart(2, '0')}:00 - ${(hora + 1).toString().padStart(2, '0')}:00`}
            </span>
            <div className="horariodia-switch">
              <input 
                type="checkbox" 
                checked={horarios[hora]} 
                className="horariodia-checkbox" 
                onChange={() => handleCellClick(hora)}
              />
              <span className="horariodia-slider"></span>
              <span className="horariodia-label">
                {horarios[hora] ? 'Válido' : 'No Válido'}
              </span>
              {horarios[hora] && (
                <FaCog 
                  className="horariodia-settings-icon" 
                  onClick={() => handleConfigClick(hora)} 
                />
              )}
            </div>
            {eventos[hora].length > 0 && (
              eventos[hora].map((evento, idx) => (
                <div key={idx} className="horariodia-event">
                  <span>{evento.tipoEvento} ({evento.horaInicio} - {evento.horaFin})</span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      <div className="horariodia-botones-seleccion">
        <button 
          className="horariodia-boton-seleccion horariodia-activo" 
          onClick={handleGuardar}
        >
          Guardar Horario
        </button>
      </div>
      {modalVisible && (
        <ConfigurarEventosPermitidos
          horaInicio={`${horaSeleccionada.toString().padStart(2, '0')}:00`}
          horaFin={`${(horaSeleccionada + 1).toString().padStart(2, '0')}:00`}
          dia={fecha}
          eventosExistentes={eventos[horaSeleccionada]}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

export default Horariodia;
