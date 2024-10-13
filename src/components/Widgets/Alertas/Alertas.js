import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alertas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const Alertas = ({ theme, setTheme, onTabChange }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/alertas`);
        // Filtrar alertas donde displayDate es anterior a hoy
        const filteredAlerts = response.data.filter(alerta => new Date(alerta.displayDate) < new Date());
        setAlerts(filteredAlerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/alertas/${id}`);
      setAlerts(alerts.filter(alerta => alerta._id !== id));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleAlertClick = (title) => {
    if (title.includes('Licencia')) {
        onTabChange('Documentos');
    } else if (title.includes('Beneficio')) {
        onTabChange('Cashflow');
    } else if (title.includes('Pago')) {
        onTabChange('Planes');
    }
  };

  const getAlertClass = (alerta) => {
    if (alerta.title.includes('Pago Fallido')) {
      return 'pago-fallido';
    } else if (alerta.title.includes('Pago Correcto')) {
      return 'pago-correcto';
    } else if (alerta.tipo === 'licencia') {
      return 'licencia';
    } else if (alerta.tipo === 'beneficio') {
      return 'beneficio';
    } else {
      return '';
    }
  };

  if (alerts.length === 0) {
    return <div className={`Alertas-eco-widget-empty ${theme}`}>No hay alertas disponibles</div>;
  }

  return (
    <div className={`Alertas-eco-widget ${theme}`} style={{ 
      maxHeight: '400px', 
      height: '400px', 
      overflowY: 'scroll', 
    }}>
      <h2 className={`Alertas-eco-title ${theme}`}>Alertas</h2>
      <ul className={`Alertas-eco-list ${theme}`}>
        {alerts.map((alerta) => (
          <li key={alerta._id} className={`Alertas-eco-item ${getAlertClass(alerta)} ${theme}`}>
            <strong className={`Alertas-eco-item-title ${theme}`}>{alerta.title}</strong>: 
            <span className={`Alertas-eco-item-message ${theme}`}>{alerta.message}</span>
            <div className={`Alertas-eco-item-date ${theme}`}>
              <strong>Fecha de Alerta:</strong> {new Date(alerta.alertDate).toLocaleDateString()}
            </div>
            <button
              className={`Alertas-eco-item-button ${theme}`}
              onClick={() => handleAlertClick(alerta.title)}
            >
              Ver más
            </button>
            <button
              className={`Alertas-eco-item-button ${theme}`}
              onClick={() => handleDeleteAlert(alerta._id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alertas;
