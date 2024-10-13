import React, { useState } from 'react';

const PeriodoCardModificar = ({ exercise, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(exercise.name);
  const [peso, setPeso] = useState(exercise.peso || ''); // Campo de peso
  const [descanso, setDescanso] = useState(exercise.descanso || ''); // Campo de descanso
  const [series, setSeries] = useState(exercise.series || ''); // Campo de series
  const [repeticiones, setRepeticiones] = useState(exercise.repeticiones || ''); // Campo de repeticiones

  const handleSave = () => {
    onSave({ ...exercise, name: nombre, peso, descanso, series, repeticiones });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          position: 'relative',
        }}
      >
        {/* Header con título y botón de cerrar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#5a4cbf',
            }}
          >
            Editar Ejercicio
          </h3>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={onCancel}
          >
            &times;
          </button>
        </div>

        {/* Formulario para editar */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
            Nombre del Ejercicio
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '15px',
              border: '1px solid #dcdcdc',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                Peso (kg)
              </label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '15px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                Descanso (seg)
              </label>
              <input
                type="number"
                value={descanso}
                onChange={(e) => setDescanso(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '15px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                Series
              </label>
              <input
                type="number"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '15px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>
                Repeticiones
              </label>
              <input
                type="number"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '15px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onCancel}
              style={{
                backgroundColor: '#f0f0f0',
                color: '#555',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#5a4cbf',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#4833a3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#5a4cbf')}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodoCardModificar;
