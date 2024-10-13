import React, { useState, useEffect } from 'react';
import './CreacionDeRutina.css';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';
import { trash } from 'react-icons-kit/fa/trash';

const CreacionDeRutina = ({ onClose, onAddRoutine, onUpdateRoutine, routine, theme, routineName }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [tableData, setTableData] = useState([['', '', '', '', '']]);
  const [attributes, setAttributes] = useState(['Repeticiones', 'Peso', 'Descanso']);
  const [showButton, setShowButton] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data.map(exercise => exercise.nombre));
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();

    if (routine) {
      setTableData(routine.exercises.map(e => [e.name, e.repetitions, e.weight, e.rest, e.notes]));
      setName(routine.name);
      setDescription(routine.description);
      setTags(routine.tags);
      setNotes(routine.notes);
    }
  }, [routine]);
  useEffect(() => {
    if (routineName) {
      console.log("Nombre de rutina recibido en CreacionDeRutina:", routineName);
      setName(routineName);  // Establece el nombre de la rutina si routineName está disponible
    }
  }, [routineName]);
    
  // Actualizamos el nombre cuando recibimos la prop routineName
  useEffect(() => {
    if (routineName) {
      setName(routineName);
    }
  }, [routineName]);

  const predefinedTags = ['Upper body', 'Lower body', 'Push', 'Pull', 'Legs'];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleInputChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][columnIndex] = value;
    setTableData(updatedData);

    if (columnIndex === 0 && value.length > 1) {
      const filteredSuggestions = exercises.filter(exercise => typeof exercise === 'string' && exercise.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleFocus = (rowIndex, columnIndex) => {
    setFocusedCell({ rowIndex, columnIndex });
  };

  const handleBlur = () => {
    setFocusedCell(null);
    setSuggestions([]);
  };

  const handleSuggestionClick = (rowIndex, suggestion) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][0] = suggestion;
    setTableData(updatedData);
    setSuggestions([]);
  };

  const addRow = () => {
    setTableData([...tableData, ['', '', '', '', '']]);
  };

  const deleteRow = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRoutine = {
      name,
      description,
      tags,
      notes,
      exercises: tableData.map(row => ({
        name: row[0],
        attribute1: row[1],
        attribute2: row[2],
        attribute3: row[3],
      }))
    };

    try {
      const response = routine && routine._id
        ? await fetch(`/api/rutinadays/routines/${routine._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoutine)
          })
        : await fetch('/api/rutinadays/routines', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoutine)
          });

      if (response.ok) {
        const result = await response.json();
        routine && routine._id ? onUpdateRoutine(result) : onAddRoutine(result);
      } else {
        console.error("Error saving routine");
      }
    } catch (error) {
      console.error("Error saving routine:", error);
    }
  };

  const handleAttributeChange = (index, newAttribute) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = newAttribute;
    setAttributes(updatedAttributes);
  };

  // Lista de opciones traducidas al español
  const attributeOptions = [
    'Repeticiones', 'Peso', 'Descanso', 'Tempo', 'Esfuerzo Percibido (RPE)', 
    'RPM', 'Repeticiones en Reserva (RIR)', 'Tiempo', 'Velocidad', 'Cadencia', 
    'Distancia', 'Altura', 'Calorías', 'Ronda'
  ];

  return (
    <div className={`creacion-de-rutina-modal ${theme}`}>
      <div className={`creacion-de-rutina-modal-content ${theme}`}>
        <span className="creacion-de-rutina-close" onClick={onClose}
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
        <h2>{routine && routine._id ? "Editar Rutina" : "Crear Nueva Rutina"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la Rutina:
            <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} className={theme} required />
            </label>
          <label>
            Descripción:
            <input type="text" name="description" value={description} onChange={e => setDescription(e.target.value)} className={theme} required />
          </label>
          <label>
            Tags/Categorías:
            <div className="tag-selector">
              {predefinedTags.map((tag, index) => (
                <button
                  type="button"
                  key={index}
                  className={`tag-button ${tags.includes(tag) ? 'selected' : ''} ${theme}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </label>
          <label>
            Notas Adicionales:
            <textarea name="notes" rows="3" value={notes} onChange={e => setNotes(e.target.value)} className={theme}></textarea>
          </label>
          <h3>Ejercicios/Actividades</h3>
          <div className="tableWrapper">
            <table className={`table ${theme}`}>
              <thead>
                <tr>
                  <th className={theme}>Ejercicio</th>
                  {attributes.map((attribute, index) => (
                    <th key={index} className={theme}>
                      <select
                        value={attribute}
                        onChange={(e) => handleAttributeChange(index, e.target.value)}
                        className={theme}
                      >
                        {attributeOptions.map((option, optionIndex) => (
                          <option 
                            key={optionIndex} 
                            value={option} 
                            disabled={attributes.includes(option) && attributes[index] !== option} 
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                  <th className={theme}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className={`tableCell ${theme}`}>
                      <input
                        value={row[0]}
                        onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
                        onFocus={() => handleFocus(rowIndex, 0)}
                        onBlur={handleBlur}
                        className={theme}
                      />
                      {suggestions.length > 0 && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === 0 && (
                        <div className={`suggestions ${theme}`}>
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`suggestion ${theme}`}
                              onMouseDown={() => handleSuggestionClick(rowIndex, suggestion)}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    {[1, 2, 3].map((colIndex) => (
                      <td key={colIndex} className={`tableCell ${theme}`}>
                        <input
                          value={row[colIndex]}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          onFocus={() => handleFocus(rowIndex, colIndex)}
                          onBlur={handleBlur}
                          className={theme}
                        />
                      </td>
                    ))}
                    <td className={`tableCell ${theme}`}>
                      <button type="button" className="deleteButton" onClick={() => deleteRow(rowIndex)}>
                        <Icon icon={trash} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className={`addButtonCell ${theme}`}>
                    <div className="addButtonWrapperRow">
                      <button className={`addButtonRow ${theme}`} type="button" onClick={addRow}>+</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="form-actions">
            <button type="submit" className={`addRoutineButton ${theme}`}
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
            >{routine && routine._id ? "Actualizar" : "Guardar"}
              
            </button>
            <button type="button" className={theme} onClick={onClose}
            style={{
              background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreacionDeRutina;
