import React from 'react';
import '../Widgetgasto/navbarfiltros.css';

const NavbarFiltrosRecentSales = ({ filters, clearFilter }) => {
  // Renderiza una etiqueta para cada filtro activo
  const renderFilterTag = (label, value, key) => (
    <div className="filter-tag" key={key}>
      {label} {value} 
      <span className="filter-clear" onClick={() => clearFilter(key)}>x</span>
    </div>
  );

  return (
    <div className="navbar-filtros">
      {/* Filtro de Correo Electrónico */}
      {filters.email && renderFilterTag('Correo:', filters.email, 'email')}
      
      {/* Filtro de Estado */}
      {filters.estado && renderFilterTag('Estado:', filters.estado, 'estado')}
      
      {/* Filtro de Dinero Mínimo */}
      {filters.minMonto && renderFilterTag('Mín. €', filters.minMonto, 'minMonto')}
      
      {/* Filtro de Dinero Máximo */}
      {filters.maxMonto && renderFilterTag('Máx. €', filters.maxMonto, 'maxMonto')}
    </div>
  );
};

export default NavbarFiltrosRecentSales;
