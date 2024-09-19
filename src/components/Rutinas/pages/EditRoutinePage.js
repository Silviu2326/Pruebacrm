import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import AppNavbar from '../Centroderutinas/Navbar';
import WeeklyView from '../Centroderutinas/WeeklyPlanner';
import Componentedeexcel from '../Centroderutinas/Componentedeexcel'; // Importar Componentedeexcel
import VistaCalendario from '../Centroderutinas/Vistacalendario/VistaCalendario';
import ModalSemanaExcel from '../Centroderutinas/ModalSemanaExcel';
import VistaCSVmodalsemanaaa from '../Centroderutinas/VistaCSVmodalsemanaaa';
import Modaltransferenciarutinas from '../Centroderutinas/Modaltransferenciarutinas';
import styles from './EditRoutinePage.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const EditRoutinePage = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [routine, setRoutine] = useState({
    _id: id,
    nombre: '',
    semanas: [],
    fechaInicio: '',
  });

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Estado para alternar entre WeeklyView y Componentedeexcel
  const [showWeeklyView, setShowWeeklyView] = useState(true);

  const navbarRef = useRef(null);
  const editContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (navbarRef.current && editContainerRef.current) {
      const navbarRightMargin = window.getComputedStyle(navbarRef.current).marginRight;
      editContainerRef.current.style.marginRight = navbarRightMargin;
    }
  }, []);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routines/${id}`);
        console.log('Fetched routine from API:', response.data);
        if (!response.data.semanas.length) {
          const { duracion, fechaInicio } = location.state || {};
          if (duracion && fechaInicio) {
            const weeks = generateWeeks(duracion, fechaInicio);
            console.log('Generated weeks from location state:', weeks);
            response.data.semanas = weeks;
            response.data.fechaInicio = fechaInicio;
          }
        }
        setRoutine(response.data);
      } catch (error) {
        console.error('Error fetching routine:', error);
      }
    };
    fetchRoutine();
  }, [id, location.state]);

  const generateWeeks = (duracion, fechaInicio) => {
    const numWeeks = parseInt(duracion, 10);
    const startDate = new Date(fechaInicio);
    const weeks = [];
    for (let i = 0; i < numWeeks; i++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + i * 7);
      weeks.push({
        id: `week${i + 1}`,
        nombre: `Semana ${i + 1}`,
        dias: Array.from({ length: 7 }, (_, index) => ({
          id: `day${index + 1}`,
          nombre: `Día ${index + 1}`,
          sesiones: [],
        })),
        scheme: 'Foundation',
        intensity: '1/5',
      });
    }
    return weeks;
  };

  const handleSaveExcelRoutine = (weekData) => {
    console.log('Saving week data from modal:', weekData);
    const newRoutine = { ...routine };
    const updatedWeek = newRoutine.semanas[selectedWeekIndex];
  
    Object.keys(weekData).forEach((day) => {
      const dayData = weekData[day];
      const dayIndex = updatedWeek.dias.findIndex(d => d.nombre.toLowerCase() === day.toLowerCase());
      if (dayIndex !== -1) {
        const sessions = dayData.map((row, index) => {
          const sets = row.sets || [{ reps: row.Repeticiones, percent: row.Peso, rest: row.Descanso, notes: row.Nota }];
          return {
            id: `session${Math.random()}`,
            nombre: `Sesión ${index + 1}`,
            actividades: [{
              id: `activity${Math.random()}`,
              name: row.Ejercicio,
              type: 'Workout',
              mode: 'Set Mode',
              exercises: [{
                id: `exercise${Math.random()}`,
                nombre: row.Ejercicio,
                sets: sets.map((set, setIndex) => ({
                  set: setIndex + 1,
                  reps: set.reps,
                  percent: set.percent,
                  rest: set.rest,
                  notes: set.notes
                }))
              }]
            }]
          };
        });
        updatedWeek.dias[dayIndex].sesiones = sessions;
      }
    });
  
    console.log('Updated routine with week data:', newRoutine);
    setRoutine(newRoutine);
  };
  
  const handleAddDay = () => {
    const newDay = { id: `day${routine.semanas[selectedWeekIndex].dias.length + 1}`, nombre: `Día ${routine.semanas[selectedWeekIndex].dias.length + 1}`, sesiones: [] };
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].dias.push(newDay);
    setRoutine(newRoutine);
  };

  const handleAddSession = (dayIdOrUpdatedDay) => {
    const newRoutine = { ...routine };

    if (typeof dayIdOrUpdatedDay === 'object') {
      const updatedDias = newRoutine.semanas[selectedWeekIndex].dias.map(day =>
        day.id === dayIdOrUpdatedDay.id ? dayIdOrUpdatedDay : day
      );
      newRoutine.semanas[selectedWeekIndex].dias = updatedDias;
    } else {
      const dayId = dayIdOrUpdatedDay;
      const newSession = { id: `session${Math.random()}`, nombre: `Sesión ${routine.semanas[selectedWeekIndex].dias.find(day => day.id === dayId).sesiones.length + 1}`, actividades: [] };
      const updatedDias = newRoutine.semanas[selectedWeekIndex].dias.map(day => {
        if (day.id === dayId) {
          return { ...day, sesiones: [...day.sesiones, newSession] };
        }
        return day;
      });
      newRoutine.semanas[selectedWeekIndex].dias = updatedDias;
    }

    setRoutine(newRoutine);
  };

  const handleAddActivity = (sessionId) => {
    const newActivity = { id: `activity${Math.random()}`, name: 'Nueva Actividad', type: 'Workout', mode: 'Set Mode', exercises: [] };
    const newRoutine = { ...routine };
    const updatedDias = newRoutine.semanas[selectedWeekIndex].dias.map(day => {
      return {
        ...day,
        sesiones: day.sesiones.map(session => {
          if (session.id === sessionId) {
            return { ...session, actividades: [...session.actividades, newActivity] };
          }
          return session;
        }),
      };
    });
    newRoutine.semanas[selectedWeekIndex].dias = updatedDias;
    setRoutine(newRoutine);
  };

  const handleAddExercise = (activityId) => {
    const newExercise = { id: `exercise${Math.random()}`, nombre: 'Nuevo Ejercicio', tipo: 'Compuesto', sets: [{ set: 1, reps: '10', percent: '70%', rest: '60s', notes: '' }] };
    const newRoutine = { ...routine };
    const updatedDias = newRoutine.semanas[selectedWeekIndex].dias.map(day => {
      return {
        ...day,
        sesiones: day.sesiones.map(session => {
          return {
            ...session,
            actividades: session.actividades.map(activity => {
              if (activity.id === activityId) {
                return { ...activity, exercises: [...activity.exercises, newExercise] };
              }
              return activity;
            }),
          };
        }),
      };
    });
    newRoutine.semanas[selectedWeekIndex].dias = updatedDias;
    setRoutine(newRoutine);
  };

  const handleSchemeChange = (selectedScheme) => {
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].scheme = selectedScheme;
    setRoutine(newRoutine);
  };

  const handleIntensityChange = (selectedIntensity) => {
    const newRoutine = { ...routine };
    newRoutine.semanas[selectedWeekIndex].intensity = selectedIntensity;
    setRoutine(newRoutine);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    console.log('Edit mode toggled:', !isEditing);
  };

  const handleSelectWeek = (weekIndex) => {
    setSelectedWeekIndex(weekIndex);
    console.log('Selected week index:', weekIndex);
  };

  const handleAddWeek = () => {
    const newWeek = {
      id: `week${routine.semanas.length + 1}`,
      nombre: `Semana ${routine.semanas.length + 1}`,
      dias: [
        { id: 'day1', nombre: 'Día 1', sesiones: [] },
        { id: 'day2', nombre: 'Día 2', sesiones: [] },
        { id: 'day3', nombre: 'Día 3', sesiones: [] },
      ],
      scheme: 'Foundation',
      intensity: '1/5',
    };
    const newRoutine = { ...routine };
    newRoutine.semanas.push(newWeek);
    setRoutine(newRoutine);
    setSelectedWeekIndex(newRoutine.semanas.length - 1);
  };

  const handleSaveAndReturn = async () => {
    try {
      console.log('Saving routine:', routine);
      await axios.put(`${API_BASE_URL}/api/routines/${routine._id}`, routine);
      console.log('Routine saved successfully.');
      navigate('/crear-rutina');
    } catch (error) {
      console.error('Error saving routine:', error);
    }
  };

  const handleLoadRoutine = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      console.log('Loaded JSON:', json);
      setRoutine(json);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://emoji-css.afeld.me/emoji.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    console.log('Routine state updated:', routine);
  }, [routine]);

  const exportToCSV = () => {
    const csvData = [];
    routine.semanas.forEach((week, weekIndex) => {
      week.dias.forEach((day, dayIndex) => {
        day.sesiones.forEach((session, sessionIndex) => {
          session.actividades.forEach((activity, activityIndex) => {
            csvData.push({
              Week: `Week ${weekIndex + 1}`,
              Day: `Day ${dayIndex + 1}`,
              Session: `Session ${sessionIndex + 1}`,
              Activity: `Activity ${activityIndex + 1}`,
              Name: activity.name,
            });
          });
        });
      });
    });
    const csvLink = document.createElement('a');
    const csvBlob = new Blob([Papa.unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    csvLink.href = URL.createObjectURL(csvBlob);
    csvLink.setAttribute('download', 'routine.csv');
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
  };

  const getWeekDataForModal = () => {
    const weekData = {};
    routine.semanas[selectedWeekIndex]?.dias.forEach((day, dayIndex) => {
      const exercises = [];
      day.sesiones.forEach(session => {
        session.actividades.forEach(activity => {
          activity.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              exercises.push({
                Ejercicio: exercise.nombre,
                Repeticiones: set.reps,
                Peso: set.percent,
                Descanso: set.rest,
                Nota: set.notes
              });
            });
          });
        });
      });
      weekData[`Día ${dayIndex + 1}`] = exercises;
    });
    return weekData;
  };

  return (
    <div className={`${styles.Contenedorrutinasmain} ${styles[theme]}`}>
      <div className={`${styles.topButtons} ${styles[theme]}`}>
        <button onClick={handleSaveAndReturn} className={`${styles.saveButtonTop} ${styles[theme]}`}>⮐ Save and Return</button>
        <button onClick={exportToCSV} className={`${styles.saveButtonTop} ${styles[theme]}`}>Save as CSV</button>
        <button onClick={() => setShowModal(true)} className={`${styles.saveButtonTop} ${styles[theme]}`}>Semana Excel</button>
        <button onClick={() => setShowCSVModal(true)} className={`${styles.saveButtonTop} ${styles[theme]}`}>Vista de CSV de toda la semana</button>
      </div>
      
      <div className={`${styles.topContainer} ${styles[theme]}`}>
        <div className={`${styles.calendarContainer} ${styles[theme]}`}>
          <VistaCalendario 
            semanas={routine.semanas} 
            onSelectWeek={handleSelectWeek} 
            onAddWeek={handleAddWeek} 
            selectedWeekIndex={selectedWeekIndex}
            fechaInicio={routine.fechaInicio}
            theme={theme}  // Asegúrate de que el tema se está pasando aquí
          />
        </div>
        <div className={`${styles.headerContainer} ${styles[theme]}`}>
          <div className={`${styles.weekEdit} ${styles[theme]}`}>
            <h2 className={`${styles.weekHeader} ${styles[theme]}`}>{routine.semanas[selectedWeekIndex]?.nombre}</h2>
            {isEditing && (
              <div className={`${styles.navbar} ${styles[theme]}`} ref={navbarRef}>
                <AppNavbar 
                  onAddDay={handleAddDay}
                  onSchemeChange={handleSchemeChange}
                  onIntensityChange={handleIntensityChange}
                  scheme={routine.semanas[selectedWeekIndex]?.scheme || 'Foundation'}
                  intensity={routine.semanas[selectedWeekIndex]?.intensity || '1/5'}
                  days={routine.semanas[selectedWeekIndex]?.dias || []}
                  theme={theme} // Asegúrate de que el tema se está pasando aquí
              />
              </div>
            )}
          </div>
          <div className={`${styles.editButtons} ${styles[theme]}`}>
            <button onClick={toggleEditMode} className={`${styles.editButton} ${styles[theme]}`}>
              {isEditing ? '📩 Save Changes' : '✏️ Edit Routine'}
            </button>
            <label htmlFor="file-upload" className={`${styles.loadButton} ${styles[theme]}`}>
              <i className="em em-paperclip" aria-label="PAPERCLIP"></i> Upload Routine
            </label>
            <input id="file-upload" type="file" accept="application/json" onChange={handleLoadRoutine} className={styles.fileInput} />
            <button 
              onClick={() => setShowTransferModal(true)} 
              className={`${styles.saveButtonTop} ${styles[theme]}`}
            >
              Transferir archivos a otra rutina
            </button>
          </div>
        </div>
      </div>
      
      {/* Botón para alternar entre WeeklyView y Componentedeexcel */}
      <div className={`${styles.viewToggleContainer} ${styles[theme]}`}>
        <button onClick={() => setShowWeeklyView(!showWeeklyView)} className={`${styles.saveButtonTop} ${styles[theme]}`}>
          {showWeeklyView ? 'Ver Excel' : 'Ver Vista Semanal'}
        </button>
      </div>
      
      <div className={`${styles.container} ${styles[theme]}`}>
        {showWeeklyView ? (
          <WeeklyView 
            routine={routine}
            selectedWeekIndex={selectedWeekIndex}
            setRoutine={setRoutine}
            onAddDay={handleAddDay}
            onAddSession={handleAddSession}
            onAddActivity={handleAddActivity}
            onAddExercise={handleAddExercise}
            onSchemeChange={handleSchemeChange}
            onIntensityChange={handleIntensityChange}
            isEditing={isEditing}
            scheme={routine.semanas[selectedWeekIndex]?.scheme || ''}
            intensity={routine.semanas[selectedWeekIndex]?.intensity || '1/5'}
            theme={theme}
          />
        ) : (
          <Componentedeexcel />
        )}
      </div>
      
      <ModalSemanaExcel 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSave={handleSaveExcelRoutine} 
        weekData={getWeekDataForModal()} 
        theme={theme}
      />
      <VistaCSVmodalsemanaaa show={showCSVModal} handleClose={() => setShowCSVModal(false)} routine={routine} />
      <Modaltransferenciarutinas 
        show={showTransferModal} 
        onClose={() => setShowTransferModal(false)}
        days={routine.semanas[selectedWeekIndex]?.dias || []}
        theme={theme}
      />
    </div>
  );  
};

export default EditRoutinePage;
