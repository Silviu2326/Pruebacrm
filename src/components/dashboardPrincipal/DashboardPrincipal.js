// /crm-frontend/src/components/dashboardPrincipal/DashboardPrincipal.js
import React, { useState } from 'react';
import { BookOpen, Share2, User } from 'lucide-react';
import ClientesListaDashboard from './ClientesListaDashboard';
import MetricCardDashboard from './MetricCardDashboard';
import ListaDeRutinasDashboard from './ListaDeRutinasDashboard';
import OverviewChartDashboard from './OverviewChartDashboard';
import BeneficioGraficoDashboard from './BeneficioGraficoDashboard';
import ModalPerfil from './ModalPerfil';
import ModalGenerarPublicacion from './ModalGenerarPublicacion';
import ModalGenerarHistoria from './ModalGenerarHistoria';
import './DashboardPrincipal.css';

function DashboardPrincipal({ theme, setTheme }) {
  const [isModalPerfilOpen, setIsModalPerfilOpen] = useState(false);
  const [isModalPublicacionOpen, setIsModalPublicacionOpen] = useState(false);
  const [isModalHistoriaOpen, setIsModalHistoriaOpen] = useState(false);

  const abrirModalPerfil = () => {
    setIsModalPerfilOpen(true);
  };

  const cerrarModalPerfil = () => {
    setIsModalPerfilOpen(false);
  };

  const abrirModalPublicacion = () => {
    setIsModalPublicacionOpen(true);
  };

  const cerrarModalPublicacion = () => {
    setIsModalPublicacionOpen(false);
  };

  const abrirModalHistoria = () => {
    setIsModalHistoriaOpen(true);
  };

  const cerrarModalHistoria = () => {
    setIsModalHistoriaOpen(false);
  };

  return (
    <div className={`dashboard-principal ${theme}`}>
      <div className={`dashboard-header ${theme}`}>
        <h1>Dashboard</h1>
        <div className={`dashboard-buttons ${theme}`}>
          <button className={`dashboard-button ${theme}`} onClick={abrirModalHistoria}>
            <BookOpen size={18} /> Generar Historia
          </button>
          <button
            className={`dashboard-button ${theme}`}
            onClick={abrirModalPublicacion}
            style={{
              background: 'var(--create-button-bg)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '14px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
          >
            <Share2 size={18} /> Generar Publicación
          </button>
          <button className={`dashboard-button ${theme}`} onClick={abrirModalPerfil}>
            <User size={18} /> Mi Perfil
          </button>
        </div>
      </div>

      {/* Renderiza los Modales según el estado */}
      {isModalPerfilOpen && <ModalPerfil theme={theme} onClose={cerrarModalPerfil} />}
      {isModalPublicacionOpen && <ModalGenerarPublicacion theme={theme} onClose={cerrarModalPublicacion} />}
      {isModalHistoriaOpen && <ModalGenerarHistoria theme={theme} onClose={cerrarModalHistoria} />}

      <div className={`dashboard-cards-container ${theme}`}>
        <MetricCardDashboard
          title="Ingresos Totales"
          value="$28,000"
          description="Ingresos acumulados este mes"
          icon="💰"
          valueClass="dashboard-metric-value-green"
        />
        <MetricCardDashboard
          title="Clientes Activos"
          value="150"
          description="Clientes que han estado activos este mes"
          icon="👥"
          valueClass="dashboard-metric-value-green"
        />
        <MetricCardDashboard
          title="Clases Este Mes"
          value="45"
          description="Número total de clases planificadas"
          icon="📅"
          valueClass="dashboard-metric-value-green"
        />
      </div>
      <div className={`dashboard-charts-section ${theme}`}>
        <OverviewChartDashboard theme={theme} />
        <BeneficioGraficoDashboard theme={theme} />
      </div>
      <div className={`dashboard-clients-section ${theme}`}>
        <ClientesListaDashboard theme={theme} />
      </div>
      <div className={`dashboard-classes-section ${theme}`}>
        <ListaDeRutinasDashboard theme={theme} />
      </div>
    </div>
  );
}

export default DashboardPrincipal;
