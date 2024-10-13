import React, { useState } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import './ConditionBuilder.css';

const operators = ['>', '<', '>=', '<=', '==', '!='];
const logicalOperators = ['AND', 'OR'];

const ConditionBuilder = ({ variables, theme}) => {
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
          <option value=""
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
        >Seleccionar Variable</option>
          {variables.map((variable, index) => (
            <option key={index} value={variable}>
              {variable}
            </option>
          ))}
        </select>

        <select name="operator" value={newCondition.operator} onChange={handleInputChange}>
          <option value=""
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
        >Seleccionar Operador</option>
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
          <option value=""
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
        >(Opcional) Operador Lógico</option>
          {logicalOperators.map((operator, index) => (
            <option key={index} value={operator}>
              {operator}
            </option>
          ))}
        </select>

        <Button variant="black" size="sm" onClick={addCondition}
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
            <Button variant="outline" size="sm" onClick={() => editCondition(index)}
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
            </Button>
            <Button variant="outline" size="sm" onClick={() => removeCondition(index)}
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
            </Button>
          </div>
        ))}
      </div>

      <div className="preview">
        <h3
        style={{
          background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}>Vista Previa de Condiciones</h3>
        <p>
          {conditions.length === 0 ? 'No hay condiciones definidas.' : 
            conditions.map(cond => `${cond.logicalOperator ? `${cond.logicalOperator} ` : ''}${cond.variable} ${cond.operator} ${cond.value}`).join(' ')}
        </p>
      </div>
    </div>
  );
};

export default ConditionBuilder;
