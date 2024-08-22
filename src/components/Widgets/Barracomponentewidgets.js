import React from 'react';
import './Barracomponentewidgets.css'; // Asegúrate de crear el archivo CSS para estilizar la barra
import PlanesVendidosImg from './Planes_vendidos.png'; // Importa la imagen

function Barracomponentewidgets({ onClose, theme, removedWidgets, onReaddWidget }) {
  return (
    <div className={`barra-component-widgets ${theme}`}>
      <button onClick={onClose} className="close-sidebar-btn">Cerrar</button>
      <h2>Componentes Widgets</h2>
      <ul>
        {removedWidgets.length > 0 ? (
          removedWidgets.map(widget => (
            <li key={widget.i}>
              <button onClick={() => onReaddWidget(widget)} className="widget-btn">
                {widget.i === 'planesVendidos' && (
                  <>
                    <img src={PlanesVendidosImg} alt="Planes Vendidos" className="widget-image-above" />
                    <span>{widget.i} - Añadir</span>
                  </>
                )}
              </button>
            </li>
          ))
        ) : (
          <li>No hay widgets eliminados</li>
        )}
      </ul>
    </div>
  );
}

export default Barracomponentewidgets;
