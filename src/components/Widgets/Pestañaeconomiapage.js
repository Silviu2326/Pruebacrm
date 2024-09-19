import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import axios from 'axios';
import DetailedIngresoBeneficio from './Componentepanelcontrol/DetailedIngresoBeneficio';
import DetailedDocumento from './Documentos/DetailedDocumento';
import DetailedFactura from './facturas/DetailedFactura';
import DetailedPlanes from './Componentepanelcontrol/DetailedPlanes';
import DetailedReportes from './DetailedReportes';

import ModalDeEscaneoDeFacturas from './facturas/ModalDeEscaneoDeFacturas';
import NavegadorDeGraficos from './Componentepanelcontrol/NavegadorDeGraficos';
import MetricCard from './Componentepanelcontrol/MetricCard';
import OverviewChart from './Componentepanelcontrol/OverviewChart';
import RecentSales from './Componentepanelcontrol/RecentSales';
import PopupDeMetricCard from './Componentepanelcontrol/PopupDeMetricCard';
import WidgetGastos from './Gastos/widget-gastos';
import WidgetDocumentos from './Documentos/widget-Documentos';
import WidgetFacturas from './facturas/widget-facturas';
import WidgetPrevisiones from './widgetprevisiones/WidgetPrevisiones';
import WidgetGasto from './Widgetgasto/widgetgasto';
import BeneficioGrafico from './Ingresos-beneficios/BeneficioGrafico';
import Tablaplanescliente from './Planes/Tablaplanescliente';
import Bonos from './Bonos/Bonos';
import WidgetCuentaBancaria from './Gastos/widget-gastos';
import WidgetPrevisionesPopup from './Componentepanelcontrol/DuplicadosPopup/WidgetPrevisionesPopup';
import Alertas from './Alertas/Alertas';
import BarraComponentewidgets from './Barracomponentewidgets';  // Importa el nuevo componente
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Pestañaeconomiapage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function createLayout(id, x, y, w, h) {
  return [{ i: id, x: x, y: y, w: w, h: h }];
}

function Pestañaeconomiapage({ theme, setTheme }) {
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [isDetailedFacturaOpen, setIsDetailedFacturaOpen] = useState(false);
  const [isDetailedPlanesOpen, setIsDetailedPlanesOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBarraWidgetsOpen, setIsBarraWidgetsOpen] = useState(false);
  const [removedWidgets, setRemovedWidgets] = useState([]); // Estado para widgets eliminados
  const [activeTab, setActiveTab] = useState('Panel de Control');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownContent, setDropdownContent] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [layout, setLayout] = useState([
    { i: 'proyeccionMes', x: 0, y: 0, w: 3, h: 2 },
    { i: 'gastoMensual', x: 3, y: 0, w: 3, h: 2 },
    { i: 'planesVendidos', x: 6, y: 0, w: 3, h: 2 },
    { i: 'clientesActuales', x: 9, y: 0, w: 3, h: 2 },
    { i: 'ingresoMensual', x: 0, y: 2, w: 3, h: 2 },
    { i: 'ingresos', x: 3, y: 2, w: 3, h: 2 },
    { i: 'margenGanancia', x: 6, y: 2, w: 3, h: 2 },
    { i: 'clientesNuevos', x: 9, y: 2, w: 3, h: 2 },
    { i: 'overviewChart', x: 0, y: 4, w: 6, h: 5 },
    { i: 'recentSales', x: 6, y: 4, w: 6, h: 5 },
    { i: 'alertas', x: 0, y: 9, w: 6, h: 4 },
    { i: 'gasto', x: 6, y: 9, w: 6, h: 4 },
    { i: 'cuentaBancaria', x: 0, y: 13, w: 6, h: 4 },
    { i: 'beneficioGrafico', x: 6, y: 13, w: 6, h: 4 },
    { i: 'documentos', x: 0, y: 17, w: 6, h: 5 },
    { i: 'facturas', x: 6, y: 17, w: 6, h: 5 },
    { i: 'tablaPlanes', x: 0, y: 22, w: 6, h: 4 },
    { i: 'bonos', x: 6, y: 22, w: 6, h: 4 }
  ]);

  const [proyeccionMes, setProyeccionMes] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [margenGanancia, setMargenGanancia] = useState(0);
  const [suscripciones, setSuscripciones] = useState(0);
  const [planesVendidos, setPlanesVendidos] = useState(0);
  const [clientesActuales, setClientesActuales] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [ingresosEsperados, setIngresosEsperados] = useState([]);

  const handleToggleDropdown = (event, content) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setDropdownContent(content);
    setIsDropdownOpen(!isDropdownOpen);
    setDropdownPosition({
      top: buttonRect.bottom + window.scrollY + 5, 
      left: buttonRect.left + window.scrollX + 5,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosResponse, gastosResponse, planesFijosResponse, planesVariablesResponse, clientesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/incomes/`),
          axios.get(`${API_BASE_URL}/api/expenses/`),
          axios.get(`${API_BASE_URL}/plans/fixed`),
          axios.get(`${API_BASE_URL}/plans/variable`),
          axios.get(`${API_BASE_URL}/api/clientes/`),
        ]);

        const ingresosData = ingresosResponse.data;
        const gastosData = gastosResponse.data;
        const totalIngresos = ingresosData.reduce((acc, ingreso) => acc + parseFloat(ingreso.cantidad || 0), 0);
        const totalGastos = gastosData.reduce((acc, gasto) => acc + parseFloat(gasto.amount || 0), 0);
        const planesVendidos = planesFijosResponse.data.length + planesVariablesResponse.data.length;
        const clientesActuales = clientesResponse.data.length;

        const currentMonth = new Date().getMonth() + 1;
        const ingresoMensual = ingresosData
          .filter(ingreso => new Date(ingreso.fecha).getMonth() + 1 === currentMonth)
          .reduce((acc, ingreso) => acc + parseFloat(ingreso.cantidad || 0), 0);

        setTotalIngresos(totalIngresos);
        setGastos(gastosData);
        setTotalGastos(totalGastos);
        setPlanesVendidos(planesVendidos);
        setClientesActuales(clientesActuales);
        setIngresosEsperados(ingresosData);
        setIngresoMensual(ingresoMensual);

        const beneficioNeto = totalIngresos - totalGastos;
        const margenGanancia = totalIngresos > 0 ? (beneficioNeto / totalIngresos) * 100 : 0;
        setProyeccionMes(beneficioNeto);
        setMargenGanancia(margenGanancia);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Cashflow');
  };

  const handleOpenDetailedDocumento = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(true);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Documentos');
  };

  const handleOpenDetailedFactura = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(true);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Facturas');
  };

  const handleOpenDetailedPlanes = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(true);
    setShowControlPanel(false);
    setActiveTab('Planes');
  };

  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
    setShowControlPanel(false);
    setActiveTab('Facturas');
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedDocumento = () => {
    setIsDetailedDocumentoOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedFactura = () => {
    setIsDetailedFacturaOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedPlanes = () => {
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRemoveItem = (i) => {
    const removedWidget = layout.find(item => item.i === i);
    setRemovedWidgets([...removedWidgets, removedWidget]); // Añadir el widget eliminado al estado
    setLayout(layout.filter(item => item.i !== i));
  };

  const handleReaddWidget = (widget) => {
    setLayout([...layout, widget]);
    setRemovedWidgets(removedWidgets.filter(item => item.i !== widget.i));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const toggleBarraWidgets = () => {
    setIsBarraWidgetsOpen(!isBarraWidgetsOpen);
  };

  const getValueClass = (value, isExpense = false) => {
    if (isExpense) {
      return 'panelcontrol-metric-value-red';
    }
    return value < 0 ? 'panelcontrol-metric-value-red' : 'panelcontrol-metric-value-green';
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'Panel de Control':
        setIsDetailedModalOpen(false);
        setIsDetailedDocumentoOpen(false);
        setIsDetailedFacturaOpen(false);
        setIsDetailedPlanesOpen(false);
        setShowControlPanel(true);
        break;
      case 'Cashflow':
        handleOpenDetailedModal();
        break;
      case 'Planes':
        handleOpenDetailedPlanes();
        break;
      case 'Documentos':
        handleOpenDetailedDocumento();
        break;
      case 'Facturas':
        handleOpenDetailedFactura();
        break;
      case 'Reportes':
        setIsDetailedModalOpen(false);
        setIsDetailedDocumentoOpen(false);
        setIsDetailedFacturaOpen(false);
        setIsDetailedPlanesOpen(false);
        setShowControlPanel(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`pestaña-economia ${theme}`}>
      {isDetailedModalOpen && <DetailedIngresoBeneficio 
        onTabChange={handleTabChange} 
        activeTab={activeTab} 
        theme={theme} 
        setTheme={setTheme}
        totalIngresos={totalIngresos}
        suscripciones={suscripciones}
        planesVendidos={planesVendidos}
        clientesActuales={clientesActuales}
        gastos={gastos}
        ingresosEsperados={ingresosEsperados}
      />}
      {isDetailedDocumentoOpen && <DetailedDocumento onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {isDetailedFacturaOpen && <DetailedFactura onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {isDetailedPlanesOpen && <DetailedPlanes onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {activeTab === 'Reportes' && (
        <DetailedReportes
          onTabChange={handleTabChange}
          activeTab={activeTab}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {isScanModalOpen && <ModalDeEscaneoDeFacturas isOpen={isScanModalOpen} onClose={handleCloseScanModal} theme={theme} setTheme={setTheme} />}
      {showControlPanel && !isDetailedModalOpen && !isDetailedDocumentoOpen && !isDetailedFacturaOpen && !isDetailedPlanesOpen && !isScanModalOpen && (
        <div className={`widget-background ${theme}`}>
          <h1>Economía</h1>
          <div className="NavBtn">
            <NavegadorDeGraficos onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />
            <div className="boton-popup-edit">
              <button className="edit-mode-btn" onClick={toggleEditMode}>
                {isEditMode ? 'Salir del Modo Edición' : 'Modo Edición'}
              </button>
              {isEditMode && (
                <button className="barra-widgets-btn" onClick={toggleBarraWidgets}>
                  {isBarraWidgetsOpen ? 'Cerrar Barra de Widgets' : 'Abrir Barra de Widgets'}
                </button>
              )}
            </div>
          </div>
          {activeTab === 'Panel de Control' && (
            <>
              <ResponsiveGridLayout
                className="Ecolayout"
                layouts={{ lg: createLayout('panelcontrol', 0, 0, 12, 6) }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                draggableHandle=".widget-handle"
                isResizable={false}
              >
                <div key="panelcontrol" className={`main-widget ${theme}`}>
                  <div className={`panelcontrol-widget ${theme}`}>
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={{ lg: layout }}
                      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      rowHeight={100}
                      draggableHandle={isEditMode ? ".widget-drag-handle" : ""}
                      isDraggable={isEditMode}
                      isResizable={isEditMode}
                    >
                      {layout.map(item => (
                        <div key={item.i} className={`widget ${item.i}${theme}-widget`}>
                          {isEditMode && (
                            <>
                              <div className="widget-drag-handle"></div>
                              <button className="widget-remove-btn" onClick={() => handleRemoveItem(item.i)}>×</button>
                            </>
                          )}
                          {item.i === 'proyeccionMes' && (
                            <MetricCard
                              title="Proyección del Mes"
                              value={`$${(proyeccionMes || 0).toFixed(2)}`}
                              description="Proyección del mes"
                              icon="📈"
                              valueClass={getValueClass(proyeccionMes)}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'gastoMensual' && (
                            <MetricCard
                              title="Gasto Mensual"
                              value={`$${(totalGastos || 0).toFixed(2)}`}
                              description="Gasto mensual"
                              icon="💸"
                              valueClass="panelcontrol-metric-value-red"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'ingresoMensual' && (
                            <MetricCard
                              title="Ingreso Mensual"
                              value={`$${(ingresoMensual || 0).toFixed(2)}`}
                              description="Ingreso mensual actual"
                              icon="💰"
                              valueClass={getValueClass(ingresoMensual)}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'ingresos' && (
                            <MetricCard
                              title="Ingresos"
                              value={`$${(totalIngresos || 0).toFixed(2)}`}
                              description="Ingresos totales"
                              icon="💰"
                              valueClass={getValueClass(totalIngresos)}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'margenGanancia' && (
                            <MetricCard
                              title="Margen de Ganancia"
                              value={`${(margenGanancia || 0).toFixed(2)}%`}
                              description="Margen de ganancia"
                              icon="📊"
                              valueClass={getValueClass(margenGanancia)}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'clientesNuevos' && (
                            <MetricCard
                              title="Clientes Nuevos"
                              value={clientesActuales || 0}
                              description="Clientes nuevos"
                              icon="👥"
                              valueClass={getValueClass(clientesActuales)}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'planesVendidos' && (
                            <MetricCard
                              title="Planes Vendidos"
                              value={planesVendidos || 0}
                              description="Total planes vendidos"
                              icon="📄"
                              valueClass="panelcontrol-metric-value-green"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'clientesActuales' && (
                            <MetricCard
                              title="Clientes Actuales"
                              value={clientesActuales || 0}
                              description="Total clientes actuales"
                              icon="📈"
                              valueClass="panelcontrol-metric-value-green"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'overviewChart' && (
                            <div>
                              <OverviewChart onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} />
                            </div>
                          )}
                          {item.i === 'recentSales' && (
                            <div>
                              <RecentSales 
                                isEditMode={isEditMode} 
                                onTitleClick={handleOpenDetailedModal} 
                                theme={theme} 
                                setTheme={setTheme}
                                ventasRecientes={ingresosEsperados}
                              />
                            </div>
                          )}
                          {item.i === 'previsiones' && (
                            <WidgetPrevisiones 
                              onTitleClick={handleOpenDetailedModal} 
                              isEditMode={isEditMode} 
                              handleRemoveItem={handleRemoveItem} 
                              theme={theme} 
                              isDropdownOpen={isDropdownOpen} 
                              toggleDropdown={handleToggleDropdown}
                              dropdownPosition={dropdownPosition}
                              setDropdownContent={setDropdownContent}
                            />
                          )}
                          {item.i === 'documentos' && (
                            <WidgetDocumentos isEditMode={isEditMode} onTitleClick={handleOpenDetailedDocumento} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'facturas' && (
                            <WidgetFacturas isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} onTitleClick={handleOpenDetailedFactura} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'cuentaBancaria' && (
                            <WidgetCuentaBancaria 
                              onTitleClick={handleOpenDetailedModal} 
                              theme={theme} 
                              beneficio={proyeccionMes}  // Pasa el valor de proyeccionMes
                              valueClass={getValueClass(proyeccionMes)}  // Pasa la clase CSS calculada
                              setTheme={setTheme} 
                            />
                          )}
                          {item.i === 'gasto' && (
                            <WidgetGasto isEditMode={isEditMode} onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} gastos={gastos} />
                          )}
                          {item.i === 'beneficioGrafico' && (
                            <BeneficioGrafico isEditMode={isEditMode} onTitleClick={handleOpenDetailedModal} handleRemoveItem={handleRemoveItem} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'tablaPlanes' && (
                            <Tablaplanescliente onTitleClick={handleOpenDetailedPlanes} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'bonos' && (
                            <Bonos onTitleClick={handleOpenDetailedPlanes} theme={theme} isEditMode={isEditMode} setTheme={setTheme} />
                          )}
                          {item.i === 'alertas' && (
                            <Alertas onTabChange={handleTabChange} theme={theme} setTheme={setTheme} />
                          )}
                        </div>
                      ))}
                    </ResponsiveGridLayout>
                    <PopupDeMetricCard isOpen={isPopupOpen} onClose={handleClosePopup} theme={theme} setTheme={setTheme} />
                  </div>
                </div>
              </ResponsiveGridLayout>
            </>
          )}
          {isBarraWidgetsOpen && (
            <div className="barra-component-widgets">
              <BarraComponentewidgets 
                theme={theme} 
                setTheme={setTheme} 
                removedWidgets={removedWidgets}  // Pasa los widgets eliminados al componente de la barra
                onReaddWidget={handleReaddWidget}  // Pasa la función para reinsertar widgets
              />
            </div>
          )}
        </div>
      )}
      
      {isDropdownOpen && dropdownContent && (
        <div className={`Prevdropdown-content ${theme}`} style={{ 
          position: 'absolute', 
          top: dropdownPosition.top, 
          left: dropdownPosition.left, 
          zIndex: 10000 
        }}>
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export default Pestañaeconomiapage;
