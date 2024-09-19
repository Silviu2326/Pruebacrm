import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Semanacomponente from '../Semanacomponente';
import Calendariodieta from '../Calendariodieta';
import Modalcreacioncomida from '../Modalcreacioncomida';
import axios from 'axios';
import styles from './Pageediciondieta.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Pageediciondieta = ({ theme }) => {
  const { id: dietaId } = useParams();
  const navigate = useNavigate();

  const [dieta, setDieta] = useState({
    nombre: '',
    cliente: '',
    fechaInicio: '',
    duracionSemanas: 1,
    objetivo: '',
    restricciones: '',
    semanas: [],
  });
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeks, setWeeks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Estados para el modal de comida
  const [isModalComidaOpen, setIsModalComidaOpen] = useState(false);
  const [initialComidaData, setInitialComidaData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editComidaIndex, setEditComidaIndex] = useState(null);

  useEffect(() => {
    const fetchDieta = async () => {
      try {
        if (dietaId) {
          const response = await axios.get(`${API_BASE_URL}/api/dietas/${dietaId}`);
          console.log("Respuesta completa de la API:", response);
          console.log("Datos de la dieta:", response.data);
          setDieta(response.data);
          setWeeks(response.data.semanas || []); // Asegura que `semanas` sea un array
          // Comprobando las semanas que llegan de la API
          console.log("Semanas cargadas:", response.data.semanas);
        } else {
          console.error("No Dieta ID provided.");
        }
      } catch (error) {
        console.error('Error fetching dieta:', error);
      }
    };

    fetchDieta();
  }, [dietaId]);

  // Función para obtener el próximo lunes
  const getNextMonday = (date) => {
    const day = date.getDay();
    const nextMonday = new Date(date);
    const distanceToMonday = (day === 0 ? 1 : 8) - day; // Si es domingo, mover al lunes siguiente
    nextMonday.setDate(date.getDate() + distanceToMonday);
    return nextMonday;
  };

  // Función para obtener el próximo domingo
  const getNextSunday = (date) => {
    const day = date.getDay();
    const nextSunday = new Date(date);
    const distanceToSunday = 7 - day; // Mover al próximo domingo
    nextSunday.setDate(date.getDate() + distanceToSunday);
    return nextSunday;
  };

  const handleSaveDietaInfo = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/dietas/${dietaId}`, dieta);
      setDieta(response.data);
      setIsFormVisible(false); // Ocultar el formulario después de guardar
      console.log("Dieta guardada con éxito.");
    } catch (error) {
      console.error('Error al guardar la dieta:', error.response ? error.response.data : error.message);
    }
  };

// Crear una nueva semana con días predefinidos
const createWeekWithDays = (weekNumber, startDate, endDate, isFirstWeek = false) => {
  let numberOfDays = 7;
  if (isFirstWeek) {
    const dayOfWeek = startDate.getDay(); // Día de inicio
    numberOfDays = 7 - dayOfWeek; // Cuántos días faltan hasta el domingo
  }

  const dias = Array.from({ length: numberOfDays }, (_, index) => {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + index);

    const weekday = currentDay.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el nombre del día
    const date = currentDay.toISOString(); // Almacenar la fecha

    return {
      nombre: `Día ${index + 1}`,
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1), // Capitalizamos el día
      date: date,
      comidas: [], // Comidas vacías por defecto
      macros: { proteinas: 0, carbohidratos: 0, grasas: 0 }, // Macros vacíos
    };
  });

  return {
    nombre: `Semana ${weekNumber}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    dias: dias,
  };
};

const handleAddWeek = async () => {
  if (!dieta.fechaInicio) {
    console.error("Fecha de inicio no definida.");
    return;
  }

  let startDate;
  let isFirstWeek = false;

  if (weeks.length > 0) {
    const lastWeek = weeks[weeks.length - 1];
    startDate = new Date(lastWeek.endDate);
    startDate.setDate(startDate.getDate() + 1); // Comenzar al día siguiente de la última semana
  } else {
    startDate = new Date(dieta.fechaInicio);
    isFirstWeek = true; // La primera semana puede tener menos de 7 días
  }

  // Asegurar que la semana empiece en lunes si no es la primera semana
  if (!isFirstWeek && startDate.getDay() !== 1) {
    startDate = getNextMonday(startDate);
  }

  const endDate = getNextSunday(startDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Las fechas calculadas son inválidas");
    return;
  }

  const newWeek = createWeekWithDays(weeks.length + 1, startDate, endDate, isFirstWeek); // Crear la semana, considerando si es la primera

  const updatedWeeks = [...weeks, newWeek];
  setWeeks(updatedWeeks);

  try {
    // Guardar automáticamente la nueva semana en la dieta
    const response = await axios.put(`${API_BASE_URL}/api/dietas/${dietaId}`, {
      ...dieta,
      semanas: updatedWeeks, // Guardamos las semanas actualizadas
    });
    console.log("Semana añadida y dieta actualizada con éxito.");
    setDieta(response.data);
  } catch (error) {
    console.error('Error al guardar la nueva semana:', error.response ? error.response.data : error.message);
  }
};

  const handleSaveDieta = async () => {
    try {
      const sanitizedWeeks = weeks.map(week => ({
        _id: isValidObjectId(week._id) ? week._id : generateObjectId(),
        id: week.id,
        nombre: week.nombre,
        dias: week.dias.map(dia => ({
          _id: isValidObjectId(dia._id) ? dia._id : generateObjectId(),
          id: dia.id,
          nombre: dia.nombre,
          comidas: dia.comidas.map(comida => ({
            _id: isValidObjectId(comida._id) ? comida._id : generateObjectId(),
            nombreComida: comida.nombreComida,
            calorias: parseInt(comida.calorias, 10),
            macronutrientes: {
              proteinas: parseInt(comida.macronutrientes.proteinas, 10),
              carbohidratos: parseInt(comida.macronutrientes.carbohidratos, 10),
              grasas: parseInt(comida.macronutrientes.grasas, 10),
            }
          }))
        }))
      }));

      const response = await axios.put(`${API_BASE_URL}/api/dietas/${dietaId}`, {
        ...dieta,
        semanas: sanitizedWeeks
      });

      navigate('/crear-dieta');
    } catch (error) {
      console.error('Error al guardar la dieta:', error.response ? error.response.data : error.message);
    }
  };

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const generateObjectId = () => {
    return Math.floor(Date.now() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  };

  const handleSelectWeek = (index) => {
    setSelectedWeek(index);
  };

  // Funciones para manejar la creación y edición de comidas
  const handleAddComida = () => {
    setIsEditMode(false);
    setInitialComidaData({ momento: 'desayuno', comida: '', calorias: 0, macronutrientes: { proteinas: 0, carbohidratos: 0, grasas: 0 } });
    setIsModalComidaOpen(true);
  };

  const handleEditComida = (dayIndex, comidaIndex) => {
    const selectedComida = weeks[selectedWeek].dias[dayIndex].comidas[comidaIndex];
    setEditComidaIndex({ dayIndex, comidaIndex });
    setIsEditMode(true);
    setInitialComidaData(selectedComida);
    setIsModalComidaOpen(true);
  };

  const handleSaveComida = (newComida) => {
    if (isEditMode) {
      const { dayIndex, comidaIndex } = editComidaIndex;
      const updatedWeeks = [...weeks];
      updatedWeeks[selectedWeek].dias[dayIndex].comidas[comidaIndex] = newComida;
      setWeeks(updatedWeeks);
    } else {
      const updatedWeeks = [...weeks];
      updatedWeeks[selectedWeek].dias[0].comidas.push(newComida);
      setWeeks(updatedWeeks);
    }
    setIsModalComidaOpen(false);
  };

  // Convertir la fecha al formato yyyy-mm-dd para prellenar el campo de entrada de fecha
  const formattedFechaInicio = dieta.fechaInicio
    ? new Date(dieta.fechaInicio).toISOString().split('T')[0]
    : '';

  return (
    <div className={`${styles.pageEdicionDieta} ${styles[theme]}`}>
      <div className={styles.dietaheader}>
        <div className={styles.header}>
          <h2>Nombre de Dieta: {dieta.nombre}</h2>
          <button 
            className={styles.editButton}
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? 'Cerrar info' : 'Editar info'}
          </button>
        </div>

        <div className={styles.dietaInfo}>
          <h3>Cliente: {dieta.cliente}</h3>
          <h3>Objetivo: {dieta.objetivo}</h3>
          <h3>Restricciones: {dieta.restricciones}</h3>
        </div>
      </div>
      
      {isFormVisible && (
        <div className={`${styles.formContainer} ${styles[theme]}`}>
          <div className={styles.formGroup}>
            <label>Nombre de la Dieta:</label>
            <input 
              type="text" 
              value={dieta.nombre} 
              onChange={(e) => setDieta({ ...dieta, nombre: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>
      
          <div className={styles.formGroup}>
            <label>Cliente:</label>
            <input 
              type="text" 
              value={dieta.cliente} 
              onChange={(e) => setDieta({ ...dieta, cliente: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>
      
          <div className={styles.formGroup}>
            <label>Fecha de Inicio:</label>
            <input 
              type="date" 
              value={formattedFechaInicio} 
              onChange={(e) => setDieta({ ...dieta, fechaInicio: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>
      
          <div className={styles.formGroup}>
            <label>Duración (semanas):</label>
            <input 
              type="number" 
              value={dieta.duracionSemanas} 
              onChange={(e) => setDieta({ ...dieta, duracionSemanas: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>
      
          <div className={styles.formGroup}>
            <label>Objetivo:</label>
            <input 
              type="text" 
              value={dieta.objetivo} 
              onChange={(e) => setDieta({ ...dieta, objetivo: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>
      
          <div className={styles.formGroup}>
            <label>Restricciones:</label>
            <input 
              type="text" 
              value={dieta.restricciones} 
              onChange={(e) => setDieta({ ...dieta, restricciones: e.target.value })} 
              className={`${styles.input} ${styles[theme]}`}
            />
          </div>

          <button 
            className={`${styles.saveButton} ${styles[theme]}`} 
            onClick={handleSaveDietaInfo}
          >
            Guardar Cambios
          </button>
        </div>
      )}
      
      <div className={`${styles.weekContainer} ${styles[theme]}`}>
        <h3>Selecciona una Semana</h3>
        <div>
        <Calendariodieta 
          weeks={weeks} 
          onSelectWeek={handleSelectWeek} 
          onAddWeek={handleAddWeek} 
          theme={theme}
          fechaInicio={dieta.fechaInicio}  // Pasamos la fecha de inicio al hijo
        />
        </div>
        <Semanacomponente 
          weeksData={weeks} 
          setWeeksData={setWeeks} 
          selectedWeek={selectedWeek} 
          theme={theme} 
          onEditComida={handleEditComida} // Pasamos el manejador de editar comida
          onAddComida={handleAddComida} // Pasamos el manejador de agregar comida
        />
      </div>
  
      <button className={`${styles.saveButton} ${styles[theme]}`} onClick={handleSaveDieta}>Guardar Dieta</button>

      {/* Renderiza el modal de creación/edición de comida */}
      <Modalcreacioncomida
        isOpen={isModalComidaOpen}
        onClose={() => setIsModalComidaOpen(false)}
        onSave={handleSaveComida}
        initialData={initialComidaData}
      />
    </div>
  );
};

export default Pageediciondieta;
