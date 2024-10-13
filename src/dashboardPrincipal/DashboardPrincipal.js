// src/components/DashboardPrincipal/DashboardPrincipal.jsx
import React, { useState } from 'react';
import { BookOpen, Share2, User } from 'lucide-react'; // Asegúrate de tener lucide-react instalado
import ClientesListaDashboard from '../ClientesListaDashboard';
import MetricCardDashboard from '../MetricCardDashboard';
import ListaDeRutinasDashboard from '../ListaDeRutinasDashboard';
import OverviewChartDashboard from '../OverviewChartDashboard';
import BeneficioGraficoDashboard from '../BeneficioGraficoDashboard';
import GenerarHistoriaModal from './GenerarHistoriaModal';
import GenerarPublicacionModal from './GenerarPublicacionModal';
import MiPerfilModal from './MiPerfilModal';
import './DashboardPrincipal.css';

function DashboardPrincipal() {
  const [isHistoriaModalOpen, setIsHistoriaModalOpen] = useState(false);
  const [isPublicacionModalOpen, setIsPublicacionModalOpen] = useState(false);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);

  const openHistoriaModal = () => {
    console.log('Abriendo Generar Historia Modal');
    setIsHistoriaModalOpen(true);
  };

  const openPublicacionModal = () => {
    console.log('Abriendo Generar Publicación Modal');
    setIsPublicacionModalOpen(true);
  };

  const openPerfilModal = () => {
    console.log('Abriendo Mi Perfil Modal');
    setIsPerfilModalOpen(true);
  };

  const closeHistoriaModal = () => setIsHistoriaModalOpen(false);
  const closePublicacionModal = () => setIsPublicacionModalOpen(false);
  const closePerfilModal = () => setIsPerfilModalOpen(false);

  return (
    <div className="dashboard-principal">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-buttons">
          <button className="dashboard-button" onClick={openHistoriaModal}>
            <BookOpen size={18} /> Generar Historia
          </button>
          <button className="dashboard-button" onClick={openPublicacionModal}>
            <Share2 size={18} /> Generar Publicación
          </button>
          <button className="dashboard-button" onClick={openPerfilModal}>
            <User size={18} /> Mi perfil
          </button>
        </div>
      </div>
      <div className="dashboard-cards-container">
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
      <div className="dashboard-charts-section">
        <OverviewChartDashboard />
        <BeneficioGraficoDashboard />
      </div>
      <div className="dashboard-clients-section">
        <ClientesListaDashboard />
      </div>
      <div className="dashboard-classes-section">
        <ListaDeRutinasDashboard />
      </div>

      {/* Modales */}
      {isHistoriaModalOpen && <GenerarHistoriaModal onClose={closeHistoriaModal} />}
      {isPublicacionModalOpen && <GenerarPublicacionModal onClose={closePublicacionModal} />}
      {isPerfilModalOpen && <MiPerfilModal onClose={closePerfilModal} />}
    </div>
  );
}

export default DashboardPrincipal;
