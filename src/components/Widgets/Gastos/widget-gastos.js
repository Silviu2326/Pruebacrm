import React, { useState, useEffect } from 'react';
import './WidgetCuentaBancaria.css'; // Asegúrate de importar los estilos

function WidgetCuentaBancaria({ beneficio, valueClass, theme }) {
  const [showBeneficio, setShowBeneficio] = useState(true);
  const [activeView, setActiveView] = useState('CRM');
  const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || 'CRM');

  useEffect(() => {
    setActiveView(defaultView);
    if (defaultView === 'CRM') {
      setShowBeneficio(true);
    } else {
      setShowBeneficio(false);
    }
  }, [defaultView]);

  const handleViewCRM = () => {
    setShowBeneficio(true);
    setActiveView('CRM');
  };

  const handleViewStripe = () => {
    setShowBeneficio(false);
    setActiveView('Stripe');
  };

  const handleViewBankAccount = () => {
    setShowBeneficio(false);
    setActiveView('Bank');
  };

  const handleSaveDefaultView = () => {
    localStorage.setItem('defaultView', activeView);
    alert(`Vista predefinida guardada: ${activeView}`);
  };

  // Asegurarse de que 'beneficio' es un número antes de usar toFixed()
  const beneficioSeguro = typeof beneficio === 'number' ? beneficio : 0;

  return (
    <div className={`widget-cuenta-bancaria-container ${theme}`}>
      <button 
        onClick={handleSaveDefaultView} 
        className="widget-cuenta-bancaria-save-btn"
      >
        Guardar Vista Predefinida
      </button>
      <div className="widget-cuenta-bancaria-handle"></div>
      <h2 className="widget-cuenta-bancaria-title">Cuenta Bancaria</h2>
      <p className="widget-cuenta-bancaria-description">Contenido de la cuenta bancaria.</p>
      <div className="widget-cuenta-bancaria-buttons-container">
        <button 
          onClick={handleViewCRM} 
          className={`widget-cuenta-bancaria-btn ${activeView === 'CRM' ? 'active' : ''}`}
        >
          Ver Ingreso en CRM
        </button>
        <button 
          onClick={handleViewStripe} 
          className={`widget-cuenta-bancaria-btn ${activeView === 'Stripe' ? 'active' : ''}`}
        >
          Ver Cuenta en Stripe
        </button>
        <button 
          onClick={handleViewBankAccount} 
          className={`widget-cuenta-bancaria-btn ${activeView === 'Bank' ? 'active' : ''}`}
        >
          Ver Cuenta Bancaria
        </button>
      </div>
      {showBeneficio && (
        <p className={`widget-cuenta-bancaria-beneficio ${valueClass}`}>
          Beneficio Actual: ${beneficioSeguro.toFixed(2)}
        </p>  // Se usa beneficioSeguro aquí
      )}
    </div>
  );
}

export default WidgetCuentaBancaria;
