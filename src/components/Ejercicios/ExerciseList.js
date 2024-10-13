import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCreacionEjercicio from './ModalCreacionEjercicio';
import ModalPrevisualizacionEjercicio from './ModalPrevisualizacionEjercicio';
import './ExerciseLista.css';
import { Eye, Edit } from 'lucide-react'; // Importamos los íconos

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
      <div className="cabeza" style={{
              display: 'flex',
              flexDirection: 'row', 
              gap: '10px',
              width: '60%',
              alignContent: 'left',
            }}>
        <h1 className="titulo">Ejercicios</h1>
        <div className="actions" style={{
              display: 'flex',
              flexDirection: 'row', 
              gap: '10px',
              marginTop: '20px',
              marginLeft: '35px',
              width: 'fit-content',}}>
          <button onClick={handleCreateExercise} className={`ejercicioButton ${theme}`} 
          style={{
            background:'var(--create-button-bg)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
          >
            Crear Ejercicio
          </button>
          <button 
            onClick={handleSaveRoutine} 
            style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
              marginRight: '163px'
            }}
            className={`ejercicioButton ${theme}`}
// Aquí se aplica el margin-right
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
  style={{
    backgroundColor: selectedFilter === 'all' ? '#003366' : '#99ccff', // Azul oscuro si está seleccionado, azul claro si no
    color: selectedFilter === 'all' ? 'white' : 'black', // Texto blanco si está seleccionado, negro si no
    fontWeight: selectedFilter === 'all' ? 'bold' : 'normal', // Negrita si está seleccionado
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }}
  onClick={() => handleFilterChange('all')}
>
  Todos
</div>

<div
  id="propiosEj"
  style={{
    backgroundColor: selectedFilter === 'custom' ? '#003366' : '#99ccff', // Azul oscuro si está seleccionado, azul claro si no
    color: selectedFilter === 'custom' ? 'white' : 'black', // Texto blanco si está seleccionado, negro si no
    fontWeight: selectedFilter === 'custom' ? 'bold' : 'normal', // Negrita si está seleccionado
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }}
  onClick={() => handleFilterChange('custom')}
>
  Propios
</div>

          </div>
          <select value={muscle} onChange={handleMuscleChange} className={theme}
          style={{
            background: '#7d7d7d00',
            border: '1px solid var(--button-border)',
            padding: '5px',
            height: '44px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s',
            textAlign: 'left',
          }}>
            <option value="">Músculos</option>
            <option value="Piernas">Piernas</option>
            <option value="Pecho">Pecho</option>
            {/* Agrega más músculos aquí */}
          </select>
          <select value={equipment} onChange={handleEquipmentChange} className={theme}
          style={{
            background: '#7d7d7d00',
            border: '1px solid var(--button-border)',
            padding: '5px',
            height: '44px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s',
            textAlign: 'left',
          }}>
            <option value="">Equipamiento</option>
            <option value="Mancuernas">Mancuernas</option>
            <option value="Barra">Barra</option>
            {/* Agrega más equipamiento aquí */}
          </select>
        </div>
        <div className="right" style={{
              width: '60%',
              paddingRight: '20px',
            }}>
          <input
            type="text"
            placeholder="Buscar ejercicios"
            value={searchTerm}
            onChange={handleSearchChange}
            className={theme}
            style={{
              background: 'var(--search-button-bg)',
              border: '1px solid var(--button-border)',
              padding: '5px',
              height: '44px',
              width: '100%',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s',
              textAlign: 'left',
            }}
          />
        </div>
      </div>
      <table className={`exercises-table ${theme}`} 
  style={{ 
    borderRadius: '10px', 
    borderCollapse: 'separate', 
    borderSpacing: '0', 
    width: '100%', 
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '0',
  }}
>
  <thead style={{ 
      backgroundColor: theme === 'dark' ? '#333' : '#265db5',
      borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
  }}>
    <tr>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Seleccionar</th>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Nombre</th>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Creador</th>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Músculo</th>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Equipamiento</th>
      <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {filteredExercises.map((exercise, index) => (
      <tr 
        key={index} 
        style={{ 
          backgroundColor: theme === 'dark' 
            ? (index % 2 === 0 ? '#333' : '#444') // Colores alternos en modo oscuro
            : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Colores alternos en modo claro
        }}
      >
        <td style={{ padding: '12px' }}>
          <input
            type="checkbox"
            checked={selectedExercises.includes(exercise)}
            onChange={() => handleExerciseSelect(exercise)}
            style={{
              background: 'var(--search-button-bg)',
              border: '1px solid var(--button-border)',
              padding: '5px',
              height: '44px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s',
              textAlign: 'left',
            }}
          />
        </td>
        <td style={{ padding: '12px' }}>{exercise.nombre}</td>
        <td style={{ padding: '12px' }}>{exercise.creador}</td>
        <td style={{ padding: '12px' }}>{exercise.musculo}</td>
        <td style={{ padding: '12px' }}>{exercise.equipamiento}</td>
        <td style={{ padding: '15px',
          display: 'flex',
          height: '75.33px',
         }}>
          <button 
            onClick={() => handlePreviewExercise(exercise)} 
            className={`action-button ${theme}`} 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
              padding: '7px',
              margin: '0px',
            }}
          >
                <Eye size={18}
                  onClick={() => handlePreviewExercise(exercise)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                />
          </button>
          <button 
            onClick={() => handleEditExercise(exercise)} 
            className={`action-button ${theme}`} 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
              padding: '7px',
              margin: '0px',
            }}
          >
                <Edit size={18}
                  onClick={() => handleEditExercise(exercise)}
                  style={{ cursor: 'pointer' }}
                />
          </button>
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
