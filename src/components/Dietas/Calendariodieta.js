import React, { useState, useEffect } from 'react';
import { CirclePlus, Trash2 } from 'lucide-react'; // Asegúrate de importar el icono de eliminación
import styles from './Calendariodieta.module.css';

const Calendariodieta = ({ weeks, onSelectWeek, onAddWeek, onDeleteWeek, theme, fechaInicio }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    return `${day}/${month}`;
  };

  // Función para calcular el próximo lunes
  const getNextMonday = (date) => {
    const day = date.getDay();
    const nextMonday = new Date(date);
    const distanceToMonday = (day === 0 ? 1 : 8) - day; // Si es domingo, mover al lunes siguiente
    nextMonday.setDate(date.getDate() + distanceToMonday);
    return nextMonday;
  };

  // Función para calcular el próximo domingo
  const getNextSunday = (date) => {
    const day = date.getDay();
    const nextSunday = new Date(date);
    const distanceToSunday = 7 - day; // Mover al próximo domingo
    nextSunday.setDate(date.getDate() + distanceToSunday);
    return nextSunday;
  };

  // Calcular las semanas a partir de la fecha de inicio de la dieta
  useEffect(() => {
    if (!fechaInicio) {
      console.error('No hay fecha de inicio definida.');
      return;
    }

    let startDate = new Date(fechaInicio); // Usamos la fecha de inicio de la dieta
    console.log("Fecha de inicio de la dieta:", startDate.toLocaleDateString());

    // Recorremos cada semana para calcular su inicio y fin
    weeks.forEach((week, index) => {
      // Si es la primera semana, empezamos con la fecha de inicio
      const weekStart = index === 0 ? startDate : getNextMonday(new Date(weeks[index - 1].endDate));
      const weekEnd = getNextSunday(weekStart);

      // Actualizamos los valores de startDate y endDate en el objeto weeks
      weeks[index].startDate = weekStart.toISOString();
      weeks[index].endDate = weekEnd.toISOString();
    });
  }, [weeks, fechaInicio]);

  const handleWeekSelect = (index) => {
    setSelectedWeek(index);
    onSelectWeek(index);
  };

  const handleDeleteWeek = (index) => {
    onDeleteWeek(index); // Llamamos a la función que se encarga de eliminar en el componente padre
  };

  return (
    <div className={`${styles.calendarContainer} ${styles[theme]}`}>
      <div className={styles.header}>
        <h2>Selecciona una Semana</h2>
        <button 
          className={styles.addButton} 
          onClick={onAddWeek}
          style={{
            background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
            color:  'var(--button-text-dark)' ,          
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',     
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
        >
          <CirclePlus size={24} />
        </button>
      </div>
      <div className={styles.weeksContainer}>
        {weeks.map((week, index) => (
          <div key={index} className={styles.weekItem}>
            <button
              className={`${styles.weekButton} ${selectedWeek === index ? styles.selected : ''}`}
              onClick={() => handleWeekSelect(index)}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                color:  'var(--button-text-dark)' ,          
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',     
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              {`${week.nombre} (${formatDate(week.startDate)} - ${formatDate(week.endDate)})`}
            </button>
            <button 
              className={styles.deleteButton}
              onClick={() => handleDeleteWeek(index)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              <Trash2 size={20} color="red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendariodieta;
