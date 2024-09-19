// src/clienteHandlers.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Funciones ya existentes
export const handleAsignarObjetivos = (clientesSeleccionados, clientes, setSelectedCliente, setMostrarAsignarObjetivosModal) => {
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
};

export const handlePlanDieta = (clientesSeleccionados, clientes, setSelectedCliente, setMostrarDietaModalActual) => {
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
};

// Nuevas funciones

export const handleAgregarNota = (clientesSeleccionados, clientes, setSelectedCliente, setMostrarModalAgregarNota) => {
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

export const handleNotaAgregada = (nota, selectedCliente, setClientes) => {
    setClientes(prevClientes =>
        prevClientes.map(cliente =>
            cliente._id === selectedCliente._id
                ? { ...cliente, notas: [...cliente.notas, nota] }
                : cliente
        )
    );
};

export const handlePlanEntrenamiento = async (clientesSeleccionados, clientes, setSelectedCliente, setMostrarPlanEntrenamientoModal, setAnchorEl) => {
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

export const handleClosePlanEntrenamientoModal = (setMostrarPlanEntrenamientoModal) => {
    setMostrarPlanEntrenamientoModal(false);
};

export const handleVerMensajes = (setAnchorEl) => {
    toast.info('Ver Mensajes seleccionado');
    setAnchorEl(null);
};

export const handleActualizarMetodoPago = (clientesSeleccionados, clientes, setSelectedCliente, setMostrarActualizarMetodoPagoModal, setAnchorEl) => {
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

export const handleVerBonos = (clientesSeleccionados, clientes, setSelectedCliente, setMostrarModalBonos, setAnchorEl) => {
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

export const handleCloseModalBonos = (setMostrarModalBonos) => {
    setMostrarModalBonos(false);
};

export const handleCloseAsignarObjetivosModal = (setMostrarAsignarObjetivosModal) => {
    setMostrarAsignarObjetivosModal(false);
};

export const handleCloseDietaModalActual = (setMostrarDietaModalActual) => {
    setMostrarDietaModalActual(false);
};

export const handleCloseActualizarMetodoPagoModal = (setMostrarActualizarMetodoPagoModal) => {
    setMostrarActualizarMetodoPagoModal(false);
};

export const handleVerEstadisticas = (setAnchorEl) => {
    toast.info('Ver Estadísticas seleccionado');
    setAnchorEl(null);
};

export const handleExportarClientes = (setAnchorEl) => {
    toast.info('Exportar Clientes seleccionado');
    setAnchorEl(null);
};

export const handleOpenDialogPlantilla = (setOpenDialogPlantilla) => {
    setOpenDialogPlantilla(true);
};

export const handleCloseDialogPlantilla = (setOpenDialogPlantilla) => {
    setOpenDialogPlantilla(false);
};

export const handleOpenDialogServicio = (setOpenDialogServicio) => {
    setOpenDialogServicio(true);
};

export const handleCloseDialogServicio = (setOpenDialogServicio) => {
    setOpenDialogServicio(false);
};
export const fetchServicesData = async () => {
    const [groupClasses, subscriptions, individualConsultations] = await Promise.all([
        axios.get('/api/groupClasses/group-classes'),
        axios.get('/api/subscriptions'),
        axios.get('/api/individualConsultations'),
    ]);

    return {
        groupClasses: groupClasses.data,
        subscriptions: subscriptions.data,
        individualConsultations: individualConsultations.data,
    };
};

export const attachServiceInfoToClients = (clients, servicesData) => {
    return clients.map(client => {
        const hasGroupClass = servicesData.groupClasses.some(groupClass => 
            groupClass.clients.some(c => c.client._id === client._id)
        );

        const hasSubscription = servicesData.subscriptions.some(subscription =>
            subscription.client._id === client._id
        );

        const hasConsultation = servicesData.individualConsultations.some(consultation =>
            consultation.client._id === client._id
        );

        let service = '';
        if (hasGroupClass) service = 'Clase grupal';
        if (hasSubscription) service = 'Suscripción';
        if (hasConsultation) service = 'Consulta individual';

        return { ...client, service };
    });
};

export const handleAddToService = async (clientId, serviceType, serviceId) => {
    try {
        let response;
        if (serviceType === 'Clase grupal') {
            response = await axios.post(`/api/groupClasses/${serviceId}/add-client`, { clientId });
        } else if (serviceType === 'Suscripción') {
            response = await axios.post(`/api/subscriptions/${serviceId}/add-client`, { clientId });
        } else if (serviceType === 'Consulta individual') {
            response = await axios.post(`/api/individualConsultations/${serviceId}/add-client`, { clientId });
        }

        if (response && response.status === 200) {
            toast.success('Cliente añadido al servicio correctamente');
            return true;
        } else {
            throw new Error('Error al añadir el cliente al servicio');
        }
    } catch (error) {
        toast.error('Error al añadir el cliente al servicio');
        return false;
    }
};
