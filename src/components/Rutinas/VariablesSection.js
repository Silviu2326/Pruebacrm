import React, { useState } from 'react';
import './VariablesSection.css'; // Asegúrate de importar el CSS
import { Button } from '../ComponentsReutilizables/Button.tsx';
import VariableFormPopup from './VariableFormPopup';

const VariablesSection = ({ variables, onAddVariable, onUpdateVariable, onDeleteVariable, theme}) => {
  const [showVariablePopup, setShowVariablePopup] = useState(false);
  const [editVariable, setEditVariable] = useState(null);

  const handleEdit = (variable, category) => {
    setEditVariable({ ...variable, category });
    setShowVariablePopup(true);
  };

  return (
    <div style={{
      overflow: 'scroll'
    }}>
      <button className="btn-add-variable" onClick={() => setShowVariablePopup(true)}
        style={{
          background:'var(--create-button-bg)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}>
        Agregar Variable
      </button>

      <div className="variables-container">
        {Object.keys(variables).map((category, idx) => (
          <div key={idx} className="variable-category">
            <h4>{category}</h4>
            <ul>
              {variables[category].map((variable, index) => (
                <li key={index} className="variable-item">
                  <div className="variable-details">
                    <strong>{variable.name}:</strong> {variable.description} (Tipo: {variable.type})
                    {variable.options && (
                      <ul className="variable-options">
                        {variable.options.map((option, i) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="variable-actions">
                    <button className="btn-edit" onClick={() => handleEdit(variable, category)}
                      style={{
                        background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                        color:  'var(--button-text-dark)' ,
                        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background 0.3s ease',
                      }}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => onDeleteVariable(category, index)}
                      style={{
                        background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                        color:  'var(--button-text-dark)' ,
                        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background 0.3s ease',
                      }}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <VariableFormPopup
        show={showVariablePopup}
        onClose={() => {
          setShowVariablePopup(false);
          setEditVariable(null);
        }}
        onAddVariable={onAddVariable}
        onUpdateVariable={onUpdateVariable}
        editVariable={editVariable}
      />
    </div>
  );
};

export default VariablesSection;
