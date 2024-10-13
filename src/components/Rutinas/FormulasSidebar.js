import React, { useState } from 'react';
import { X, Pencil, PlusCircle } from 'lucide-react'; // Importamos los iconos que vamos a usar

const FormulasSidebar = ({ availableVariables, onSelectVariable, onClose, onUpdateVariable, onAddToWorkflow }) => {
  const [editingVariable, setEditingVariable] = useState(null);

  // Maneja el clic para editar la variable
  const handleEditClick = (variable) => {
    console.log("Variable seleccionada para editar:", variable);
    setEditingVariable(variable);  // Selecciona la variable para edición
  };

  // Maneja el envío del formulario para guardar la variable editada
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateVariable) {
      onUpdateVariable(editingVariable);  // Guarda la variable editada
    }
    setEditingVariable(null);  // Resetea la variable en edición
  };

  // Maneja el clic para agregar la variable al workflow
  const handleAddToWorkflow = () => {
    if (onAddToWorkflow && editingVariable) {
      onAddToWorkflow(editingVariable);  // Agrega la variable al workflow
    }
    setEditingVariable(null);  // Resetea la variable en edición
  };

  // Renderiza la interfaz de edición dependiendo del tipo de la variable
  const renderInputField = (variable) => {
    if (variable.value.type === 'categórica') {
      return (
        <select
          value={variable.value.value}
          onChange={(e) => setEditingVariable({ ...variable, value: { ...variable.value, value: e.target.value } })}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ced4da',
          }}
        >
          {variable.value.options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else if (variable.value.type === 'numérica') {
      return (
        <input
          type="number"
          value={variable.value.value}
          onChange={(e) => setEditingVariable({ ...variable, value: { ...variable.value, value: e.target.value } })}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ced4da',
          }}
        />
      );
    } else {
      // Para tipo texto
      return (
        <input
          type="text"
          value={variable.value.value}
          onChange={(e) => setEditingVariable({ ...variable, value: { ...variable.value, value: e.target.value } })}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ced4da',
          }}
        />
      );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '0',
      top: '0',
      width: '300px',
      height: '100%',
      backgroundColor: '#f0f4f8',
      boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      zIndex: '1000',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease',
      borderLeft: '3px solid #4caf50',
    }}>
      <button
        onClick={onClose}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <X size={18} />
        Cerrar
      </button>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Variables Disponibles</h3>

      {editingVariable ? (
        <form onSubmit={handleSubmit}>
          <h4 style={{ marginBottom: '10px' }}>Editando: {editingVariable.name}</h4>
          {renderInputField(editingVariable)}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setEditingVariable(null)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Pencil size={18} />
              Guardar
            </button>
            <button
              type="button"
              onClick={handleAddToWorkflow}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <PlusCircle size={18} />
              Poner en Workflow
            </button>
          </div>
        </form>
      ) : (
        <ul style={{ listStyle: 'none', padding: '0', overflowY: 'auto', flexGrow: '1' }}>
          {availableVariables.map((variable, index) => {
            console.log("Variable recibida:", variable);
            return (
              <li key={index} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    color: 'white',
                    backgroundImage: 'linear-gradient(175deg, rgb(9, 26, 163) 0%, rgb(25, 31, 161) 34%, rgb(37, 214, 246) 100%)'
                  }}
                >
                  <h5 style={{ margin: '0 0 5px' }}>{variable.name}</h5>
                  <p style={{ margin: '0 0 10px' }}>
                    <strong>Tipo:</strong> {variable.value.type ? variable.value.type : 'Desconocido'}
                  </p>
                  <button
                    onClick={() => handleEditClick(variable)}
                    style={{
                      backgroundColor: 'white',
                      color: '#28a745',
                      border: '1px solid white',
                      borderRadius: '15px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Pencil size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => onSelectVariable(variable)}
                    style={{
                      backgroundColor: 'white',
                      color: '#28a745',
                      border: '1px solid white',
                      borderRadius: '15px',
                      padding: '8px 15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginLeft:'0px',
                      marginTop:'10px',
                    }}
                  >
                    <PlusCircle size={18} />
                    Añadir al Workflow
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FormulasSidebar;
