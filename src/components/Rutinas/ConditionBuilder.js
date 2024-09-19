import React, { useState } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import './ConditionBuilder.css';

const operators = ['>', '<', '>=', '<=', '==', '!='];
const logicalOperators = ['AND', 'OR'];

const ConditionBuilder = ({ variables }) => {
  const [conditions, setConditions] = useState([]);
  const [newCondition, setNewCondition] = useState({ variable: '', operator: '', value: '', logicalOperator: '' });

  const handleInputChange = (e) => {
    setNewCondition({ ...newCondition, [e.target.name]: e.target.value });
  };

  const addCondition = () => {
    setConditions([...conditions, newCondition]);
    setNewCondition({ variable: '', operator: '', value: '', logicalOperator: '' });
  };

  const removeCondition = (index) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };

  const editCondition = (index) => {
    setNewCondition(conditions[index]);
    removeCondition(index);
  };

  return (
    <div className="condition-builder">
      <div className="condition-inputs">
        <select name="variable" value={newCondition.variable} onChange={handleInputChange}>
          <option value="">Seleccionar Variable</option>
          {variables.map((variable, index) => (
            <option key={index} value={variable}>
              {variable}
            </option>
          ))}
        </select>

        <select name="operator" value={newCondition.operator} onChange={handleInputChange}>
          <option value="">Seleccionar Operador</option>
          {operators.map((operator, index) => (
            <option key={index} value={operator}>
              {operator}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="value"
          value={newCondition.value}
          placeholder="Valor"
          onChange={handleInputChange}
        />

        <select name="logicalOperator" value={newCondition.logicalOperator} onChange={handleInputChange}>
          <option value="">(Opcional) Operador Lógico</option>
          {logicalOperators.map((operator, index) => (
            <option key={index} value={operator}>
              {operator}
            </option>
          ))}
        </select>

        <Button variant="black" size="sm" onClick={addCondition}>
          Añadir Condición
        </Button>
      </div>

      <div className="conditions-list">
        {conditions.map((cond, index) => (
          <div key={index} className="condition-item">
            <span>
              {cond.logicalOperator ? `${cond.logicalOperator} ` : ''}
              {cond.variable} {cond.operator} {cond.value}
            </span>
            <Button variant="outline" size="sm" onClick={() => editCondition(index)}>
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={() => removeCondition(index)}>
              Eliminar
            </Button>
          </div>
        ))}
      </div>

      <div className="preview">
        <h3>Vista Previa de Condiciones</h3>
        <p>
          {conditions.length === 0 ? 'No hay condiciones definidas.' : 
            conditions.map(cond => `${cond.logicalOperator ? `${cond.logicalOperator} ` : ''}${cond.variable} ${cond.operator} ${cond.value}`).join(' ')}
        </p>
      </div>
    </div>
  );
};

export default ConditionBuilder;
