import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OverviewChartPopup from './DuplicadosPopup/OverviewChartPopup';
import MetricCardPopup from './DuplicadosPopup/MetricCardPopup';
import RecentSalesPopup from './DuplicadosPopup/RecentSalesPopup';
import WidgetPrevisionesPopup from './DuplicadosPopup/WidgetPrevisionesPopup';
import WidgetGastoPopup from './DuplicadosPopup/WidgetGastoPopup';
import BeneficioChartPopup from './DuplicadosPopup/BeneficioChartPopup';
import NavegadorDeGraficos from './NavegadorDeGraficos';
import './DetailedIngresoBeneficio.css';
import { TrendingUp, DollarSign, LineChart, BarChart2, Users } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const DetailedIngresoBeneficio = ({ 
  onTabChange, 
  theme, 
  setTheme, 
  totalIngresos, 
  clientesActuales 
}) => {
  const [gastos, setGastos] = useState([]); 
  const [ingresosEsperados, setIngresosEsperados] = useState([]);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/expenses/`);
        console.log('Datos de gastos obtenidos:', response.data);
        setGastos(response.data);
      } catch (error) {
        console.error('Error al cargar los gastos:', error);
      }
    };

    fetchGastos();
  }, []);

  const totalGastos = gastos.reduce((acc, gasto) => {
    console.log('Sumando gasto:', gasto.amount);
    return acc + gasto.amount;
  }, 0);

  const beneficioNeto = totalIngresos - totalGastos;
  const margenGanancia = totalIngresos > 0 ? (beneficioNeto / totalIngresos) * 100 : 0;
  const proyeccionMes = beneficioNeto;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleEconomiaTabClick = () => {
    onTabChange('Panel de Control');
  };

  const getValueClass = (value, isExpense = false) => {
    if (isExpense) {
      return 'panelcontrol-metric-value-red'; // Always red for expenses
    }
    return value < 0 ? 'panelcontrol-metric-value-red' : 'panelcontrol-metric-value-green';
  };

  return (
    <div className={`detailed-ingreso-beneficio-modal ${theme}`}>
      <div className={`detailed-ingreso-beneficio-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />
        
        <div className={`detailed-metrics-grid ${theme}`}>
  <div className="metrics-column">
    <MetricCardPopup
      value={`$${proyeccionMes.toFixed(2)}`}
      description="Proyección del mes"
      icon={<TrendingUp size={24} />}  // Icono de Lucide
      valueClass={getValueClass(proyeccionMes)}
      difference={{ value: 15 }}
      theme={theme}
      setTheme={setTheme}
    />
    <MetricCardPopup
      value={`$${totalIngresos.toFixed(2)}`}
      description="Ingresos"
      icon={<DollarSign size={24} />}  // Icono de Lucide
      valueClass={getValueClass(totalIngresos)}
      difference={{ value: 20 }}
      theme={theme}
      setTheme={setTheme}
    />
  </div>
  <div className="metrics-column">
    <MetricCardPopup
      value={`$${totalGastos.toFixed(2)}`}
      description="Gasto Mensual"
      icon={<DollarSign size={24} />}  // Icono de Lucide, puedes usar el mismo para gastos o cambiarlo
      valueClass="panelcontrol-metric-value-red" // Siempre rojo para gastos
      difference={{ value: 10 }}
      isExpense={true}
      theme={theme}
      setTheme={setTheme}
    />
    <MetricCardPopup
      value={`${margenGanancia.toFixed(2)}%`}
      description="Margen de ganancia"
      icon={<BarChart2 size={24} />}  // Icono de Lucide
      valueClass={getValueClass(margenGanancia)}
      difference={{ value: 0 }}
      theme={theme}
      setTheme={setTheme}
    />
  </div>
  <div className="metrics-column">
    <MetricCardPopup
      value={`$${beneficioNeto.toFixed(2)}`}
      description="Beneficio neto"
      icon={<LineChart size={24} />}  // Icono de Lucide
      valueClass={getValueClass(beneficioNeto)}
      difference={{ value: 8 }}
      theme={theme}
      setTheme={setTheme}
    />
    <MetricCardPopup
      value={clientesActuales}
      description="Clientes Nuevos"
      icon={<Users size={24} />}  // Icono de Lucide
      valueClass={getValueClass(clientesActuales)}
      difference={{ value: 5 }}
      theme={theme}
      setTheme={setTheme}
    />
  </div>
</div>
        <div className="detailed-recent-sales">
          <RecentSalesPopup detailed={true} theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-overview-chart">
          <OverviewChartPopup detailed={true} theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-previsiones-table">
          <WidgetPrevisionesPopup theme={theme} setTheme={setTheme} setIngresosEsperados={setIngresosEsperados} ingresosEsperados={ingresosEsperados}/>
        </div>
        <div className="detailed-beneficio-chart">
          <BeneficioChartPopup theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-gasto-chart">
          <WidgetGastoPopup theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </div>
  );
};

export default DetailedIngresoBeneficio;
