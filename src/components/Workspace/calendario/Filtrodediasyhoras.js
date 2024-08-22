import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 

// Importación correcta de los estilos CSS de FullCalendar

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Filtrodediasyhoras.css';

import HorarioSemanal from './HorarioSemanal'; // Asegúrate de tener la ruta correcta

const Filtrodediasyhoras = ({ onClose }) => {
  const [eventType, setEventType] = useState('');
  const [fechaEspecifica, setFechaEspecifica] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [valido, setValido] = useState(true);
  const [events, setEvents] = useState([]);
  const [horariosSemanales, setHorariosSemanales] = useState({});

  const eventTypes = ['Entrenamiento', 'Consulta', 'Clase Grupal'];

  const handleDateClick = (arg) => {
    setFechaEspecifica(arg.dateStr);
  };

  const handleHorarioSemanalChange = (nuevosHorarios) => {
    setHorariosSemanales(nuevosHorarios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (horaFin <= horaInicio) {
      alert('La hora de fin debe ser después de la hora de inicio');
      return;
    }

    const newHorarioValido = {
      eventType,
      fechaEspecifica,
      horaInicio,
      horaFin,
      valido,
      horariosSemanales,
    };

    try {
      const response = await fetch('http://localhost:5005/api/horarios-validos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHorarioValido),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      alert('Horario válido creado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error creando horario válido:', error);
      alert('Hubo un problema al crear el horario válido');
    }
  };

  return (
    <div className="filtrodediasyhoras-overlay">
      <div className="filtrodediasyhoras-modal">
        <h2>Crear Horario Válido</h2>
        <form onSubmit={handleSubmit} className="filtrodediasyhoras-form">
          <label className="filtrodediasyhoras-label">
            Tipo de Evento:
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
              className="filtrodediasyhoras-select"
            >
              <option value="" disabled>Selecciona un tipo de evento</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="filtrodediasyhoras-label">
            Fecha Específica:
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              selectable={true}
              editable={true}
              events={events}
            />
          </label>
          <label className="filtrodediasyhoras-label">
            Hora de Inicio:
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
              className="filtrodediasyhoras-input"
            />
          </label>
          <label className="filtrodediasyhoras-label">
            Hora de Fin:
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
              className="filtrodediasyhoras-input"
            />
          </label>
          <label className="filtrodediasyhoras-label">
            Válido:
            <input
              type="checkbox"
              checked={valido}
              onChange={(e) => setValido(e.target.checked)}
              className="filtrodediasyhoras-checkbox"
            />
          </label>

          {/* Agregamos el componente HorarioSemanal aquí */}
          <div className="filtrodediasyhoras-horario-semanal">
            <HorarioSemanal onHorarioChange={handleHorarioSemanalChange} />
          </div>

          <div className="filtrodediasyhoras-button-container">
            <button type="submit" className="filtrodediasyhoras-submit-button">Guardar</button>
            <button type="button" onClick={onClose} className="filtrodediasyhoras-cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Filtrodediasyhoras;
