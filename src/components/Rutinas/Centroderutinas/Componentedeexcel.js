import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './Componentedeexcel.css';

const Componentedeexcel = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const [sessions, setSessions] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

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
    <div className="component-container">
      <table className="exercise-table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Sesiones y Ejercicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                {sessions[day].map((session) => (
                  <div key={session.id} className="session-container">
                    <table className="exercise-subtable">
                      <tbody>
                        {session.exercises.map((exercise, exerciseIndex) => (
                          <tr key={exerciseIndex}>
                            <td>
                              <input
                                type="text"
                                className="input-field"
                                placeholder="Nombre del ejercicio"
                                value={exercise.name}
                                onChange={(e) => handleInputChange(day, session.id, exerciseIndex, null, e.target.value, false)}
                              />
                            </td>
                            {exercise.fields.map((field, fieldIndex) => (
                              <td key={fieldIndex}>
                                <select
                                  className="select-field"
                                  value={field.type}
                                  onChange={(e) => handleInputChange(day, session.id, exerciseIndex, fieldIndex, e.target.value, true)}
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
                                />
                              </td>
                            ))}
                            <td>
                              <button
                                type="button"
                                className="add-field-button"
                                style={{
                                  width: '24px',
                                  height: '24px',
                                }}
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
                                }}                              >
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
                    >
                      + Agregar Ejercicio
                    </button>
                  </div>
                ))}
              </td>
              <td>
                <button
                  type="button"
                  className="add-session-button"
                  onClick={() => handleAddSession(day)}
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
