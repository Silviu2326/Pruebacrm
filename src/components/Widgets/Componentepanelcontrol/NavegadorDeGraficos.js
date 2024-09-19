// NavegadorDeGraficos.js
import React from 'react';
import './navegadordegraficos.css';

function NavegadorDeGraficos({ onTabChange, activeTab, theme }) {
  const handleTabClick = (tab) => {
    onTabChange(tab); // Notificar a Pestañaeconomiapage sobre el cambio de pestaña
  };

  return (
    <nav className={`panelcontrol-navegador ${theme}`}>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Panel de Control' ? 'active' : ''}`}
        onClick={() => handleTabClick('Panel de Control')}
        style={{ width: '200px' }}
      >
        Panel de Control
      </button>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Cashflow' ? 'active' : ''}`}
        onClick={() => handleTabClick('Cashflow')}
      >
        Cashflow
      </button>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Planes' ? 'active' : ''}`}
        onClick={() => handleTabClick('Planes')}
      >
        Planes
      </button>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Documentos' ? 'active' : ''}`}
        onClick={() => handleTabClick('Documentos')}
      >
        Documentos
      </button>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Facturas' ? 'active' : ''}`}
        onClick={() => handleTabClick('Facturas')}
      >
        Facturas
      </button>
      <button
        className={`panelcontrol-nav-btn ${activeTab === 'Reportes' ? 'active' : ''}`}
        onClick={() => handleTabClick('Reportes')}
      >
        Reportes
      </button>
    </nav>
  );
}

export default NavegadorDeGraficos;
