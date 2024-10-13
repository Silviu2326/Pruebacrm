import React, { useState, useEffect } from 'react';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react'; // Íconos de Lucide
import './PeriodoCard.css'; // Asegúrate de tener este archivo actualizado para los estilos personalizados
import PeriodoCardModificar from './PeriodoCardModificar'; // Importamos el componente del modal de modificar
import PeriodoCardCondicional from './PeriodoCardCondicional'; // Importamos el componente del modal condicional

const PeriodoCard = ({ periodo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]); // Estado para los ejercicios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Estados para controlar los popups (modificar y condicional)
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showConditionalPopup, setShowConditionalPopup] = useState(false);

  // Efecto para cargar los ejercicios al montar el componente
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/exercises');
        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }
        const data = await response.json();
        
        // Mapear los datos recibidos al formato necesario
        const formattedExercises = data.map((exercise) => ({
          id: exercise._id,
          name: exercise.nombre,
          conditional: false, // Aquí puedes personalizar si es condicional o no
        }));
        setExercises(formattedExercises);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los ejercicios');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filtrar ejercicios según el término de búsqueda
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleConditional = (id) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, conditional: !exercise.conditional }
          : exercise
      )
    );
  };

  // Función para manejar el clic en "Modificar"
  const handleModifyClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModifyPopup(true); // Abrir el popup de modificar
  };

  // Función para manejar el clic en "Condicional"
  const handleConditionalClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowConditionalPopup(true); // Abrir el popup condicional
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const startWeek = periodo.start.weekIndex + 1;
  const startDay = `Día ${periodo.start.dayIndex + 1}`;
  const endWeek = periodo.end.weekIndex + 1;
  const endDay = `Día ${periodo.end.dayIndex + 1}`;

  // Mostrar un mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando ejercicios...</div>;
  }

  // Mostrar un mensaje de error si hubo un problema en la solicitud
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="PeriodoCard-container">
      <h3 className="PeriodoCard-title">
        Semana {startWeek} - Semana {endWeek}
      </h3>
      <div className="PeriodoCard-search-container">
        <Search size={20} className="PeriodoCard-search-icon" />
        <input
          type="text"
          className="PeriodoCard-search-input"
          placeholder="Buscar ejercicios..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="PeriodoCard-exercise-list">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="PeriodoCard-exercise-item">
            <span className="PeriodoCard-exercise-name">{exercise.name}</span>
            <button
              className="PeriodoCard-btn-modify"
              onClick={() => handleModifyClick(exercise)} // Mostrar popup de modificar
            >
              <Edit size={16} /> Modificar
            </button>
            <button
              className={`PeriodoCard-btn-conditional ${
                exercise.conditional ? 'PeriodoCard-btn-remove' : 'PeriodoCard-btn-add'
              }`}
              onClick={() => handleConditionalClick(exercise)} // Mostrar popup condicional
            >
              {exercise.conditional ? (
                <Trash2 size={16} />
              ) : (
                <PlusCircle size={16} />
              )}
              {exercise.conditional ? 'Quitar Condicional' : 'Hacer Condicional'}
            </button>
          </div>
        ))}
      </div>

      {/* Mostrar el popup de modificar cuando esté activado */}
      {showModifyPopup && selectedExercise && (
        <PeriodoCardModificar
          exercise={selectedExercise}
          onSave={(updatedExercise) => {
            setExercises((prevExercises) =>
              prevExercises.map((exercise) =>
                exercise.id === updatedExercise.id ? updatedExercise : exercise
              )
            );
            setShowModifyPopup(false); // Cerrar el popup
          }}
          onCancel={() => setShowModifyPopup(false)} // Cerrar el popup
        />
      )}

      {/* Mostrar el popup de condicional cuando esté activado */}
      {showConditionalPopup && selectedExercise && (
        <PeriodoCardCondicional
          exercise={selectedExercise}
          onApply={(updatedExercise) => {
            setExercises((prevExercises) =>
              prevExercises.map((exercise) =>
                exercise.id === updatedExercise.id ? updatedExercise : exercise
              )
            );
            setShowConditionalPopup(false); // Cerrar el popup
          }}
          onCancel={() => setShowConditionalPopup(false)} // Cerrar el popup
        />
      )}
    </div>
  );
};

export default PeriodoCard;
