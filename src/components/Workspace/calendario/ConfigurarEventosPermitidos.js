import React, { useState } from 'react';
import './ConfigurarEventosPermitidos.css';

const ConfigurarEventosPermitidos = ({ horaInicio, horaFin, dia, eventosExistentes, onClose, onSave }) => {
  const [eventos, setEventos] = useState(eventosExistentes || [{ tipoEvento: '', horaInicio, horaFin }]);

  const handleEventoChange = (index, field, value) => {
    const nuevosEventos = [...eventos];
    nuevosEventos[index][field] = value;
    setEventos(nuevosEventos);
  };

  const handleAddEvento = () => {
    setEventos([...eventos, { tipoEvento: '', horaInicio, horaFin }]);
  };

  const handleSave = () => {
    eventos.forEach(evento => {
      onSave(evento.tipoEvento, evento.horaInicio, evento.horaFin);
    });
    onClose();
  };

  return (
    <div className="configurarEventos-overlay">
      <div className="configurarEventos-modal">
        <button className="configurarEventos-close" onClick={onClose}>✕</button>
        <h2>Configurar Reservas Permitidos</h2>
        <p>Configurando eventos para {dia}</p>
        
        {eventos.map((evento, index) => (
          <div key={index} className="configurarEventos-fields-container">
            <div className="configurarEventos-field">
              <label>Hora de inicio</label>
              <input 
                type="time" 
                value={evento.horaInicio} 
                onChange={(e) => handleEventoChange(index, 'horaInicio', e.target.value)} 
                className="configurarEventos-input"
              />
            </div>
            <div className="configurarEventos-field">
              <label>Hora de finalización</label>
              <input 
                type="time" 
                value={evento.horaFin} 
                onChange={(e) => handleEventoChange(index, 'horaFin', e.target.value)} 
                className="configurarEventos-input"
              />
            </div>
            <div className="configurarEventos-field">
              <label>Tipo de evento</label>
              <select 
                value={evento.tipoEvento} 
                onChange={(e) => handleEventoChange(index, 'tipoEvento', e.target.value)} 
                className="configurarEventos-input"
              >
                <option value="" disabled>Selecciona un tipo de evento</option>
                <option value="Reunión">Reunión</option>
                <option value="Entrenamiento">Entrenamiento</option>
                <option value="Consulta">Consulta</option>
                <option value="Clase Grupal">Clase Grupal</option>
              </select>
            </div>
          </div>
        ))}

        <button onClick={handleAddEvento} className="configurarEventos-add-event">
          Añadir Otro Evento
        </button>

        <button onClick={handleSave} className="configurarEventos-save">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default ConfigurarEventosPermitidos;
