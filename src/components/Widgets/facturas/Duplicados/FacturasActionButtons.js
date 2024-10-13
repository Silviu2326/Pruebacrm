// src/components/facturas/FacturasActionButtons.js
import React from 'react';
import './FacturasActionButtons.css';

const FacturasActionButtons = ({ onScanClick, onOpenClick,theme }) => {
  return (
    <div className="Facturas-actions">
      
      <button className="Facturas-scan-btn" onClick={onScanClick}
      style={{
        background:'var(--create-button-bg)', 
        color:  'var(--button-text-dark)' ,
        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s ease',
      }}>Escanear Factura</button>
      <button className="Facturas-add-btn" onClick={onOpenClick}
      style={{
        background:'var(--create-button-bg)', 
        color:  'var(--button-text-dark)' ,
        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s ease',
      }}>Crear Factura</button>
    </div>
  );
}

export default FacturasActionButtons;
