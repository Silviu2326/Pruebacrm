import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetailedDocumento.css';
import WidgetLicenciasDuplicado from './Duplicados/WidgetLicenciasDuplicado';
import WidgetContratosDuplicado from './Duplicados/WidgetContratosDuplicado';
import WidgetDocumentosOtros from './widget-Documentos-otros';
import NavegadorDeGraficos from '../Componentepanelcontrol/NavegadorDeGraficos';
import WidgetAlertas from './widget-Alertas'; // Importamos el nuevo componente

const DetailedDocumento = ({ onTabChange, theme, setTheme }) => {
  const [isAlarmPopupOpen, setIsAlarmPopupOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    alertDate: '',
    displayDate: '',
    tipo: 'licencia', // Tipo se establece automáticamente como "licencia"
  });

  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Cerrar el modal al presionar la tecla Esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleCloseAlarmPopup();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleOpenAlarmPopup = () => {
    setIsAlarmPopupOpen(true);
  };

  const handleCloseAlarmPopup = () => {
    setIsAlarmPopupOpen(false);
  };

  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleAlertChange = (e) => {
    setNewAlert({
      ...newAlert,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAlert = async () => {
    try {
      const response = await axios.post('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/', {
        status: 'pendiente',
        title: newAlert.title,
        message: newAlert.message,
        alertDate: newAlert.alertDate,
        displayDate: newAlert.displayDate,
        tipo: 'licencia', // Aseguramos que siempre sea "licencia"
      });

      setAlerts([...alerts, response.data]);
      setNewAlert({ title: '', message: '', alertDate: '', displayDate: '', tipo: 'licencia' });
      setIsAlarmPopupOpen(false);
    } catch (error) {
      console.error("Error al crear la alerta:", error);
    }
  };

  const licencias = [
    { id: 1, titulo: 'Licencia 1', fecha: '2023-01-01' },
    { id: 3, titulo: 'Licencia 2', fecha: '2023-01-03' },
    { id: 5, titulo: 'Licencia 3', fecha: '2023-01-05' },
  ];

  const filteredAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.displayDate);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    return (!startDate || alertDate >= startDate) && (!endDate || alertDate <= endDate);
  });

  const sortedLicencias = [...licencias].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className={`detailed-documento-modal ${theme}`}>
      <div className={`detailed-documento-content ${theme}`}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />
          <button
            className={`program-alarm-btn ${theme}`}
            onClick={handleOpenAlarmPopup}
            style={{
              background:'var(--create-button-bg)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '14px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
}}
          >
            Programar Alarma
          </button>
        </div>

        <div className="licencias-section">
          <WidgetLicenciasDuplicado isEditMode={true} theme={theme} />
        </div>
        <div className="contratos-section">
          <WidgetContratosDuplicado isEditMode={true} theme={theme} />
        </div>
        <div className="documentos-otros-section">
          <WidgetDocumentosOtros isEditMode={true} theme={theme} />
        </div>
        <div className="alertas-section"> {/* Sección para alertas */}
          <WidgetAlertas theme={theme} /> {/* Incluir el componente WidgetAlertas */}
        </div>

        {/* Modal Overlay */}
        {isAlarmPopupOpen && (
          <div className="alarm-popup-overlay" onClick={handleCloseAlarmPopup}>
            <div
              className={`alarm-popup ${theme}`}
              onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el mismo
            >
              <h3>Programar Alarma</h3>
              <button
                className="close-alarm-popup-btn"
                onClick={handleCloseAlarmPopup}
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
              >
                &times;
              </button>
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Título"
                  value={newAlert.title}
                  onChange={handleAlertChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <input
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Mensaje"
                  value={newAlert.message}
                  onChange={handleAlertChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="alertDate">Fecha de la Alerta</label>
                <input
                  type="date"
                  name="alertDate"
                  id="alertDate"
                  value={newAlert.alertDate}
                  onChange={handleAlertChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="displayDate">Fecha de Visualización</label>
                <input
                  type="date"
                  name="displayDate"
                  id="displayDate"
                  value={newAlert.displayDate}
                  onChange={handleAlertChange}
                />
              </div>
              <button
                className={`set-alarm-btn ${theme}`}
                onClick={handleCreateAlert}
                style={{
                  background:'var(--create-button-bg)', 
                  color:  'var(--button-text-dark)' ,
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '14px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              >
                Crear Alerta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedDocumento;
