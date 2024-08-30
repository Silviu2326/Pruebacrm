// Filtrodediasyhoras.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'react-datepicker/dist/react-datepicker.css';
import './Filtrodediasyhoras.css';
import Horariodia from './HorarioDia';
import Horariovalidosemanal from './Horariovalidosemanal';

const Filtrodediasyhoras = ({ onClose }) => {
  const [fechaEspecifica, setFechaEspecifica] = useState('');
  const [events, setEvents] = useState([]);
  const [horariosValidos, setHorariosValidos] = useState([]);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  useEffect(() => {
    // Cargar los horarios válidos guardados desde localStorage al montar el componente
    const storedHorariosValidos = localStorage.getItem('horariosValidos');
    if (storedHorariosValidos) {
      setHorariosValidos(JSON.parse(storedHorariosValidos));
    }
  }, []);

  const handleDateClick = (arg) => {
    setFechaEspecifica(arg.dateStr);
    const esDiaValido = verificarDiaValido(arg.dateStr);
    if (!esDiaValido) {
      alert('El día seleccionado no tiene horarios válidos.');
    }
  };

  const verificarDiaValido = (dateStr) => {
    const fechaSeleccionada = new Date(dateStr);
    const diaSemanaSeleccionado = fechaSeleccionada.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase();

    const horarioEspecifico = horariosValidos.find(horario => {
      const fechaEspecifica = horario.fechaEspecifica ? new Date(horario.fechaEspecifica).toISOString().split('T')[0] : null;
      return fechaEspecifica === dateStr;
    });

    const horarioSemanal = horariosValidos.find(horario =>
      horario.horariosSemanales?.some(hs => hs.dia.toLowerCase() === diaSemanaSeleccionado)
    );

    return !!(horarioEspecifico || horarioSemanal);
  };

  const handleGuardarHorarioDia = (fecha, horario) => {
    alert(`Horario para el día ${fecha} guardado.`);
    // Actualizar el estado y el localStorage con el nuevo horario
    const nuevoHorario = [...horariosValidos, { fechaEspecifica: fecha, horarios: horario }];
    setHorariosValidos(nuevoHorario);
    localStorage.setItem('horariosValidos', JSON.stringify(nuevoHorario));
  };

  const handleMostrarCalendario = () => {
    setMostrarCalendario(true);
  };

  const handleGuardarYSalir = (e) => {
    e.preventDefault();
    // Guardar el horario válido en localStorage
    localStorage.setItem('horariosValidos', JSON.stringify(horariosValidos));
    alert('Horario válido guardado en el navegador');
    onClose(); // Cerrar el modal
  };

  return (
    <div className="filtrodediasyhoras-overlay">
      <div className="filtrodediasyhoras-modal">
        <h2>Horarios Válidos</h2>

        <div className="filtrodediasyhoras-button-container-top">
          <button type="button" onClick={handleGuardarYSalir} className="filtrodediasyhoras-submit-button">Guardar y Salir</button>
          <button type="button" onClick={onClose} className="filtrodediasyhoras-cancel-button">Cancelar</button>
        </div>

        <div className="filtrodediasyhoras-horario-semanal">
          <Horariovalidosemanal horariosValidos={horariosValidos} />
        </div>

        {!mostrarCalendario && (
          <button
            type="button"
            className="filtrodediasyhoras-boton-configurar"
            onClick={handleMostrarCalendario}
          >
            Configurar horario especial
          </button>
        )}

        {mostrarCalendario && (
          <form onSubmit={handleGuardarYSalir} className="filtrodediasyhoras-form">
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

            {fechaEspecifica && (
              <div className="filtrodediasyhoras-horario-dia">
                <Horariodia fecha={fechaEspecifica} onGuardar={handleGuardarHorarioDia} />
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Filtrodediasyhoras;
