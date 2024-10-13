import React, { useState } from 'react';
import NavegadorDeGraficos from './Componentepanelcontrol/NavegadorDeGraficos';
import ModalGenerarReporteRecurrente from './ModalGenerarReporteRecurrente';
import ModalGenerarReporteActual from './ModalGenerarReporteActual';
import './DetailedReportes.css';
import { Download } from 'lucide-react'; // Importamos el ícono de lucide-react


function DetailedReportes({ theme, setTheme, onTabChange, activeTab }) {
  const [isRecurrentModalOpen, setIsRecurrentModalOpen] = useState(false);
  const [isActualModalOpen, setIsActualModalOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleOpenRecurrentModal = () => {
    setIsRecurrentModalOpen(true);
  };

  const handleCloseRecurrentModal = () => {
    setIsRecurrentModalOpen(false);
  };

  const handleOpenActualModal = () => {
    setIsActualModalOpen(true);
  };

  const handleCloseActualModal = () => {
    setIsActualModalOpen(false);
  };

  const reportes = [
    { fecha: '2024-08-01', nombre: 'Reporte Mensual Agosto', id: 1 },
    { fecha: '2024-07-01', nombre: 'Reporte Mensual Julio', id: 2 },
    { fecha: '2024-06-01', nombre: 'Reporte Mensual Junio', id: 3 },
  ];

  const handleDescargarReporte = (id) => {
    alert(`Descargando reporte con ID: ${id}`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = reportes.map((reporte) => reporte.id);
      setSelectedReports(allIds);
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (id) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reportId) => reportId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className={`detailed-reportes ${theme}`}>
      <NavegadorDeGraficos onTabChange={onTabChange} activeTab={activeTab} theme={theme} />
      <h1 className="reportes-titulo">Reportes Detallados</h1>
      <div className="reportes-buttons">
        <button
          onClick={handleOpenRecurrentModal}
          className={`btn-generar-reporte ${theme}`}
          style={{
            background:'var(--create-button-bg)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
>
          Generar Reporte Recurrente
        </button>
        <button
          onClick={handleOpenActualModal}
          className={`btn-generar-reporte ${theme}`}
          style={{
            background:'var(--create-button-bg)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}
>
          Generar Reporte Actual
        </button>
      </div>
      <table className={`tabla-reportes ${theme}`} 
  style={{ 
    borderRadius: '10px', 
    borderCollapse: 'separate', 
    borderSpacing: '0', 
    width: '100%', 
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }}
>
  <thead style={{ 
      backgroundColor: theme === 'dark' ? 'rgb(68, 68, 68)' : 'rgb(38 93 181)',
      borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
  }}>
    <tr>
      <th className="reportes-checkbox-col" style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedReports.length === reportes.length}
        />
      </th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>ID</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Título</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {reportes.map((reporte, index) => (
      <tr key={reporte.id} className={theme} style={{ 
          backgroundColor: theme === 'dark' 
            ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
            : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
      }}>
        <td className="reportes-checkbox-col" style={{ padding: '12px' }}>
          <input
            type="checkbox"
            checked={selectedReports.includes(reporte.id)}
            onChange={() => handleSelectReport(reporte.id)}
          />
        </td>
        <td style={{ padding: '12px' }}>{reporte.id}</td>
        <td style={{ padding: '12px' }}>{reporte.nombre}</td>
        <td style={{ padding: '12px' }}>{reporte.fecha}</td>
        <td style={{ padding: '12px' }}>
          <button
            onClick={() => handleDescargarReporte(reporte.id)}
            className={`reportes-btn-descargar ${theme}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text)', 
              padding: '3px',
            }}
          >
            <Download size={16} color="var(--text)" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      <div className="reportes-pagination">
        <button className="reportes-pagination-btn"style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}>Anterior</button>
        <span>Página 1 de 1</span>
        <button className="reportes-pagination-btn"style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}>Siguiente</button>
      </div>
      <ModalGenerarReporteRecurrente
        isOpen={isRecurrentModalOpen}
        onClose={handleCloseRecurrentModal}
        theme={theme}
      />
      <ModalGenerarReporteActual
        isOpen={isActualModalOpen}
        onClose={handleCloseActualModal}
        theme={theme}
      />
    </div>
  );
}

export default DetailedReportes;
