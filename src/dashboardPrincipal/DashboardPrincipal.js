import React from 'react';
import { BookOpen, Share2, User } from 'lucide-react';  // Importar los íconos necesarios
import ClientesListaDashboard from './ClientesListaDashboard';
import MetricCardDashboard from './MetricCardDashboard';
import ListaDeRutinasDashboard from './ListaDeRutinasDashboard';
import OverviewChartDashboard from './OverviewChartDashboard';
import BeneficioGraficoDashboard from './BeneficioGraficoDashboard';
import './DashboardPrincipal.css';

function DashboardPrincipal() {
  return (
    <div className="dashboard-principal">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-buttons">
          <button className="dashboard-button">
            <BookOpen size={18} /> Generar Historia
          </button>
          <button className="dashboard-button">
            <Share2 size={18} /> Generar Publicación
          </button>
          <button className="dashboard-button">
            <User size={18} /> Mi Perfil
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
    </div>
  );
}

export default DashboardPrincipal;
