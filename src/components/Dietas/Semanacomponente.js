import React from 'react'; 
import Componentedia from './Componentedia';
import styles from './Semanacomponente.module.css'; // Importa los estilos

const Semanacomponente = ({ selectedWeek, weeksData, setWeeksData, theme }) => {
  // Log para verificar los datos de las semanas
  console.log('Selected week:', selectedWeek);
  console.log('Weeks data:', weeksData);

  if (!Array.isArray(weeksData) || weeksData.length === 0 || !weeksData[selectedWeek]) {
    return <div>No hay datos disponibles para las semanas seleccionadas.</div>;
  }

  // Función para editar los macronutrientes de un día
  const handleEditMacros = (diaIndex, macros) => {
    console.log(`Editando macros del día ${diaIndex + 1}`, macros);
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) => (i === diaIndex ? { ...dia, macros } : dia));
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  // Función para guardar una nueva comida en un día específico
  const handleSaveComida = (diaIndex, newComida) => {
    console.log(`Guardando nueva comida en el día ${diaIndex + 1}`, newComida);
    if (!newComida.nombreComida || !newComida.calorias || !newComida.macronutrientes) {
      console.error("Faltan datos en newComida:", newComida);
      return;
    }

    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, comidas: [...dia.comidas, newComida] }
            : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  // Función para actualizar una comida existente en un día
  const handleUpdateComida = (diaIndex, comidaIndex, updatedComida) => {
    console.log(`Actualizando comida en el día ${diaIndex + 1}, comida ${comidaIndex + 1}`, updatedComida);
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, comidas: dia.comidas.map((comida, idx) => (idx === comidaIndex ? updatedComida : comida)) }
            : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  // Función para eliminar una comida de un día específico
  const handleDeleteComida = (diaIndex, comidaIndex) => {
    console.log(`Eliminando comida en el día ${diaIndex + 1}, comida ${comidaIndex + 1}`);
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex ? { ...dia, comidas: dia.comidas.filter((_, idx) => idx !== comidaIndex) } : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{weeksData[selectedWeek].nombre}</h2>
      <div className={`${styles.diasContainer} ${styles[theme]}`}>
        {weeksData[selectedWeek].dias.map((dia, index) => (
          <div key={index} className={styles.diaCard}>
            <Componentedia
              dia={`Día ${index + 1}`}
              weekday={dia.weekday} // Pasamos el nombre del día de la semana
              date={dia.date} // Pasamos la fecha del día
              macros={dia.macros}
              comidas={dia.comidas}
              onEditMacros={(macros) => handleEditMacros(index, macros)}
              onSaveComida={(newComida) => handleSaveComida(index, newComida)}
              onUpdateComida={(comidaIndex, updatedComida) => handleUpdateComida(index, comidaIndex, updatedComida)}
              onDeleteComida={(comidaIndex) => handleDeleteComida(index, comidaIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Semanacomponente;
