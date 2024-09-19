import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCreacionEjercicio from './ModalCreacionEjercicio';
import ModalPrevisualizacionEjercicio from './ModalPrevisualizacionEjercicio';
import './ExerciseLista.css';

const ExerciseList = ({ theme }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [muscle, setMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [savedRoutines, setSavedRoutines] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleCreateExercise = () => {
    setCurrentExercise(null);
    setIsModalOpen(true);
  };

  const handleEditExercise = (exercise) => {
    setCurrentExercise(exercise);
    setIsModalOpen(true);
  };

  const handlePreviewExercise = (exercise) => {
    setCurrentExercise(exercise);
    setIsPreviewModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMuscleChange = (e) => {
    setMuscle(e.target.value);
  };

  const handleEquipmentChange = (e) => {
    setEquipment(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises((prevSelected) => {
      if (prevSelected.includes(exercise)) {
        return prevSelected.filter((ex) => ex !== exercise);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const handleSaveRoutine = () => {
    if (selectedExercises.length === 0) {
      toast.error('No has seleccionado ningún ejercicio para la rutina');
      return;
    }

    const routineName = prompt('Introduce un nombre para la rutina:');
    if (routineName) {
      setSavedRoutines((prevRoutines) => [
        ...prevRoutines,
        { name: routineName, exercises: selectedExercises },
      ]);
      setSelectedExercises([]);
      toast.success('Rutina guardada exitosamente');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const addExerciseToList = (newExercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    toast.success('Ejercicio creado exitosamente');
  };

  const updateExerciseInList = (updatedExercise) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise._id === updatedExercise._id ? updatedExercise : exercise
      )
    );
    toast.success('Ejercicio actualizado exitosamente');
  };

  const filteredExercises = exercises.filter((exercise) => {
    return (
      (selectedFilter === 'custom' ? exercise.creador === 'Juan Pérez' : true) &&
      (muscle ? exercise.musculo === muscle : true) &&
      (equipment ? exercise.equipamiento === equipment : true) &&
      (exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className={`ejercicios ${theme}`}>
      <ToastContainer />
      <div className="cabeza">
        <h1 className="titulo">Ejercicios</h1>
        <div className="actions">
          <button onClick={handleCreateExercise} className={`ejercicioButton ${theme}`}>Crear Ejercicio</button>
          <button 
            onClick={handleSaveRoutine} 
            className={`ejercicioButton ${theme}`}
            style={{ marginRight: '163px' }}  // Aquí se aplica el margin-right
          >
            Guardar Rutina
          </button>
        </div>
      </div>
      <div className="filters">
        <div className="left">
          <div className="toggle-buttons">
            <div
              id="todosEj"
              className={`toggle-button ${selectedFilter === 'all' ? 'selected' : ''} ${theme}`}
              onClick={() => handleFilterChange('all')}
            >
              Todos
            </div>
            <div
              id="propiosEj"
              className={`toggle-button ${selectedFilter === 'custom' ? 'selected' : ''} ${theme}`}
              onClick={() => handleFilterChange('custom')}
            >
              Propios
            </div>
          </div>
          <select value={muscle} onChange={handleMuscleChange} className={theme}>
            <option value="">Músculos</option>
            <option value="Piernas">Piernas</option>
            <option value="Pecho">Pecho</option>
            {/* Agrega más músculos aquí */}
          </select>
          <select value={equipment} onChange={handleEquipmentChange} className={theme}>
            <option value="">Equipamiento</option>
            <option value="Mancuernas">Mancuernas</option>
            <option value="Barra">Barra</option>
            {/* Agrega más equipamiento aquí */}
          </select>
        </div>
        <div className="right">
          <input
            type="text"
            placeholder="Buscar ejercicios"
            value={searchTerm}
            onChange={handleSearchChange}
            className={theme}
          />
        </div>
      </div>
      <table className={`exercises-table ${theme}`}>
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Nombre</th>
            <th>Creador</th>
            <th>Músculo</th>
            <th>Equipamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredExercises.map((exercise, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedExercises.includes(exercise)}
                  onChange={() => handleExerciseSelect(exercise)}
                />
              </td>
              <td>{exercise.nombre}</td>
              <td>{exercise.creador}</td>
              <td>{exercise.musculo}</td>
              <td>{exercise.equipamiento}</td>
              <td>
                <button onClick={() => handlePreviewExercise(exercise)} className={`action-button ${theme}`}>Previsualizar</button>
                <button onClick={() => handleEditExercise(exercise)} className={`action-button ${theme}`}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalPrevisualizacionEjercicio
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        exercise={currentExercise}
        theme={theme}
      />
      <ModalCreacionEjercicio
        isOpen={isModalOpen}
        onClose={closeModal}
        addExercise={addExerciseToList}
        updateExercise={updateExerciseInList}
        currentExercise={currentExercise}
        theme={theme}
      />
      {savedRoutines.length > 0 && (
        <div className="saved-routines">
          <h2 className="titulo">Rutinas Guardadas</h2>
          <ul>
            {savedRoutines.map((routine, index) => (
              <li key={index}>
                <strong>{routine.name}:</strong>
                <ul>
                  {routine.exercises.map((exercise, idx) => (
                    <li key={idx}>{exercise.nombre}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
