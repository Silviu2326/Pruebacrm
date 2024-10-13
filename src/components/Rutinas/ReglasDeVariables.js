import React from 'react';

const ReglasDeVariables = ({ onClose }) => {
  return (
    <div>
      <h2>Reglas de Variables</h2>
      <p>Aquí puedes definir las reglas de las variables para este periodo.</p>

      {/* Contenido personalizado aquí */}
      
      {/* Botón para volver */}
      <button
        onClick={onClose}
        style={{
          background: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          border: 'none',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Volver
      </button>
    </div>
  );
};

export default ReglasDeVariables;
