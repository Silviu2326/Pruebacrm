import React, { useState, useEffect } from 'react';
import './VariableFormPopup.css';
import { Button } from '../ComponentsReutilizables/Button.tsx';

const VariableFormPopup = ({ show, onClose, onAddVariable, onUpdateVariable, editVariable }) => {
  const [variableName, setVariableName] = useState('');
  const [variableValue, setVariableValue] = useState('');
  const [variableType, setVariableType] = useState('numérica'); // Default type: numérica
  const [variableOptions, setVariableOptions] = useState('');

  useEffect(() => {
    if (editVariable) {
      setVariableName(editVariable.name);
      setVariableValue(editVariable.value || '');
      setVariableType(editVariable.type);
      setVariableOptions(editVariable.options ? editVariable.options.join(', ') : '');
    }
  }, [editVariable]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVariable = {
      name: variableName,
      type: variableType,
      description: `Descripción automática para ${variableName}`,
      ...(variableType === 'categórica' && { options: variableOptions.split(',').map(opt => opt.trim()) }),
    };

    if (editVariable) {
      onUpdateVariable(editVariable.category, editVariable.name, newVariable);
    } else {
      onAddVariable(newVariable);
    }

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setVariableName('');
    setVariableValue('');
    setVariableType('numérica');
    setVariableOptions('');
  };

  if (!show) {
    return null;
  }

  return (
    <div className="variableformpopup-overlay">
      <div className="variableformpopup-content">
        <button className="variableformpopup-close" onClick={onClose}>X</button>
        <h3 className="variableformpopup-title">{editVariable ? 'Editar Variable' : 'Agregar Nueva Variable'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Variable</label>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Variable</label>
            <select
              value={variableType}
              onChange={(e) => setVariableType(e.target.value)}
              required
            >
              <option value="numérica">Numérica</option>
              <option value="categórica">Categórica</option>
            </select>
          </div>
          {variableType === 'categórica' && (
            <div className="form-group">
              <label>Opciones (separadas por comas)</label>
              <input
                type="text"
                value={variableOptions}
                onChange={(e) => setVariableOptions(e.target.value)}
                placeholder="Opción1, Opción2, Opción3"
              />
            </div>
          )}
          <Button type="submit" variant="black" size="lg">
            {editVariable ? 'Actualizar Variable' : 'Guardar Variable'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VariableFormPopup;
