import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import './Componentedeexcel.css';
import axios from 'axios';
import Select from 'react-select';

const Componentedeexcel = ({ theme }) => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const [sessions, setSessions] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5005/api/exercises')
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
      });
  }, []);

  const dropdownOptions = [
    'Repeticiones', 'Peso', 'Descanso', 'Tempo', 'Esfuerzo Percibido (RPE)',
    'RPM', 'Repeticiones en Reserva (RIR)', 'Tiempo', 'Velocidad',
    'Cadencia', 'Distancia', 'Altura', 'Calorías', 'Ronda'
  ];

  const handleAddSession = (day) => {
    const newSession = {
      id: `session${Math.random()}`,
      exercises: [{
        name: '',
        fields: [
          { type: '', value: 0 },
          { type: '', value: 0 },
          { type: '', value: 0 }
        ]
      }]
    };
    setSessions({
      ...sessions,
      [day]: [...sessions[day], newSession]
    });
  };

  const handleRemoveSession = (day, sessionId) => {
    setSessions({
      ...sessions,
      [day]: sessions[day].filter(session => session.id !== sessionId)
    });
  };

  const handleInputChange = (day, sessionId, exerciseIndex, fieldIndex, value, isType) => {
    const updatedSessions = sessions[day].map(session => {
      if (session.id === sessionId) {
        const updatedExercises = session.exercises.map((exercise, idx) => {
          if (idx === exerciseIndex) {
            const updatedFields = exercise.fields.map((field, fieldIdx) => {
              if (fieldIdx === fieldIndex) {
                return isType ? { ...field, type: value } : { ...field, value: Number(value) };
              }
              return field;
            });
            return { ...exercise, fields: updatedFields };
          }
          return exercise;
        });
        return { ...session, exercises: updatedExercises };
      }
      return session;
    });
    setSessions({
      ...sessions,
      [day]: updatedSessions
    });
  };

  const handleAddField = (day, sessionId, exerciseIndex) => {
    const updatedSessions = sessions[day].map(session => {
      if (session.id === sessionId) {
        const updatedExercises = session.exercises.map((exercise, idx) => {
          if (idx === exerciseIndex) {
            const availableOptions = getAvailableOptions(exercise);
            if (availableOptions.length > 0) {
              return {
                ...exercise,
                fields: [...exercise.fields, { type: '', value: 0 }]
              };
            }
          }
          return exercise;
        });
        return { ...session, exercises: updatedExercises };
      }
      return session;
    });
    setSessions({
      ...sessions,
      [day]: updatedSessions
    });
  };

  const handleAddExercise = (day, sessionId) => {
    const updatedSessions = sessions[day].map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          exercises: [
            ...session.exercises,
            {
              name: '',
              fields: [
                { type: '', value: 0 },
                { type: '', value: 0 },
                { type: '', value: 0 }
              ]
            }
          ]
        };
      }
      return session;
    });
    setSessions({
      ...sessions,
      [day]: updatedSessions
    });
  };

  const getAvailableOptions = (exercise) => {
    const selectedValues = exercise.fields.map(field => field.type);
    return dropdownOptions.filter(option => !selectedValues.includes(option));
  };

  return (
    <div className="component-container" style={{ padding: '20px', backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', color: theme === 'dark' ? '#fff' : '#000', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <table className="exercise-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: theme === 'dark' ? '#0056b3' : '#007bff', color: '#fff' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Día</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Sesiones y Ejercicios</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{day}</td>
              <td style={{ padding: '10px' }}>
                {sessions[day].map((session) => (
                  <div key={session.id} className="session-container" style={{ marginBottom: '20px', padding: '10px', backgroundColor: theme === 'dark' ? '#444' : '#fff', borderRadius: '5px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
                    <table className="exercise-subtable" style={{ width: '100%' }}>
                      <tbody>
                        {session.exercises.map((exercise, exerciseIndex) => (
                          <tr key={exerciseIndex} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                              <Select
                                classNamePrefix="custom-select"
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    backgroundColor: theme === 'dark' ? '#555' : '#fff',
                                    borderColor: theme === 'dark' ? '#888' : '#ccc',
                                    color: theme === 'dark' ? '#fff' : '#000',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      borderColor: theme === 'dark' ? '#aaa' : '#888'
                                    }
                                  }),
                                  menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: theme === 'dark' ? '#444' : '#fff'
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    color: theme === 'dark' ? '#fff' : '#000'
                                  }),
                                  placeholder: (provided) => ({
                                    ...provided,
                                    color: theme === 'dark' ? '#aaa' : '#666'
                                  })
                                }}
                                className="select-field"
                                value={exercise.name ? { label: exercise.name, value: exercise.name } : null}
                                onChange={(selectedOption) => handleInputChange(day, session.id, exerciseIndex, null, selectedOption ? selectedOption.value : '', false)}
                                options={exercises.map((ex) => ({ label: ex.nombre, value: ex.nombre }))}
                                placeholder="Seleccionar Ejercicio"
                                isClearable
                              />
                            </td>
                            {exercise.fields.map((field, fieldIndex) => (
                              <td key={fieldIndex} style={{ padding: '10px' }}>
                                <select
                                  className="select-field"
                                  value={field.type}
                                  onChange={(e) => handleInputChange(day, session.id, exerciseIndex, fieldIndex, e.target.value, true)}
                                  style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
                                >
                                  <option value="" disabled>Seleccionar</option>
                                  {getAvailableOptions(exercise).map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  className="input-field"
                                  placeholder="0"
                                  value={field.value}
                                  onChange={(e) => handleInputChange(day, session.id, exerciseIndex, fieldIndex, e.target.value, false)}
                                  style={{ width: '100%', padding: '5px' }}
                                />
                              </td>
                            ))}
                            <td style={{ padding: '10px' }}>
                            <button
                                type="button"
                                className="add-field-button" style={{ width: '24px', height: '24px', backgroundColor: theme === 'dark' ? '#218838' : '#28a745', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '0px' }}
                                onClick={() => handleAddField(day, session.id, exerciseIndex)}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                className="delete-button"
                                onClick={() => handleRemoveSession(day, session.id)}
                                style={{
                                  marginLeft: '21px',
                                  backgroundColor: theme === 'dark' ? '#c82333' : '#dc3545',
                                  color: '#fff',

                                  border: 'none',
                                  borderRadius: '5px',
                                  padding: '5px 10px',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      className="add-exercise-button"
                      onClick={() => handleAddExercise(day, session.id)}
                      style={{
                        marginTop: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      + Agregar Ejercicio
                    </button>
                  </div>
                ))}
              </td>
              <td style={{ padding: '10px' }}>
                <button
                  type="button"
                  className="add-session-button"
                  onClick={() => handleAddSession(day)}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}
                >
                  + Añadir Sesión
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Componentedeexcel;