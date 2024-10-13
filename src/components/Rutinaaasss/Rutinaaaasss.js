import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { Edit3, Eye, PlusCircle, Trash } from 'lucide-react';
import CreacionDeRutina from './CreacionDeRutina';
import UnionDeRutinas from './UnionDeRutinas';
import CreacionRutinaconIA from './CreacionRutinaconIA';
import CommandPopup from '../Workspace/CommandPopup'; // Importa el CommandPopup
import './Rutinaaaasss.css';

const Rutinaaaasss = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routines, setRoutines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUnionModalOpen, setIsUnionModalOpen] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [showCommandPopup, setShowCommandPopup] = useState(false);
  
  // Estado para el nombre de la rutina
  const [routineName, setRoutineName] = useState(''); // Nuevo estado

  const location = useLocation();

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

  useEffect(() => {
    if (location.state?.keepCommandPopup) {
      setShowCommandPopup(true); // Mostrar CommandPopup si el estado lo indica
    }
  }, [location.state]);

  // Agregamos un log para verificar los cambios en routineName
  useEffect(() => {
    console.log('Routine name from CommandPopup en Rutinaaaasss:', routineName);
    // Si se ha establecido un nombre de rutina, muestra este log
    if (routineName) {
      console.log('Nombre de rutina actualizado en Rutinaaaasss:', routineName);
    }
  }, [routineName]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
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

  const handleMouseEnter = (text, e) => {
    const rect = e.target.getBoundingClientRect(); // Para calcular la posición
    setTooltip({
      visible: true,
      text: text,
      x: rect.left + window.scrollX + rect.width / 2, // Centramos el tooltip
      y: rect.top + window.scrollY - 30, // Ajustamos la altura por encima del icono
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handlePreviewRoutine = (routine) => {
    setCurrentRoutine(routine);
    setIsPreviewOpen(true);
  };

  const handleMergeRoutine = (routine) => {
    setCurrentRoutine(routine);
    setIsUnionModalOpen(true);
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

  const createCombinedRoutine = (newRoutine) => {
    setCurrentRoutine(newRoutine);
    setIsUnionModalOpen(false);
    setIsModalOpen(true);
  };

  // Nueva función para eliminar rutina
  const handleDeleteRoutine = async (routineId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      try {
        const response = await fetch(`/api/rutinadays/routines/${routineId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Actualizamos la lista de rutinas, removiendo la eliminada
          setRoutines(routines.filter(routine => routine._id !== routineId));
        } else {
          console.error('Error eliminando rutina');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const filteredRoutines = routines.filter(routine =>
    routine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`Rutinaaaasss-rutina-container ${theme}`}>
      <div className="Rutinaaaasss-actions"style={{
              display: 'flex',
              flexDirection: 'row',
              width: '60%',
              alignContent: 'left',
            }}>
      <h1>Rutinas</h1>
      <button className={`Rutinaaaasss-btn-create ${theme}`} onClick={handleCreateRoutine}style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '8px 8px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.3s ease',
              marginLeft: '100px',
              height: '44px',
              marginTop: '8px',
            }}>Crear Rutina</button>
        <button className={`Rutinaaaasss-btn-create-ai ${theme}`} onClick={handleCreateRoutineWithAI}style={{
              background:'var(--create-button-bg)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '8px 8px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.3s ease',
              marginleft: '65%',
              height: '44px',
              marginTop: '8px',
            }}>Crear Rutina con IA</button>
      </div>
      <input
        type="text"
        placeholder="Buscar rutinas"
        value={searchTerm}
        onChange={handleSearch}
        className={`Rutinaaaasss-search-input ${theme}`}
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
      <table className={`Rutinaaaasss-routines-table ${theme}`} 
        style={{ 
          borderRadius: '10px', 
          borderCollapse: 'separate', 
          borderSpacing: '0', 
          width: '100%', 
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead style={{ 
            backgroundColor: theme === 'dark' ? 'rgb(68, 68, 68)' : 'rgb(38 93 181)',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
        }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Descripción</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tags/Categorías</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Notas Adicionales</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutines.map((routine, index) => (
            <tr key={index} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') 
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') 
            }}>
              <td style={{ padding: '12px' }}>{routine.name}</td>
              <td style={{ padding: '12px' }}>{routine.description}</td>
              <td style={{ padding: '12px' }}>{routine.tags.join(', ')}</td>
              <td style={{ padding: '12px' }}>{routine.notes}</td>
              <td style={{ padding: '12px' }}>
                <div className="Rutinaaaasss-actions-icons" style={{ display: 'flex', gap: '10px' }}>
                  <Edit3 size={18}
                    className="Rutinaaaasss-icon" 
                    onMouseEnter={(e) => handleMouseEnter('Editar Rutina', e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleEditRoutine(routine)} 
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                      padding: '7px',
                      margin: '0px',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                  <Eye size={18}
                    className="Rutinaaaasss-icon" 
                    onMouseEnter={(e) => handleMouseEnter('Previsualizar Rutina', e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handlePreviewRoutine(routine)} 
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                      padding: '7px',
                      margin: '0px',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                  <PlusCircle size={18}
                    className="Rutinaaaasss-icon" 
                    onMouseEnter={(e) => handleMouseEnter('Unir Rutina', e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleMergeRoutine(routine)} 
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                      padding: '7px',
                      margin: '0px',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                  <Trash size={18}
                    className="Rutinaaaasss-icon" 
                    onMouseEnter={(e) => handleMouseEnter('Eliminar Rutina', e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleDeleteRoutine(routine._id)} // Implementamos la función de eliminar
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                      padding: '7px',
                      margin: '0px',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="Rutinaaaasss-modal"
        unmountOnExit
      >
        <CreacionDeRutina
          onClose={closeModal}
          onAddRoutine={addRoutine}
          onUpdateRoutine={updateRoutine}
          routine={currentRoutine}
          theme={theme}
          routineName={routineName} // Pasamos el nombre de la rutina como prop
        />
      </CSSTransition>
      
      <CSSTransition
        in={isIAModalOpen}
        timeout={300}
        classNames="Rutinaaaasss-modal"
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
        classNames="Rutinaaaasss-modal"
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
        classNames="Rutinaaaasss-modal"
        unmountOnExit
      >
        {currentRoutine && (
          <div className="Rutinaaaasss-preview-modal">
            <div className={`Rutinaaaasss-preview-modal-content ${theme}`}>
              <span className="Rutinaaaasss-preview-close" onClick={closePreview}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>&times;</span>
              <h2>Previsualización de Rutina</h2>
              <p><strong>Nombre:</strong> {currentRoutine.name}</p>
              <p><strong>Descripción:</strong> {currentRoutine.description}</p>
              <p><strong>Tags:</strong> {currentRoutine.tags.join(', ')}</p>
              <p><strong>Notas Adicionales:</strong> {currentRoutine.notes}</p>
              <h3>Ejercicios/Actividades</h3>
              <table className={`Rutinaaaasss-table ${theme}`}>
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

      {/* Renderiza el CommandPopup si showCommandPopup es true */}
      {showCommandPopup && <CommandPopup setRoutineName={(name) => {
  console.log('setRoutineName en Rutinaaaasss llamado con:', name);
  setRoutineName(name);  // Actualizamos el estado routineName
}} />}

      {tooltip.visible && (
        <div 
          className="tooltip" 
          style={{
            position: 'absolute', 
            top: tooltip.y, 
            left: tooltip.x, 
            background: theme === 'dark' ? 'black' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default Rutinaaaasss;
