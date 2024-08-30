import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Collapse } from '@mui/material';
import SuscripcionesPopup from './SuscripcionesPopup';
import PopupClasesMetodo from './popupclasesmetodo';
import SuscripcionesVerPlan from './SuscripcionesVerPlan';
import SuscripcionesVerCliente from './SuscripcionesVerCliente';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const SuscripcionesLista = ({ theme }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [associatedClients, setAssociatedClients] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [clientesDetails, setClientesDetails] = useState({});
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
        fetchAllClients();
    }, []);

    const fetchSubscriptions = () => {
        axios.get(`${API_BASE_URL}/api/subscriptions`)
            .then(response => {
                console.log('Suscripciones obtenidas:', response.data);
                setSubscriptions(response.data);
            })
            .catch(error => console.error('Error al cargar las suscripciones:', error));
    };

    const fetchAllClients = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => {
                console.log('Clientes obtenidos:', response.data);
                setAllClients(response.data);
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    };

    const fetchClienteDetails = async (clienteId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes/${clienteId}`);
            setClientesDetails(prevState => ({
                ...prevState,
                [clienteId]: response.data
            }));
        } catch (error) {
            console.error(`Error al obtener detalles del cliente con ID ${clienteId}:`, error);
        }
    };

    const toggleRowExpansion = async (serviceId, clients) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [serviceId]: !prevState[serviceId]
        }));

        if (!expandedRows[serviceId]) {
            for (const client of clients) {
                if (!clientesDetails[client.client]) {
                    await fetchClienteDetails(client.client);
                }
            }
        }
    };

    const handleOpenPopup = (service, type) => {
        const allClientsInSubscription = service.clients.map(clientRelation => {
            return allClients.find(client => client._id === clientRelation.client);
        }).filter(client => client !== undefined); 

        setSelectedService({ ...service, clients: allClientsInSubscription });
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleOpenClientDetailsPopup = (client) => {
        const clientDetails = clientesDetails[client.client];
        setSelectedClient(clientDetails);
        setPopupType('clientDetails');
        setIsPopupOpen(true);
    };

    const handleOpenCreatePlanPopup = (service) => {
        setSelectedService(service);
        setPopupType('createPlan');
        setIsPopupOpen(true);
    };

    const handleOpenPlanDetailsPopup = (plan, clients) => {
        const processedClients = clients.map(client => ({
            ...client,
            nombre: clientesDetails[client.client]?.nombre
        }));

        setSelectedPlan(plan);
        setAssociatedClients(processedClients);
        setPopupType('planDetails');
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
        setSelectedPlan(null);
        setAssociatedClients([]);
        setPopupType('');
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <Table className="servicioslista-tabla-servicios">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Duración</TableCell> {/* Columna de duración añadida */}
                        <TableCell>Acciones</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscriptions.map(service => (
                        <React.Fragment key={service._id}>
                            <TableRow>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>
                                    {/* Mostrar Duración basada en durationValue y durationUnit */}
                                    {service.durationValue && service.durationUnit
                                        ? `${service.durationValue} ${service.durationUnit}`
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleOpenPopup(service, 'subscription')}
                                    >
                                        Ver Detalles
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => handleOpenCreatePlanPopup(service)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Crear Plan de Pago
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {(service.paymentPlans && service.paymentPlans.length > 0) || (service.clients && service.clients.length > 0) ? (
                                        <>
                                            <Button 
                                                variant="text" 
                                                color="secondary" 
                                                onClick={() => toggleRowExpansion(service._id, service.clients)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                {expandedRows[service._id] ? 'Ocultar' : 'Expandir'}
                                            </Button>
                                        </>
                                    ) : null}
                                </TableCell>
                            </TableRow>

                            {/* Subtabla para Payment Plans y Clientes */}
                            {service.paymentPlans && service.paymentPlans.length > 0 && (
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={expandedRows[service._id]} timeout="auto" unmountOnExit>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Plan</TableCell>
                                                        <TableCell>Frecuencia</TableCell>
                                                        <TableCell>Duración</TableCell>
                                                        <TableCell>Descuento</TableCell>
                                                        <TableCell>Acciones</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {service.paymentPlans.map(plan => (
                                                        <React.Fragment key={plan._id}>
                                                            <TableRow>
                                                                <TableCell>{plan.planName}</TableCell>
                                                                <TableCell>{plan.frequency}</TableCell>
                                                                <TableCell>{plan.durationValue} {plan.durationUnit}</TableCell>
                                                                <TableCell>{plan.discount}</TableCell>
                                                                <TableCell>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        onClick={() => handleOpenPlanDetailsPopup(plan, service.clients.filter(client => client.paymentPlan === plan._id))}
                                                                    >
                                                                        Ver Plan
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>

                                                            {/* Renderizar los clientes asociados al plan */}
                                                            {service.clients.filter(client => client.paymentPlan === plan._id).length > 0 && (
                                                                <TableRow>
                                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                                        <Collapse in={expandedRows[service._id]} timeout="auto" unmountOnExit>
                                                                            <Table size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Nombre</TableCell>
                                                                                        <TableCell>Email</TableCell>
                                                                                        <TableCell>Estado</TableCell>
                                                                                        <TableCell>Acciones</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {service.clients.filter(client => client.paymentPlan === plan._id).map(client => {
                                                                                        const clientDetails = clientesDetails[client.client];
                                                                                        return (
                                                                                            <TableRow key={client._id}>
                                                                                                <TableCell>{clientDetails?.nombre || 'Cargando...'}</TableCell>
                                                                                                <TableCell>{clientDetails?.email || 'Cargando...'}</TableCell>
                                                                                                <TableCell>{client.status}</TableCell>
                                                                                                <TableCell>
                                                                                                <Button 
                                                                                                    variant="outlined" 
                                                                                                    onClick={() => handleOpenClientDetailsPopup(client)}
                                                                                                >
                                                                                                    Ver Cliente
                                                                                                </Button>
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            {/* Renderizado de los popups */}
            {popupType === 'planDetails' && (
                <SuscripcionesVerPlan 
                    plan={selectedPlan} 
                    clients={associatedClients} 
                    onClose={handleClosePopup} 
                />
            )}
            {popupType === 'clientDetails' && (
                <SuscripcionesVerCliente 
                    cliente={selectedClient} 
                    onClose={handleClosePopup} 
                />
            )}

            {popupType === 'subscription' && (
                <SuscripcionesPopup service={selectedService} onClose={handleClosePopup} />
            )}
            {popupType === 'createPlan' && (
                <PopupClasesMetodo
                    service={selectedService} 
                    onClose={handleClosePopup} 
                />
            )}
        </div>
    );
};

export default SuscripcionesLista;
