import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import AddEventForm from './AddEventForm';
import Sidebar from './Sidebar';
import EventTooltip from './EventTooltip';
import MonthTool from './MonthTool';
import Filtrodediasyhoras from './Filtrodediasyhoras'; // Importamos el nuevo componente

const locales = {
  'es-US': enUS,
};

const localizer = dateFnsLocalizer({
  format: (date, formatString) => format(date, formatString, { locale: enUS }),
  parse: (dateString, formatString) => parse(dateString, formatString, new Date(), { locale: enUS }),
  startOfWeek: (date) => startOfWeek(date, { locale: enUS }),
  getDay,
  locales,
});

const eventTypeColors = {
  Clase: '#ff6347',
  Cita: '#ffa500',
  Pago: '#20b2aa',
  Rutina: '#9370db',
  Libre: '#3cb371',
};

const MyCalendar = ({ theme }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    Clase: true,
    Cita: true,
    Pago: true,
    Rutina: true,
    Libre: true,
  });
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [highlightedHours, setHighlightedHours] = useState({});
  const [dayEvents, setDayEvents] = useState([]);
  const [monthToolPosition, setMonthToolPosition] = useState({ top: 0, left: 0 });
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false); // Estado para manejar el modal de horarios

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/events');
      const data = await response.json();
      const formattedData = data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(formattedData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate({ start: new Date(start), end: new Date(end) });
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedDate({ start: new Date(event.start), end: new Date(event.end) });
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  };

  const handleSaveEvent = async (newEvent) => {
    const formattedEvent = {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };

    const startHour = new Date(newEvent.start).getHours();
    const endHour = new Date(newEvent.end).getHours();
    const startDate = format(new Date(newEvent.start), 'yyyy-MM-dd');
    const dayOfWeek = new Date(newEvent.start).getDay();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const selectedDay = dayNames[dayOfWeek];

    const isUnavailable = (day, hour) => {
      return highlightedHours[day]?.some(h => startHour <= h && h < endHour);
    };

    if (newEvent.eventType !== 'Libre' && (isUnavailable(selectedDay, startHour) || isUnavailable(startDate, startHour))) {
      alert('No se puede crear un evento en las horas seleccionadas como no disponibles.');
      return;
    }

    try {
      const response = editingEvent
        ? await fetch(`http://localhost:5005/api/events/${editingEvent._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedEvent),
          })
        : await fetch('http://localhost:5005/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedEvent),
          });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const savedEvent = await response.json();
      setEvents((prevEvents) =>
        editingEvent
          ? prevEvents.map((event) =>
              event._id === savedEvent._id ? { ...savedEvent, start: new Date(savedEvent.start), end: new Date(savedEvent.end) } : event
            )
          : [...prevEvents, { ...savedEvent, start: new Date(savedEvent.start), end: new Date(savedEvent.end) }]
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventToDelete) => {
    try {
      await fetch(`http://localhost:5005/api/events/${eventToDelete._id}`, {
        method: 'DELETE',
      });
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventToDelete._id)
      );
      setHoveredEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleFilterChange = (name, checked) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleAdvancedFilterChange = (eventType, field, values) => {
    setAdvancedFilters((prevFilters) => ({
      ...prevFilters,
      [eventType]: {
        ...prevFilters[eventType],
        [field]: values,
      },
    }));
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
  };

  const handleMouseEnterDay = (day, e) => {
    const eventsForDay = events.filter(event => 
      new Date(event.start).toDateString() === day.toDateString());
    if (eventsForDay.length > 2) {
      const rect = e.target.getBoundingClientRect();
      const position = {
        top: rect.top + window.scrollY + 20,
        left: rect.left + window.scrollX + 20,
      };
      setDayEvents(eventsForDay);
      setMonthToolPosition(position);
    }
  };

  const handleMouseLeaveDay = () => {
    setDayEvents([]);
  };

  const handleMouseEnter = (event, e) => {
    const rect = e.target.getBoundingClientRect();
    const position = {
      top: rect.top + window.scrollY + 20,
      left: rect.left + window.scrollX + 20,
    };

    setHoveredEvent(event);
    setTooltipPosition(position);
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  const handleHoursChange = (dailyAvailableHours) => {
    setHighlightedHours(dailyAvailableHours);
  };

  const handleOpenHorarioModal = () => {
    setIsHorarioModalOpen(true);
  };

  const handleCloseHorarioModal = () => {
    setIsHorarioModalOpen(false);
  };

  useEffect(() => {
    const applyAdvancedFilters = (events, filters) => {
      return events.filter(event => {
        const eventType = event.eventType;
        const filter = filters[eventType];
        if (!filter) return true;

        for (const field in filter) {
          const values = filter[field];
          if (values.length > 0 && !values.includes(event[field])) {
            return false;
          }
        }
        return true;
      });
    };

    const filtered = applyAdvancedFilters(
      events.filter(event => filters[event.eventType]),
      advancedFilters
    );

    setFilteredEvents(filtered);
  }, [events, filters, advancedFilters]);

  const handleAddEventClick = () => {
    setSelectedDate({ start: new Date(), end: new Date() });
    setEditingEvent(null);
    setModalOpen(true);
  };

  const eventPropGetter = (event) => {
    const backgroundColor = eventTypeColors[event.eventType] || '#007bff';
    return { style: { backgroundColor } };
  };

  const timeSlotPropGetter = (date) => {
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const selectedDay = dayNames[dayOfWeek];
    const selectedDate = format(date, 'yyyy-MM-dd');
    if (highlightedHours[selectedDay]?.includes(hour) || highlightedHours[selectedDate]?.includes(hour)) {
      return {
        style: {
          backgroundColor: 'red',
        },
      };
    }
    return {};
  };

  return (
    <div className={`Calendarioclass-main-container ${theme}`}>
      <Sidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onAdvancedFilterChange={handleAdvancedFilterChange}
        onDateClick={handleDateClick}
        onHoursChange={handleHoursChange}
        events={events} // Asegúrate de pasar los eventos aquí
        theme={theme}
      />
      <div className={`Calendarioclass-calendar-container ${theme}`}>
        <h1>My Calendar</h1>
        <button onClick={handleOpenHorarioModal}>Configurar Horarios Válidos</button> {/* Botón para abrir el modal */}

        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 200px)', margin: '20px' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day']}
          defaultView="month"
          date={currentDate}
          onNavigate={date => setCurrentDate(new Date(date))}
          eventPropGetter={eventPropGetter}
          timeSlotPropGetter={timeSlotPropGetter}
          components={{
            toolbar: (props) => (
              <div className={`Calendarioclass-rbc-toolbar ${theme}`}>
                <span className="Calendarioclass-rbc-btn-group">
                  <button type="button" onClick={() => props.onNavigate('PREV')}>Back</button>
                  <button type="button" onClick={() => props.onNavigate('TODAY')}>Today</button>
                  <button type="button" onClick={() => props.onNavigate('NEXT')}>Next</button>
                </span>
                <span className="Calendarioclass-rbc-toolbar-label">{props.label}</span>
                <span className="Calendarioclass-rbc-btn-group">
                  <button type="button" onClick={() => props.onView('month')}>Month</button>
                  <button type="button" onClick={() => props.onView('week')}>Week</button>
                  <button type="button" onClick={() => props.onView('day')}>Day</button>
                  <button type="button" className="Calendarioclass-add-event-btn" onClick={handleAddEventClick}>Añadir evento</button>
                </span>
              </div>
            ),
            month: {
              dateHeader: ({ date, label }) => (
                <div
                  onMouseEnter={(e) => handleMouseEnterDay(date, e)}
                  onMouseLeave={handleMouseLeaveDay}
                  className={`${theme} ${date.getMonth() !== currentDate.getMonth() ? 'rbc-off-range-bg' : ''} ${date.toDateString() === new Date().toDateString() ? `rbc-today ${theme}` : ''}`}
                >
                  {label}
                </div>
              ),
            },
            event: ({ event }) => (
              <div
                onMouseEnter={(e) => handleMouseEnter(event, e)}
                onMouseLeave={handleMouseLeave}
                className="Calendarioclass-event"
              >
                <span>{event.title}</span>
                <button
                  onClick={() => handleSelectEvent(event)}
                  style={{
                    float: 'right',
                    padding: '2px 5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteEvent(event)}
                  style={{
                    float: 'right',
                    padding: '2px 5px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  🗑
                </button>
              </div>
            ),
          }}
        />

        {modalOpen && (
          <AddEventForm
            onClose={handleCloseModal}
            onSave={handleSaveEvent}
            defaultValues={{
              title: editingEvent?.title || '',
              description: editingEvent?.description || '',
              start: selectedDate?.start ? format(selectedDate.start, "yyyy-MM-dd'T'HH:mm") : '',
              end: selectedDate?.end ? format(selectedDate.end, "yyyy-MM-dd'T'HH:mm") : '',
              location: editingEvent?.location || '',
              participants: editingEvent?.participants || '',
              estadoPago: editingEvent?.estadoPago || '',
              recibo: editingEvent?.recibo || '',
              frecuencia: editingEvent?.frecuencia || '',
              notas: editingEvent?.notas || '',
              eventType: editingEvent?.eventType || '',
            }}
            theme={theme}
          />
        )}

        {hoveredEvent && (
          <EventTooltip event={hoveredEvent} position={tooltipPosition} onDelete={handleDeleteEvent} theme={theme} />
        )}
        
        {dayEvents.length > 0 && (
          <MonthTool events={dayEvents} position={monthToolPosition} theme={theme} />
        )}
        
        {isHorarioModalOpen && (  // Si el modal de horarios está abierto, mostramos el componente
          <Filtrodediasyhoras onClose={handleCloseHorarioModal} />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
