import React, { useState } from 'react';
import Listaderutinas from '../Rutinas/Listaderutinas';
import ExerciseList from '../Ejercicios/ExerciseList';
import Rutinaaasss from '../Rutinaaasss/Rutinaaaasss';
import './ColecRutina.css';

const ColecRutina = (props) => {
  const { theme } = props;

  // Estado para controlar qué sección está activa
  const [activeSection, setActiveSection] = useState('listaderutinas');

  const renderSection = () => {
    switch (activeSection) {
      case 'listaderutinas':
        return <Listaderutinas theme={theme} />;
      case 'exerciselist':
        return <ExerciseList theme={theme} />;
      case 'rutinaaasss':
        return <Rutinaaasss theme={theme} />;
      default:
        return <Listaderutinas theme={theme} />;
    }
  };

  return (
    <div className={`navColec ${theme}`}>
      {/* Navegación */}
      <nav className="navColec-nav">
        <button
          className={`navColec-btn ${activeSection === 'listaderutinas' ? 'active' : ''}`}
          onClick={() => setActiveSection('listaderutinas')}
        >
          Planificaciones
        </button>
        <button
          className={`navColec-btn ${activeSection === 'exerciselist' ? 'active' : ''}`}
          onClick={() => setActiveSection('exerciselist')}
        >
          Ejercicios
        </button>
        <button
          className={`navColec-btn ${activeSection === 'rutinaaasss' ? 'active' : ''}`}
          onClick={() => setActiveSection('rutinaaasss')}
        >
          Rutinas
        </button>
      </nav>

      {/* Sección activa */}
      <div className="navColec-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default ColecRutina;
