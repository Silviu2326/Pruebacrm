import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Collapse } from '@mui/material';
import AsesoriaPopup from './AsesoriaPopup';
import PaymentPlansAsesoriapopup from './PaymentPlansAsesoriapopup';
import PaymentPlansAsesoriapopupdetalles from './PaymentPlansAsesoriapopupdetalles';
import PanelClienteAsesoria from './PanelClienteAsesoria';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const AsesoriasLista = ({ theme }) => {
    const [consultations, setConsultations] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [associatedClients, setAssociatedClients] = useState([]);
    const [isClientPopupOpen, setIsClientPopupOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [clientesDetails, setClientesDetails] = useState({});

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = () => {
        axios.get(`${API_BASE_URL}/api/individualConsultations`)
            .then(response => setConsultations(response.data))
            .catch(error => console.error('Error al cargar las asesorías individuales:', error));
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
                if (!clientesDetails[client.client._id]) {
                    await fetchClienteDetails(client.client._id);
                }
            }
        }
    };

    const handleOpenPopup = (service, type) => {
        setSelectedService(service);
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleOpenCreatePlanPopup = (service) => {
        setSelectedService(service);
        setPopupType('createPlan');
        setIsPopupOpen(true);
    };

    const handleOpenPlanDetailsPopup = (plan, clients) => {
        setSelectedPlan(plan);
        setAssociatedClients(clients);
        setPopupType('planDetails');
        setIsPopupOpen(true);
    };

    const handleOpenClientPopup = (client) => {
        setSelectedClient(client);
        setSelectedService(consultations.find(service => service.clients.some(c => c._id === client._id)));
        setIsClientPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
        setSelectedPlan(null);
        setAssociatedClients([]);
        setPopupType('');
    };

    const handleCloseClientPopup = () => {
        setIsClientPopupOpen(false);
        setSelectedClient(null);
    };

    const handleDeleteConsultation = async (consultationId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta asesoría? Esta acción no se puede deshacer.");
        if (confirmDelete) {
            try {
                await axios.delete(`${API_BASE_URL}/api/individualConsultations/${consultationId}`);
                setConsultations(consultations.filter(consultation => consultation._id !== consultationId));
                console.log('Asesoría eliminada exitosamente.');
            } catch (error) {
                console.error('Error al eliminar la asesoría:', error);
            }
        }
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <Table className="servicioslista-tabla-servicios">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Duración</TableCell> {/* Nueva columna para la Duración */}
                        <TableCell>Acciones</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {consultations.map(service => (
                        <React.Fragment key={service._id}>
                            <TableRow>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>
                                    {service.durationValue && service.durationUnit
                                        ? `${service.durationValue} ${service.durationUnit === 'weeks' ? 'semana(s)' : 'mes(es)'}`
                                        : 'N/A'}
                                </TableCell> {/* Mostrar Duración */}
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleOpenPopup(service, 'consultation')}
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
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleDeleteConsultation(service._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Eliminar
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
                            {(service.paymentPlans && service.paymentPlans.length > 0) && (
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                        <Collapse in={expandedRows[service._id]} timeout="auto" unmountOnExit>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Plan</TableCell>
                                                        <TableCell>Frecuencia</TableCell>
                                                        <TableCell>Duración</TableCell>
                                                        <TableCell>Precio</TableCell>
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
                                                                <TableCell>{plan.price}</TableCell>
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
                                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                                                                        const clientDetails = clientesDetails[client.client._id];
                                                                                        return (
                                                                                            <TableRow key={client._id}>
                                                                                                <TableCell>{clientDetails?.nombre || 'Cargando...'}</TableCell>
                                                                                                <TableCell>{clientDetails?.email || 'Cargando...'}</TableCell>
                                                                                                <TableCell>{client.status}</TableCell>
                                                                                                <TableCell>
                                                                                                    <Button 
                                                                                                        variant="outlined" 
                                                                                                        onClick={() => handleOpenClientPopup(client)}
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

            {/* Renderizado condicional para diferentes popups */}
            {popupType !== 'createPlan' && (
                <Dialog
                    open={isPopupOpen}
                    onClose={handleClosePopup}
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{
                        style: {
                            minHeight: '80vh',
                            minWidth: '80vw',
                        },
                    }}
                >
                    <DialogContent>
                        {popupType === 'consultation' && (
                            <AsesoriaPopup service={selectedService} onClose={handleClosePopup} />
                        )}
                        {popupType === 'planDetails' && (
                            <PaymentPlansAsesoriapopupdetalles
                                plan={selectedPlan}
                                clients={associatedClients}
                                onClose={handleClosePopup}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Renderizado del componente personalizado PaymentPlansAsesoriapopup como un modal */}
            {popupType === 'createPlan' && (
                <div className="PaymentPlansAsesoriapopup-modalOverlay" onClick={handleClosePopup}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <PaymentPlansAsesoriapopup
                            service={selectedService}
                            onClose={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {/* Renderizado del cliente en un panel separado */}
            {selectedClient && (
                <PanelClienteAsesoria
                    isOpen={isClientPopupOpen}
                    onClose={handleCloseClientPopup}
                    cliente={selectedClient.client}
                    asesoria={selectedService}
                />
            )}
        </div>
    );
};

export default AsesoriasLista;
