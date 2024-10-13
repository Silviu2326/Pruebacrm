import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Sliders, CheckCircle } from 'lucide-react';  // Importamos los iconos desde lucide-react

const VariableNode = ({ id, data }) => {
  const { name, value, isConditional, variable, onMakeConditional } = data;
  const [showPopup, setShowPopup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);  // Estado para el popup de ajustes
  const [positiveCondition, setPositiveCondition] = useState({ min: '', max: '' });
  const [negativeCondition, setNegativeCondition] = useState({ min: '', max: '' });
  const [localValue, setLocalValue] = useState(value.value);  // Estado local para manejar los ajustes

  // Función para abrir/cerrar el popup de condiciones
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Función para abrir/cerrar el popup de ajustes
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Función para manejar la confirmación de las condiciones
  const handleConfirmCondition = () => {
    onMakeConditional({
      ...variable,
      positiveCondition,
      negativeCondition,
      nodeId: id, // Incluimos el nodeId
    });
    setShowPopup(false); // Cierra el popup
  };

  // Función para confirmar los cambios realizados en el popup de ajustes
  const handleConfirmSettings = () => {
    console.log('Ajustes confirmados para', name, 'con valor:', localValue);
    setShowSettings(false);  // Cierra el popup de ajustes
  };

  // Renderización del valor dentro del nodo (si no es condicional)
  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <ul style={{ textAlign: 'left', paddingLeft: '20px', marginTop: '10px' }}>
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>
              <strong>{mapKey(key)}:</strong> {val}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{value}</span>;
  };

  // Función para mapear las llaves a los términos deseados
  const mapKey = (key) => {
    switch (key) {
      case 'type':
        return 'tipo';
      case 'value':
        return 'valor';
      case 'description':
        return 'descripción';
      default:
        return key;
    }
  };

  // Renderiza el input adecuado según el tipo de variable
  const renderSettingsInputs = () => {
    const { type, options } = variable.value;

    if (type === 'numérica') {
      return (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{name} (numérico)</label>
          <input
            type="number"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              fontSize: '16px',
            }}
          />
        </div>
      );
    } else if (type === 'categórica') {
      return (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{name} (categórico)</label>
          <select
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              fontSize: '16px',
            }}
          >
            {options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (type === 'texto') {
      return (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{name} (texto)</label>
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              fontSize: '16px',
            }}
          />
        </div>
      );
    } else {
      return (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>{name} (tipo desconocido)</label>
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '100%',
              fontSize: '16px',
            }}
          />
        </div>
      );
    }
  };

  return (
    <div
      style={{
        padding: '15px',
        border: '2px solid #1a192b',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        minWidth: '220px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
      className="variable-node"
    >
      <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '10px' }}>{name}</div>

      {/* Botón de Ajustes en la esquina superior derecha */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '6px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#ffc107',
          color: 'black',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        }}
        onClick={toggleSettings}
      >
        <Settings size={18} /> {/* Icono de ajustes */}
      </button>

      {/* Muestra el valor solo si no es condicional */}
      {!isConditional && <div style={{ fontSize: '16px', marginBottom: '10px' }}>{renderValue(value.value)}</div>}

      {/* Muestra los rangos de entrada y salida si el nodo es condicional */}
      {isConditional && (
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          <div style={{ textAlign: 'left', color: 'green' }}>
            <strong>Condición Positiva:</strong><br />
            Min: {positiveCondition.min || 'N/A'}<br />
            Max: {positiveCondition.max || 'N/A'}
          </div>
          <div style={{ textAlign: 'left', color: 'red', marginTop: '10px' }}>
            <strong>Condición Negativa:</strong><br />
            Min: {negativeCondition.min || 'N/A'}<br />
            Max: {negativeCondition.max || 'N/A'}
          </div>
        </div>
      )}

      {/* Botón para configurar condiciones con un icono */}
      <button
        style={{
          marginTop: '15px',
          padding: '8px 15px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isConditional ? '#007BFF' : '#28a745',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          fontSize: '16px',
          fontWeight: '500',
          boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
        }}
        onClick={togglePopup}
      >
        <Sliders size={18} /> {/* Icono de sliders */}
        {isConditional ? 'Configurar Condiciones' : 'Hacer Condicional'}
      </button>

      {/* Input handle */}
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />

      {/* Output handle: Si es condicional, muestra dos handles, de lo contrario uno */}
      {!isConditional ? (
        <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      ) : (
        <>
          <Handle type="source" position={Position.Bottom} id="positive-output" style={{ background: 'green', left: '25%' }} />
          <Handle type="source" position={Position.Bottom} id="negative-output" style={{ background: 'red', left: '75%' }} />
        </>
      )}

      {/* Popup para definir las condiciones */}
      {showPopup && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '10px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '250px',
          }}
        >
          <h4 style={{ fontSize: '18px', marginBottom: '15px', textAlign: 'center' }}>Definir Condiciones</h4>

          {/* Inputs para la condición positiva */}
          <div>
            <label style={{ fontWeight: '600' }}>Condición Positiva:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input
                type="number"
                placeholder="Mínimo"
                value={positiveCondition.min}
                onChange={(e) => setPositiveCondition({ ...positiveCondition, min: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
              <input
                type="number"
                placeholder="Máximo"
                value={positiveCondition.max}
                onChange={(e) => setPositiveCondition({ ...positiveCondition, max: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Inputs para la condición negativa */}
          <div style={{ marginTop: '15px' }}>
            <label style={{ fontWeight: '600' }}>Condición Negativa:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input
                type="number"
                placeholder="Mínimo"
                value={negativeCondition.min}
                onChange={(e) => setNegativeCondition({ ...negativeCondition, min: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
              <input
                type="number"
                placeholder="Máximo"
                value={negativeCondition.max}
                onChange={(e) => setNegativeCondition({ ...negativeCondition, max: e.target.value })}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Botones de Confirmar/Cancelar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '16px',
              }}
              onClick={handleConfirmCondition}
            >
              <CheckCircle size={18} /> Confirmar
            </button>
            <button
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={togglePopup}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Popup para ajustes del nodo */}
      {showSettings && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '10px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '250px',
          }}
        >
          <h4 style={{ fontSize: '18px', marginBottom: '15px', textAlign: 'center' }}>Ajustes de {name}</h4>

          {/* Renderizamos inputs dinámicos basados en el tipo de variable */}
          {renderSettingsInputs()}

          {/* Botones de Confirmar/Cancelar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '16px',
              }}
              onClick={handleConfirmSettings}
            >
              <CheckCircle size={18} /> Confirmar Ajustes
            </button>
            <button
              style={{
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={toggleSettings}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default VariableNode;
