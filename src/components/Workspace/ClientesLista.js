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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

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
    { key: 'alertas', label: 'Alertas' }
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

    useEffect(() => {
        cargarClientes();
    }, [API_BASE_URL]);

    const cargarClientes = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => {
                setClientes(response.data);
                toast.success('Clientes cargados correctamente');
            })
            .catch(error => {
                toast.error('Error al cargar los clientes');
            });
    };

    const handleClienteClick = (cliente) => {
        setSelectedCliente(prev => prev && prev._id === cliente._id ? null : cliente);
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
            await axios.post('${API_BASE_URL}/api/clientes/import', { clientes: csvData });
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

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const handleToggleComponentedesplegable = () => {
        setMostrarComponentedesplegable(prev => !prev);
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

    const handleAgregarNota = () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                setSelectedCliente(clienteSeleccionado);
                setMostrarModalAgregarNota(true);
                toast.info(`Agregar Nota seleccionado para: ${clienteSeleccionado.nombre}`);
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
    };

    const handleNotaAgregada = (nota) => {
        setClientes(prevClientes =>
            prevClientes.map(cliente =>
                cliente._id === selectedCliente._id
                    ? { ...cliente, notas: [...cliente.notas, nota] }
                    : cliente
            )
        );
    };

    const handlePlanEntrenamiento = async () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                try {
                    const response = await axios.get(`/api/clientes/${clienteSeleccionado._id}/rutinas`);
                    const rutina = response.data;
                    setSelectedCliente({ ...clienteSeleccionado, rutina });
                    setMostrarPlanEntrenamientoModal(true);
                    toast.info(`Plan de Entrenamiento Actual seleccionado para: ${clienteSeleccionado.nombre}`);
                } catch (error) {
                    toast.error('Error al obtener la rutina del cliente.');
                }
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
        setAnchorEl(null);
    };

    const handleClosePlanEntrenamientoModal = () => {
        setMostrarPlanEntrenamientoModal(false);
    };

    const handleAsignarObjetivos = () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                setSelectedCliente(clienteSeleccionado);
                setMostrarAsignarObjetivosModal(true);
                toast.info(`Asignar Objetivos seleccionado para: ${clienteSeleccionado.nombre}`);
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
        setAnchorEl(null);
    };

    const handlePlanDieta = () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                setSelectedCliente(clienteSeleccionado);
                setMostrarDietaModalActual(true);
                toast.info(`Plan de Dieta Actual seleccionado para: ${clienteSeleccionado.nombre}`);
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
        setAnchorEl(null);
    };

    const handleVerMensajes = () => {
        toast.info('Ver Mensajes seleccionado');
        setAnchorEl(null);
    };

    const handleActualizarMetodoPago = () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                setSelectedCliente(clienteSeleccionado);
                setMostrarActualizarMetodoPagoModal(true);
                toast.info(`Actualizar Método de Pago seleccionado para: ${clienteSeleccionado.nombre}`);
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
        setAnchorEl(null);
    };

    const handleVerBonos = () => {
        if (clientesSeleccionados.length === 1) {
            const clienteSeleccionado = clientes.find(cliente => cliente._id === clientesSeleccionados[0]);
            if (clienteSeleccionado) {
                setSelectedCliente(clienteSeleccionado);
                setMostrarModalBonos(true);
                toast.info(`Ver Bonos Asociados para: ${clienteSeleccionado.nombre}`);
            }
        } else {
            toast.error('Por favor, selecciona un cliente primero.');
        }
        setAnchorEl(null);
    };

    const handleCloseModalBonos = () => {
        setMostrarModalBonos(false);
    };

    const handleCloseAsignarObjetivosModal = () => {
        setMostrarAsignarObjetivosModal(false);
    };

    const handleCloseDietaModalActual = () => {
        setMostrarDietaModalActual(false);
    };

    const handleCloseActualizarMetodoPagoModal = () => {
        setMostrarActualizarMetodoPagoModal(false);
    };

    const handleVerEstadisticas = () => {
        toast.info('Ver Estadísticas seleccionado');
        setAnchorEl(null);
    };

    const handleExportarClientes = () => {
        toast.info('Exportar Clientes seleccionado');
        setAnchorEl(null);
    };

    const handleOpenDialogPlantilla = () => {
        setOpenDialogPlantilla(true);
    };

    const handleCloseDialogPlantilla = () => {
        setOpenDialogPlantilla(false);
    };

    const handleOpenDialogServicio = () => {
        setOpenDialogServicio(true);
    };

    const handleCloseDialogServicio = () => {
        setOpenDialogServicio(false);
    };

    return (
<div className={`clientes-lista ${theme}`}>
    <ToastContainer />

    <ResizableBox
        className="resizable-componentedesplegable-wrapper"
        width="100%"
        height={mostrarComponentedesplegable ? 300 : 0}
        minConstraints={[100, 150]}
        maxConstraints={[Infinity, 600]}
        axis="y"
        resizeHandles={['s']}
        handle={<div className="resize-handle" />}
    >
        {mostrarComponentedesplegable && (
            <Componentedesplegable
                onClose={() => setMostrarComponentedesplegable(false)}
                openChatModal={openChatModal}
                theme={theme}
            />
        )}
    </ResizableBox>

    {/* Sección de Encabezado */}
    <div className="clientes-lista-header">
        <div className="header-title-row">
            <h1 className="tituloClientes">¡Bienvenido de nuevo!</h1>
            <button className={`cliente-action-btn nuevo-cliente-btn ${theme}`} onClick={handleCrearCliente}>
                <MdOpenInBrowser size={20} />
                Nuevo Cliente
            </button>
        </div>
        <p className="subtituloClientes">¡Aquí tienes una lista de tus clientes!</p>
        <div className="actions">
            <input
                type="text"
                placeholder="Buscar clientes"
                value={filtro}
                onChange={handleFiltroChange}
                className={`filtro ${theme}`}
            />
            <ClientFilterDropdown onFilterChange={handleFilterChange} theme={theme} />
            <button className={`cliente-action-btn ${theme}`} onClick={() => setVistaCalendario(!vistaCalendario)}>
                {vistaCalendario ? <MdViewList size={20} /> : <MdViewModule size={20} />}
                {vistaCalendario ? 'Ver Tabla' : 'Ver Calendario'}
            </button>
            <button className={`cliente-action-btn ${theme}`} onClick={handleToggleServicios}>
                Servicios
            </button>
            <div>
                <button className={`cliente-action-btn ${theme}`} onClick={handleMenuClick}>
                    <MdExpandMore size={20} />
                    Más Acciones
                </button>
            </div>
        </div>
    </div>

            {/* Contenido Principal */}
            <div className="clientes-lista-contenido">
                {renderAppliedFilters()}
                <button className="fixed-button" onClick={handleDetailsClick}>Ver Detalles</button>
                {vistaServicios ? (
                    <ServiciosLista 
                        theme={theme}
                        isOpenServicioDialog={openDialogServicio}
                        onOpenServicioDialog={handleOpenDialogServicio}
                        onCloseServicioDialog={handleCloseDialogServicio}
                    />
                ) : vistaCalendario ? (
                    <CalendarView clientes={clientesFiltrados} vista={vistaCalendarioTipo} theme={theme} />
                ) : (
                    <table className="clientes-table">
                        <thead className={theme === 'dark' ? 'dark' : ''}>
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
        </div>
    );
    
};

export default ClientesLista;
