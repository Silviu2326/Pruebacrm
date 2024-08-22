// Ruta: C:\Users\carlo\Downloads\Pruebacrm\src\components\Rutinaaasss\Rutinaaaasss.js

import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import CreacionDeRutina from './CreacionDeRutina';
import UnionDeRutinas from './UnionDeRutinas';
import CreacionRutinaconIA from './CreacionRutinaconIA'; // Importamos el nuevo componente
import './Rutinaaaasss.css'; // Importar el archivo CSS con el nombre correcto

const Rutinaaaasss = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routines, setRoutines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIAModalOpen, setIsIAModalOpen] = useState(false); // Nuevo estado para el modal de IA
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUnionModalOpen, setIsUnionModalOpen] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch('/api/rutinadays/routines');
        const data = await response.json();
        setRoutines(data);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleCreateRoutine = () => {
    setCurrentRoutine(null); // Clear current routine to create a new one
    setIsModalOpen(true);
  };

  const handleCreateRoutineWithAI = () => {
    setIsIAModalOpen(true); // Abrir el modal de IA
  };

  const handleEditRoutine = (routine) => {
    setCurrentRoutine(routine);
    setIsModalOpen(true);
  };

  const handlePreviewRoutine = (routine) => {
    setCurrentRoutine(routine);
    setIsPreviewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeIAModal = () => {
    setIsIAModalOpen(false); // Cerrar el modal de IA
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const closeUnionModal = () => {
    setIsUnionModalOpen(false);
  };

  const addRoutine = (newRoutine) => {
    setRoutines([...routines, newRoutine]);
    closeModal();
  };

  const updateRoutine = (updatedRoutine) => {
    setRoutines(routines.map(routine => routine._id === updatedRoutine._id ? updatedRoutine : routine));
    closeModal();
  };

  const handleMergeRoutine = (routine) => {
    setCurrentRoutine(routine);
    setIsUnionModalOpen(true);
  };

  const createCombinedRoutine = (newRoutine) => {
    setCurrentRoutine(newRoutine);
    setIsUnionModalOpen(false);
    setIsModalOpen(true);
  };

  const filteredRoutines = routines.filter(routine =>
    routine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`rutina-container ${theme}`}>
      <h1>Rutinas</h1>
      <div className="actions">
        <button className={`btn-create ${theme}`} onClick={handleCreateRoutine}>Crear Rutina</button>
        <button className={`btn-create-ai ${theme}`} onClick={handleCreateRoutineWithAI}>Crear Rutina con IA</button>
      </div>
      <input
        type="text"
        placeholder="Buscar rutinas"
        value={searchTerm}
        onChange={handleSearch}
        className={`search-input ${theme}`}
      />
      <table className={`routines-table ${theme}`}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tags/Categorías</th>
            <th>Notas Adicionales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutines.map((routine, index) => (
            <tr key={index}>
              <td>{routine.name}</td>
              <td>{routine.description}</td>
              <td>{routine.tags.join(', ')}</td>
              <td>{routine.notes}</td>
              <td>
                <div className="dropdown">
                  <button className={`action-button ${theme}`} onClick={() => handleDropdownToggle(index)}>⋮</button>
                  {dropdownOpen === index && (
                    <div className={`dropdown-content ${theme}`}>
                      <button onClick={() => handleEditRoutine(routine)}>Editar</button>
                      <button onClick={() => handlePreviewRoutine(routine)}>Previsualizar</button>
                      <button onClick={() => handleMergeRoutine(routine)}>Unir Rutina</button>
                      <button>Eliminar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <CreacionDeRutina
          onClose={closeModal}
          onAddRoutine={addRoutine}
          onUpdateRoutine={updateRoutine}
          routine={currentRoutine}
          theme={theme}
        />
      </CSSTransition>
      <CSSTransition
        in={isIAModalOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <CreacionRutinaconIA
          onClose={closeIAModal}
          theme={theme}
        />
      </CSSTransition>
      <CSSTransition
        in={isUnionModalOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <UnionDeRutinas
          routines={routines}
          currentRoutine={currentRoutine}
          onClose={closeUnionModal}
          onCreateCombinedRoutine={createCombinedRoutine}
          theme={theme}
        />
      </CSSTransition>
      <CSSTransition
        in={isPreviewOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        {currentRoutine && (
          <div className="preview-modal">
            <div className={`preview-modal-content ${theme}`}>
              <span className="preview-close" onClick={closePreview}>&times;</span>
              <h2>Previsualización de Rutina</h2>
              <p><strong>Nombre:</strong> {currentRoutine.name}</p>
              <p><strong>Descripción:</strong> {currentRoutine.description}</p>
              <p><strong>Tags:</strong> {currentRoutine.tags.join(', ')}</p>
              <p><strong>Notas Adicionales:</strong> {currentRoutine.notes}</p>
              <h3>Ejercicios/Actividades</h3>
              <table className={`table ${theme}`}>
                <thead>
                  <tr>
                    <th className={theme}>Ejercicio</th>
                    <th className={theme}>Repeticiones</th>
                    <th className={theme}>Peso o %RP</th>
                    <th className={theme}>Descanso</th>
                    <th className={theme}>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoutine.exercises.map((exercise, index) => (
                    <tr key={index}>
                      <td className={theme}>{exercise.name}</td>
                      <td className={theme}>{exercise.repetitions}</td>
                      <td className={theme}>{exercise.weight}</td>
                      <td className={theme}>{exercise.rest}</td>
                      <td className={theme}>{exercise.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CSSTransition>
    </div>
  );
};

export default Rutinaaaasss;
