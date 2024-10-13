import React, { useState } from 'react';
import './ModalGenerarFormula.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { Button } from '../ComponentsReutilizables/Button.tsx';

import FormulaEditor from './FormulaEditor';
import ConditionBuilder from './ConditionBuilder';
import VariablesSection from './VariablesSection';

const variablesData = {
  cliente: [
    { name: 'Edad', type: 'numérica', description: 'La edad del cliente en años.' },
    { name: 'Género', type: 'categórica', options: ['Masculino', 'Femenino', 'Otro'], description: 'El género del cliente.' },
    { name: 'Peso Corporal', type: 'numérica', description: 'El peso actual del cliente en kilogramos.' },
    { name: 'Altura', type: 'numérica', description: 'La altura del cliente en centímetros.' },
    { name: 'Nivel de Experiencia', type: 'categórica', options: ['Principiante', 'Intermedio', 'Avanzado'], description: 'El nivel de experiencia del cliente en entrenamiento físico.' },
  ],
  entrenamiento: [
    { name: 'Objetivo del Entrenamiento', type: 'categórica', options: ['Fuerza', 'Hipertrofia', 'Resistencia', 'Reducción de Grasa'], description: 'El objetivo principal del programa de entrenamiento.' },
    { name: 'Duración de la Sesión', type: 'numérica', description: 'Duración estimada de la sesión en minutos.' },
    { name: 'Número de Sesiones por Semana', type: 'numérica', description: 'Cantidad de sesiones de entrenamiento por semana.' },
    { name: 'Intensidad Percibida', type: 'numérica', description: 'Escala de intensidad percibida (por ejemplo, del 1 al 10).' },
  ],
  ejercicio: [
    { name: 'Tipo de Ejercicio', type: 'categórica', options: ['Aeróbico', 'Anaeróbico', 'Fuerza', 'Estiramiento'], description: 'Tipo de ejercicio a realizar.' },
    { name: 'Peso Máximo (1RM)', type: 'numérica', description: 'Peso máximo que el cliente puede levantar en una repetición para un ejercicio específico.' },
    { name: 'Repeticiones Objetivo', type: 'numérica', description: 'Número de repeticiones objetivo para un ejercicio determinado.' },
    { name: 'Series Objetivo', type: 'numérica', description: 'Número de series objetivo para un ejercicio determinado.' },
    { name: 'Tiempo de Descanso entre Series', type: 'numérica', description: 'Tiempo de descanso en segundos entre series de un ejercicio.' },
  ],
  progreso: [
    { name: 'Incremento de Peso', type: 'numérica', description: 'Incremento de peso a añadir en cada sesión de entrenamiento (por ejemplo, 2 kg por semana).' },
    { name: 'Incremento de Repeticiones', type: 'numérica', description: 'Número de repeticiones a añadir por semana.' },
    { name: 'Fatiga Acumulada', type: 'numérica', description: 'Valor que indica la fatiga acumulada del cliente, basado en entrenamientos previos.' },
  ],
  estadoFisico: [
    { name: 'Frecuencia Cardíaca en Reposo', type: 'numérica', description: 'Frecuencia cardíaca del cliente en reposo en latidos por minuto.' },
    { name: 'Frecuencia Cardíaca Máxima', type: 'numérica', description: 'Frecuencia cardíaca máxima calculada o medida del cliente.' },
    { name: 'Porcentaje de Grasa Corporal', type: 'numérica', description: 'Porcentaje de grasa corporal del cliente.' },
    { name: 'Masa Muscular', type: 'numérica', description: 'Masa muscular del cliente en kilogramos.' },
  ],
  personalizado: [
    { name: 'Día de la Semana', type: 'categórica', options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'], description: 'Día de la semana para el que se está planificando la sesión.' },
    { name: 'Nivel de Energía Percibido', type: 'numérica', description: 'Autoevaluación del cliente sobre su nivel de energía en una escala del 1 al 10.' },
    { name: 'Disponibilidad de Equipamiento', type: 'categórica', options: ['Completo', 'Limitado', 'Sin Equipamiento'], description: 'Nivel de disponibilidad de equipamiento para el entrenamiento.' },
  ],
};

const ModalGenerarFormula = ({ show, onClose, theme }) => {
    const [variables, setVariables] = useState(variablesData);

    const handleAddVariable = (newVariable) => {
      setVariables(prevVariables => ({
        ...prevVariables,
        personalizado: [...prevVariables.personalizado, newVariable],
      }));
    };

    const handleUpdateVariable = (category, variableName, updatedVariable) => {
      setVariables(prevVariables => ({
        ...prevVariables,
        [category]: prevVariables[category].map(varItem => varItem.name === variableName ? updatedVariable : varItem),
      }));
    };

    const handleDeleteVariable = (category, index) => {
      setVariables(prevVariables => ({
        ...prevVariables,
        [category]: prevVariables[category].filter((_, idx) => idx !== index),
      }));
    };
  
    if (!show) {
      return null;
    }
  
    return (
      <div className={`modalgenerarformula-overlay ${theme}`}>
        <div className={`modalgenerarformula-content ${theme}`}>
          <button className="modalgenerarformula-close" onClick={onClose}
          style={{
            background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
>X</button>
          <h2 className="modalgenerarformula-title">Creador de Fórmulas Deportivas</h2>
  
          <Tabs defaultValue="variables">
            <TabsList>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="formula">Fórmula</TabsTrigger>
              <TabsTrigger value="condiciones">Condiciones</TabsTrigger>
              <TabsTrigger value="resultados">Resultados</TabsTrigger>
            </TabsList>
  
            <TabsContent value="variables">
              <VariablesSection
                variables={variables}
                onAddVariable={handleAddVariable}
                onUpdateVariable={handleUpdateVariable}
                onDeleteVariable={handleDeleteVariable}
              />
            </TabsContent>
  
            <TabsContent value="formula">
              <FormulaEditor 
                variables={Object.values(variables).flat().map(v => v.name)} 
                functions={['sqrt', 'log']} 
                operators={['+', '-', '*', '/', '(', ')']} 
              />
            </TabsContent>
  
            <TabsContent value="condiciones">
              <ConditionBuilder variables={Object.values(variables).flat().map(v => v.name)} />
            </TabsContent>
  
            <TabsContent value="resultados">
              <h3 className="tab-section-title">Resultados</h3>
              <div className="resultados-container"></div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };
  
  export default ModalGenerarFormula;
