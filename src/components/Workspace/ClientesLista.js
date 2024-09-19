import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ClienteDetalle from './panel_cliente/ClienteDetalle';
import CrearCliente from './CrearCliente';
import SeleccionCategoriasModal from '../SeleccionCategoriasModal';
import CalendarView from './calendario/CalendarView';
import PopupClienteCSV from './PopupClienteCSV';
import CommandPopup from './CommandPopup';
import Componentedesplegable from './Componentedesplegable/Componentedesplegable';
import ChaterModalInterfaz from './Componentedesplegable/ChaterModalInterfaz';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ClientFilterDropdown from '../Workspace/ClientFilterDropdown';
import './ClientesLista.css';
import { MdDelete, MdViewModule, MdViewList, MdUpload, MdOpenInBrowser, MdWbSunny, MdBrightness3, MdFilterList, MdClose, MdExpandMore, MdNoteAdd, MdFitnessCenter, MdFlag, MdRestaurant, MdMessage, MdPayment, MdCardGiftcard, MdBarChart, MdFileDownload } from 'react-icons/md';
import { Menu, MenuItem } from '@mui/material';
import AgregarNotaModal from './AgregarNotaModal';
import PlanEntrenamientoModal from './PlanEntrenamientoModal';
import AsignarObjetivosModal from './AsignarObjetivosModal';
import DietaModalActual from './Dietamodalactual';
import ActualizarMetodoPagoModal from './Actualizarmetodopago';
import ModalBonos from './ModalBonos';
import ServiciosLista from './ServiciosLista';
import {
    handleAsignarObjetivos,
    handlePlanDieta,
    handleAgregarNota,
    handleNotaAgregada,
    handlePlanEntrenamiento,
    handleClosePlanEntrenamientoModal,
    handleVerMensajes,
    handleActualizarMetodoPago,
    handleVerBonos,
    handleCloseModalBonos,
    handleCloseAsignarObjetivosModal,
    handleCloseDietaModalActual,
    handleCloseActualizarMetodoPagoModal,
    handleVerEstadisticas,
    handleExportarClientes,
    handleOpenDialogPlantilla,
    handleCloseDialogPlantilla,
    handleOpenDialogServicio,
    handleCloseDialogServicio,
    fetchServicesData,
    attachServiceInfoToClients,
    handleAddToService
} from './clienteHandlers';
import { titulos, subtitulos } from './textosClientes';
import { Briefcase } from 'lucide-react';
import { PlusCircle } from 'lucide-react';
import ClientesSimplificadaView from './ClientesSimplificadaView';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const camposDisponibles = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'estado', label: 'Estado' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'tag', label: 'Tag' },
    { key: 'tipoDePlan', label: 'Tipo de Plan' },
    { key: 'ultimoCheckin', label: 'Último Check-in' },
    { key: 'clase', label: 'Clase' },
    { key: 'porcentajeCumplimiento', label: '% Cumplimiento' },
    { key: 'alertas', label: 'Alertas' },
    { key: 'servicio', label: 'Servicio' } // Añadimos la nueva columna
];

const ClientesLista = ({ theme, setTheme }) => {
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox general
    const [mostrarModalCrearCliente, setMostrarModalCrearCliente] = useState(false);
    const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
    const [camposVisibles, setCamposVisibles] = useState(camposDisponibles.map(campo => campo.key));
    const [orden, setOrden] = useState({ campo: null, direccion: null });
    const [vistaCalendario, setVistaCalendario] = useState(false);
    const [vistaServicios, setVistaServicios] = useState(false);
    const [vistaCalendarioTipo, setVistaCalendarioTipo] = useState('month');
    const [mostrarPopupCSV, setMostrarPopupCSV] = useState(false);
    const [mostrarCommandPopup, setMostrarCommandPopup] = useState(false);
    const [mostrarComponentedesplegable, setMostrarComponentedesplegable] = useState(false);
    const [selectedChats, setSelectedChats] = useState([]);
    const [filtrosAvanzados, setFiltrosAvanzados] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [mostrarModalAgregarNota, setMostrarModalAgregarNota] = useState(false);
    const [mostrarPlanEntrenamientoModal, setMostrarPlanEntrenamientoModal] = useState(false);
    const [mostrarAsignarObjetivosModal, setMostrarAsignarObjetivosModal] = useState(false);
    const [mostrarDietaModalActual, setMostrarDietaModalActual] = useState(false);
    const [mostrarActualizarMetodoPagoModal, setMostrarActualizarMetodoPagoModal] = useState(false);
    const [mostrarModalBonos, setMostrarModalBonos] = useState(false);
    const [openDialogPlantilla, setOpenDialogPlantilla] = useState(false);
    const [openDialogServicio, setOpenDialogServicio] = useState(false);
    const [tituloAleatorio, setTituloAleatorio] = useState('');
    const [subtituloAleatorio, setSubtituloAleatorio] = useState('');
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [clientToAdd, setClientToAdd] = useState(null);
    const [vistaSimplificada, setVistaSimplificada] = useState(false);

    useEffect(() => {
        // Seleccionar un título y subtítulo aleatorios
        setTituloAleatorio(titulos[Math.floor(Math.random() * titulos.length)]);
        setSubtituloAleatorio(subtitulos[Math.floor(Math.random() * subtitulos.length)]);

        cargarClientes();
    }, [API_BASE_URL]);

    const cargarClientes = async () => {
        try {
            const [clientesResponse, servicesData] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/clientes`),
                fetchServicesData()
            ]);

            let clientesWithService = attachServiceInfoToClients(clientesResponse.data, servicesData);
            setClientes(clientesWithService);
            toast.success('Clientes y servicios cargados correctamente');
        } catch (error) {
            toast.error('Error al cargar los clientes o los servicios');
        }
    };

    const handleClienteClick = (cliente) => {
        setSelectedCliente(prev => prev && prev._id === cliente._id ? null : cliente);
    };
    const handleOpenDialogServicio = (setOpenDialogServicio) => {
        setOpenDialogServicio(true);
    };
    const handleCloseDialogServicio = (setOpenDialogServicio) => {
        setOpenDialogServicio(false);
    };
    const handleToggleServicios = () => { 
        setVistaServicios(prev => !prev);
        setVistaCalendario(false);
        if (!vistaServicios) {
            handleOpenDialogServicio();
        } else {
            handleCloseDialogServicio();
        }
    };
    const handleToggleVistaSimplificada = () => {
        setVistaSimplificada(prev => !prev);
    };
    
    const handleCheckboxChange = (e, cliente) => {
        e.stopPropagation();
        if (clientesSeleccionados.includes(cliente._id)) {
            setClientesSeleccionados(prev => prev.filter(id => id !== cliente._id));
            setSelectedCliente(null);
        } else {
            setClientesSeleccionados([cliente._id]);
            setSelectedCliente(cliente);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setClientesSeleccionados(clientes.map(cliente => cliente._id));
        } else {
            setClientesSeleccionados([]);
        }
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const handleCrearCliente = () => {
        setMostrarModalCrearCliente(true);
    };

    const handleCerrarModalCrearCliente = () => {
        setMostrarModalCrearCliente(false);
    };

    const handleClienteCreado = () => {
        cargarClientes();
        toast.success('Cliente creado correctamente');
    };

    const handleEliminarClientes = () => {
        axios.delete(`${API_BASE_URL}/api/clientes`, { data: { ids: clientesSeleccionados } })
            .then(() => {
                setClientes(prev => prev.filter(cliente => !clientesSeleccionados.includes(cliente._id)));
                setClientesSeleccionados([]);
                toast.success('Clientes eliminados correctamente');
            })
            .catch(error => {
                toast.error('Error al eliminar los clientes');
            });
    };

    const handleCampoVisibleChange = (campo) => {
        setCamposVisibles(prev =>
            prev.includes(campo) ? prev.filter(c => c !== campo) : [...prev, campo]
        );
    };

    const handleSort = (campo) => {
        setOrden(prev => ({
            campo,
            direccion: prev.campo === campo ? (prev.direccion === 'asc' ? 'desc' : 'asc') : 'asc'
        }));
    };

    const applyAdvancedFilters = (clientes, filtros) => {
        if (!Array.isArray(clientes)) return [];
        return clientes.filter(cliente =>
            Object.keys(filtros).every(key => {
                if (!filtros[key]) return true;
                return cliente[key] && cliente[key].toString().toLowerCase().startsWith(filtros[key].toLowerCase());
            })
        );
    };
    
    const sortClientes = (clientes) => {
        if (!Array.isArray(clientes)) return [];
        if (!orden.campo || !orden.direccion) return clientes;
    
        return [...clientes].sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const clientesFiltrados = applyAdvancedFilters(sortClientes(clientes), filtrosAvanzados);

    const handleFileUpload = () => {
        setMostrarPopupCSV(true);
    };

    const handleCSVConfirm = async (csvData) => {
        try {
            await axios.post(`${API_BASE_URL}/api/clientes/import`, { clientes: csvData });
            cargarClientes();
            toast.success('Clientes importados correctamente');
        } catch (error) {
            toast.error('Error al importar los clientes');
        }
    };

    const handleOpenCommandPopup = () => {
        setMostrarCommandPopup(true);
    };

    const handleCloseCommandPopup = () => {
        setMostrarCommandPopup(false);
    };

    const handleOpenServiceModal = (client) => {
        setClientToAdd(client);
        setServiceModalVisible(true);
    };

    const handleCloseServiceModal = () => {
        setClientToAdd(null);
        setServiceModalVisible(false);
    };

    const handleServiceSelection = async (serviceType, serviceId) => {
        if (clientToAdd && serviceType && serviceId) {
            const success = await handleAddToService(clientToAdd._id, serviceType, serviceId);
            if (success) {
                cargarClientes(); // Recargar clientes para reflejar los cambios
                handleCloseServiceModal();
            }
        }
    };

    const openChatModal = (chat) => {
        setSelectedChats(prev => (prev.find(c => c.id === chat.id) ? prev : [...prev, chat]));
    };

    const closeChatModal = (chatId) => {
        setSelectedChats(prev => prev.filter(chat => chat.id !== chatId));
    };

    const handleFilterChange = (filters) => {
        setFiltrosAvanzados(filters);
        setAppliedFilters(filters);
    };

    const removeFilter = (key) => {
        setFiltrosAvanzados(prev => ({ ...prev, [key]: '' }));
        setAppliedFilters(prev => ({ ...prev, [key]: '' }));
    };

    const renderAppliedFilters = () => {
        return (
            <div className="applied-filters">
                {Object.keys(appliedFilters).map(key => (
                    appliedFilters[key] && (
                        <div key={key} className="filter-tag">
                            {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${appliedFilters[key]}`}
                            <MdClose size={12} onClick={() => removeFilter(key)} />
                        </div>
                    )
                ))}
            </div>
        );
    };

    const handleDetailsClick = () => {
        setMostrarComponentedesplegable(true);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={`clientes-lista ${theme}`}>
            <ToastContainer />
            {/* Componente Desplegable */}
            {mostrarComponentedesplegable && (
                <div className="componentedesplegable-section">
                    <Componentedesplegable
                        onClose={() => setMostrarComponentedesplegable(false)}
                        openChatModal={openChatModal}
                        theme={theme}
                    />
                </div>
            )}
            {/* Sección de Encabezado */}
            <div className="clientes-lista-header">
                <div className="header-title-row">
                    <h1 className="tituloClientes">{tituloAleatorio}</h1>
                    <button className={`cliente-action-btn nuevo-cliente-btn ${theme}`} onClick={handleCrearCliente}>
                        <MdOpenInBrowser size={20} />
                        Nuevo Cliente
                    </button>
                </div>
                <p className="subtituloClientes">{subtituloAleatorio}</p>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Buscar clientes"
                        value={filtro}
                        onChange={handleFiltroChange}
                        className={`filtro ${theme}`}
                    />
                    <ClientFilterDropdown 
                        onFilterChange={handleFilterChange} 
                        clientes={clientes}  // Aquí pasamos la lista de clientes
                        theme={theme} 
                    />
                    <button className={`cliente-action-btn ${theme}`} onClick={handleToggleVistaSimplificada}>
                        {vistaSimplificada ? <MdViewModule size={20} /> : <MdViewList size={20} />}
                        {vistaSimplificada ? 'Ver Tabla Completa' : 'Vista Simplificada'}
                    </button>

                    <button className={`cliente-action-btn ${theme}`} onClick={() => setVistaCalendario(!vistaCalendario)}>
                        {vistaCalendario ? <MdViewList size={20} /> : <MdViewModule size={20} />}
                        {vistaCalendario ? 'Ver Tabla' : 'Ver Calendario'}
                    </button>
                    <button className={`cliente-action-btn ${theme}`} onClick={handleToggleServicios}>
    <Briefcase size={20} />
    Servicios
</button>
                    {/* Mostrar botón de importar clientes si hay 10 o menos clientes */}
                    {clientes.length <= 10 && (
                        <button className={`cliente-action-btn ${theme}`} onClick={handleFileUpload}>
                            <MdUpload size={20} />
                            Importar Clientes
                        </button>
                    )}

                    {/* Botón de Más Acciones siempre visible */}
                    <div>
                        <button className={`cliente-action-btn ${theme}`} onClick={handleMenuClick}>
                            <MdExpandMore size={20} />
                            Más Acciones
                        </button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {/* Solo incluir "Importar Clientes" en Más Acciones si hay más de 10 clientes */}
                            {clientes.length > 10 && (
                                <MenuItem onClick={handleFileUpload}>
                                    <MdUpload size={20} />
                                    Importar Clientes
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleEliminarClientes} disabled={clientesSeleccionados.length === 0}>
                                <MdDelete size={20} />
                                Eliminar Clientes Seleccionados
                            </MenuItem>
                            <MenuItem onClick={() => setMostrarModalCategorias(true)}>
                                <MdViewModule size={20} />
                                Seleccionar Categorías
                            </MenuItem>
                            <MenuItem onClick={handleOpenCommandPopup}>
                                <MdOpenInBrowser size={20} />
                                Abrir Comandos
                            </MenuItem>
                            <MenuItem onClick={handleAgregarNota} disabled={clientesSeleccionados.length !== 1}>
                                <MdNoteAdd size={20} />
                                Agregar Nota
                            </MenuItem>
                            <MenuItem onClick={handlePlanEntrenamiento} disabled={clientesSeleccionados.length !== 1}>
                                <MdFitnessCenter size={20} />
                                Plan de Entrenamiento Actual
                            </MenuItem>
                            <MenuItem onClick={handleAsignarObjetivos} disabled={clientesSeleccionados.length !== 1}>
                                <MdFlag size={20} />
                                Asignar Objetivos
                            </MenuItem>
                            <MenuItem onClick={handlePlanDieta} disabled={clientesSeleccionados.length !== 1}>
                                <MdRestaurant size={20} />
                                Plan de Dieta Actual
                            </MenuItem>
                            <MenuItem onClick={handleVerMensajes} disabled={clientesSeleccionados.length !== 1}>
                                <MdMessage size={20} />
                                Ver Mensajes
                            </MenuItem>
                            <MenuItem onClick={handleActualizarMetodoPago} disabled={clientesSeleccionados.length !== 1}>
                                <MdPayment size={20} />
                                Actualizar Método de Pago
                            </MenuItem>
                            <MenuItem onClick={handleVerBonos} disabled={clientesSeleccionados.length !== 1}>
                                <MdCardGiftcard size={20} />
                                Ver Bonos Asociados
                            </MenuItem>
                            <MenuItem onClick={handleVerEstadisticas} disabled={clientesSeleccionados.length !== 1}>
                                <MdBarChart size={20} />
                                Ver Estadísticas Generadas
                            </MenuItem>
                            <MenuItem onClick={handleExportarClientes}>
                                <MdFileDownload size={20} />
                                Exportar Clientes
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
{/* Contenido Principal */}
<div className="clientes-lista-contenido">
    {renderAppliedFilters()}
    <button className="fixed-button" onClick={handleDetailsClick}>Abrir desplegable</button>
    {vistaServicios ? (
        <ServiciosLista 
            theme={theme}
            isOpenServicioDialog={openDialogServicio}
            onOpenServicioDialog={handleOpenDialogServicio}
            onCloseServicioDialog={handleCloseDialogServicio}
        />
    ) : vistaSimplificada ? (
        <ClientesSimplificadaView clientes={clientesFiltrados} theme={theme} />
    ) : vistaCalendario ? (
        <CalendarView clientes={clientesFiltrados} vista={vistaCalendarioTipo} theme={theme} />
    ) : (
        <table className="clientes-table">
            <thead 
                className={theme === 'dark' ? 'dark' : ''} 
                style={{ position: 'relative', zIndex: 1 }}
            >
                <tr>
                    <th>
                        <input 
                            type="checkbox" 
                            checked={selectAll}
                            onChange={handleSelectAll}
                        />
                    </th>
                    {camposDisponibles.map(campo => camposVisibles.includes(campo.key) && (
                        <th key={campo.key} onClick={() => handleSort(campo.key)}>
                            {campo.label} {orden.campo === campo.key && (orden.direccion === 'asc' ? '▲' : 'desc' ? '▼' : '')}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {clientesFiltrados.map((cliente) => (
                    <React.Fragment key={cliente._id}>
                        <tr 
                            onClick={() => handleClienteClick(cliente)}
                            className={selectedCliente && selectedCliente._id === cliente._id ? 'selected-client' : ''}
                        >
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={clientesSeleccionados.includes(cliente._id)}
                                    onChange={(e) => handleCheckboxChange(e, cliente)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                            {camposVisibles.includes('nombre') && <td>{cliente.nombre}</td>}
                            {camposVisibles.includes('apellido') && <td>{cliente.apellido}</td>}
                            {camposVisibles.includes('estado') && <td>{cliente.estado}</td>}
                            {camposVisibles.includes('telefono') && <td>{cliente.telefono}</td>}
                            {camposVisibles.includes('email') && <td>{cliente.email}</td>}
                            {camposVisibles.includes('tag') && <td>{cliente.tag}</td>}
                            {camposVisibles.includes('tipoDePlan') && <td>{cliente.tipoDePlan}</td>}
                            {camposVisibles.includes('ultimoCheckin') && <td>{cliente.ultimoCheckin}</td>}
                            {camposVisibles.includes('clase') && <td>{cliente.clase ? cliente.clase.nombre : 'Sin clase asociada'}</td>}
                            {camposVisibles.includes('porcentajeCumplimiento') && <td>{cliente.porcentajeCumplimiento}</td>}
                            {camposVisibles.includes('alertas') && <td>{cliente.alertas}</td>}
                            {camposVisibles.includes('servicio') && (
                                <td>
                                    {cliente.service || (
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenServiceModal(cliente); }}>
                                            <PlusCircle size={20} />
                                            Añadir a un servicio
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                        {selectedCliente && selectedCliente._id === cliente._id && (
                            <tr className="cliente-detalle-row">
                                <td colSpan={camposVisibles.length + 1}>
                                    <div className={`client-detail-wrapper ${theme}`}>
                                        <ClienteDetalle cliente={selectedCliente} theme={theme} />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    )}

    {/* Modales y Otros Componentes */}
    {mostrarModalCrearCliente && (
        <CrearCliente
            onClose={handleCerrarModalCrearCliente}
            onClienteCreado={handleClienteCreado}
            theme={theme}
        />
    )}
    {mostrarModalCategorias && (
        <SeleccionCategoriasModal
            camposDisponibles={camposDisponibles}
            camposVisibles={camposVisibles}
            handleCampoVisibleChange={handleCampoVisibleChange}
            onClose={() => setMostrarModalCategorias(false)}
            theme={theme}
        />
    )}
    {mostrarPopupCSV && (
        <PopupClienteCSV
            onClose={() => setMostrarPopupCSV(false)}
            onConfirm={handleCSVConfirm}
            theme={theme}
        />
    )}
    {mostrarCommandPopup && (
        <CommandPopup onClose={handleCloseCommandPopup} theme={theme} />
    )}
    {selectedChats.map(chat => (
        <ChaterModalInterfaz
            key={chat.id}
            chat={chat}
            onClose={() => closeChatModal(chat.id)}
            theme={theme}
        />
    ))}
</div>

            {/* Modal para Añadir a un Servicio */}
            {serviceModalVisible && (
                <div className="modal-servicio">
                    <div className="modal-content">
                        <h2>Seleccionar Servicio para {clientToAdd?.nombre}</h2>
                        <div className="service-options">
                            {/* Ejemplo de opciones para seleccionar servicio */}
                            <button onClick={() => handleServiceSelection('Clase grupal', 'serviceGroupClassId')}>
                                Clase grupal
                            </button>
                            <button onClick={() => handleServiceSelection('Suscripción', 'serviceSubscriptionId')}>
                                Suscripción
                            </button>
                            <button onClick={() => handleServiceSelection('Consulta individual', 'serviceConsultationId')}>
                                Consulta individual
                            </button>
                        </div>
                        <button className="close-modal" onClick={handleCloseServiceModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientesLista;
