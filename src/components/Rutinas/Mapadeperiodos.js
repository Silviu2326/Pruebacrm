import React from 'react';
import PeriodoCard from './PeriodoCard';

const Mapadeperiodos = ({ periods, onClose }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Mapa de Periodos</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Aquí puedes ver un resumen visual de los periodos seleccionados.</p>

      <div
        className="mapa-periodos-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          flexWrap: 'nowrap',  // Mantenemos las tarjetas en una fila en pantallas grandes
          justifyContent: 'space-between',  // Aseguramos que las tarjetas se distribuyan equitativamente
          padding: '10px 0',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          overflowX: 'auto',  // Permite el scroll horizontal en caso de que no quepan todas las tarjetas
        }}
      >
        {periods.length > 0 ? (
          periods.map((period, index) => (
            <div 
              key={index} 
              style={{
                flex: '1 0 30%',  // Las tarjetas ocupan el 30% del contenedor en pantallas grandes
                flexShrink: 1,
              }}>
              <PeriodoCard periodo={period} />
            </div>
          ))
        ) : (
          <p>No hay periodos seleccionados.</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'background 0.3s',
          }}
        >
          Volver
        </button>
      </div>

      {/* Media Queries */}
      <style>
        {`
          @media (max-width: 1024px) {
            .mapa-periodos-container {
              flex-wrap: wrap;
              justify-content: center;  // Para que las tarjetas se centren en pantallas más pequeñas
            }
          }
        `}
      </style>
    </div>
  );
};

export default Mapadeperiodos;
