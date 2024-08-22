import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem, Select, Button, TextField, Dialog, DialogContent } from '@mui/material';
import './ServiciosLista.css';
import ServiciosPopup from './ServiciosPopup';
import AsesoriaPopup from './AsesoriaPopup';
import GroupClassesPopup from './GroupClassesPopup';
import SuscripcionesPopup from './SuscripcionesPopup'; 
import NuevoPlanPagoPopup from './NuevoPlanPagoPopup';
import CitasPopup from './CitasPopup'; // Importa el componente para mostrar las citas

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ServiciosLista = ({ theme }) => {
    const [groupClasses, setGroupClasses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [citas, setCitas] = useState([]); // Estado para almacenar las citas
    const [filter, setFilter] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState('groupClasses');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [allClients, setAllClients] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isCitasPopupOpen, setIsCitasPopupOpen] = useState(false); // Estado para controlar la apertura del modal de citas

    useEffect(() => {
        fetchServices();
        fetchAllClients();
        if (selectedServiceType === 'citas') {
            fetchCitas(); // Cargar las citas cuando se selecciona el tipo de servicio "citas"
        }
    }, [selectedServiceType]);

    const fetchServices = () => {
        switch (selectedServiceType) {
            case 'groupClasses':
                axios.get(`${API_BASE_URL}/api/groupClasses`)
                    .then(response => setGroupClasses(response.data))
                    .catch(error => console.error('Error al cargar las clases grupales:', error));
                break;
            case 'subscriptions':
                axios.get(`${API_BASE_URL}/api/subscriptions`)
                    .then(response => setSubscriptions(response.data))
                    .catch(error => console.error('Error al cargar las suscripciones:', error));
                break;
            case 'consultations':
                axios.get(`${API_BASE_URL}/api/individualConsultations`)
                    .then(response => setConsultations(response.data))
                    .catch(error => console.error('Error al cargar las asesorías individuales:', error));
                break;
            case 'citas':
                fetchCitas();
                break;
            default:
                break;
        }
    };

    const fetchCitas = () => {
        axios.get(`${API_BASE_URL}/api/citas`)
            .then(response => setCitas(response.data))
            .catch(error => console.error('Error al cargar las citas:', error));
    };

    const fetchAllClients = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => setAllClients(response.data))
            .catch(error => console.error('Error al cargar los clientes:', error));
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredServices = () => {
        switch (selectedServiceType) {
            case 'groupClasses':
                return groupClasses.filter(service => service.name?.toLowerCase().includes(filter.toLowerCase()));
            case 'subscriptions':
                return subscriptions.filter(service => service.name?.toLowerCase().includes(filter.toLowerCase()));
            case 'consultations':
                return consultations.filter(service => service.name?.toLowerCase().includes(filter.toLowerCase()));
            case 'citas':
                return citas.filter(cita => cita.titulo?.toLowerCase().includes(filter.toLowerCase()));
            default:
                return [];
        }
    };

    const handleOpenPopup = (service, type) => {
        setSelectedService(service);
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleOpenCreatePlanPopup = (subscription, plan = null) => {
        setSelectedSubscription(subscription);
        setSelectedPlan(plan);
        setPopupType('createPlan');
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
        setPopupType('');
        setSelectedSubscription(null);
        setSelectedPlan(null);
    };

    const handleAddClientToSubscription = (clientId) => {
        const client = allClients.find(c => c._id === clientId);
        if (selectedService && client) {
            const updatedSubscription = {
                ...selectedService,
                clients: [...selectedService.clients, client]
            };

            axios.put(`${API_BASE_URL}/api/subscriptions/${selectedService._id}`, updatedSubscription)
                .then(response => {
                    setSubscriptions(subscriptions.map(sub =>
                        sub._id === selectedService._id ? response.data : sub
                    ));
                })
                .catch(error => console.error('Error al actualizar la suscripción:', error));
        }
    };

    const handleOpenCitasPopup = () => {
        fetchCitas(); // Asegúrate de recargar las citas cuando se abre el modal
        setIsCitasPopupOpen(true);
    };

    const handleCloseCitasPopup = () => {
        setIsCitasPopupOpen(false);
    };

    const getClientsForPlan = (planId) => {
        const clientsForPlan = allClients.filter(client => 
            subscriptions.some(subscription => 
                subscription.clients.some(c => c.paymentPlan === planId && c.client === client._id)
            )
        );
        return clientsForPlan.map(client => client.nombre).join(', ');
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <h2>Gestión de Servicios</h2>
            <div className="servicioslista-botones-acciones">
                <Button variant="contained" color="secondary" onClick={() => handleOpenPopup(null, 'create')}>
                    Crear Servicio
                </Button>
                <Button variant="contained" color="primary" onClick={handleOpenCitasPopup}>
                    Ver Citas
                </Button>
            </div>

            <div className="servicioslista-tablas-contenedor">
                <div className="servicioslista-filtro-busqueda">
                    <TextField
                        label="Buscar Servicios"
                        variant="outlined"
                        value={filter}
                        onChange={handleFilterChange}
                        className="servicioslista-input-filtro"
                    />
                    <Select
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        displayEmpty
                        className="servicioslista-dropdown-filtro"
                    >
                        <MenuItem value="groupClasses">Clases Grupales</MenuItem>
                        <MenuItem value="subscriptions">Suscripciones</MenuItem>
                        <MenuItem value="consultations">Asesorías Individuales</MenuItem>
                        <MenuItem value="citas">Citas</MenuItem> {/* Nueva opción para citas */}
                    </Select>
                </div>

                {selectedServiceType !== 'citas' && (
                    <table className="servicioslista-tabla-servicios">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices().map(service => (
                                <React.Fragment key={service._id}>
                                    <tr>
                                        <td>{service.name}</td>
                                        <td>{service.description}</td>
                                        <td>{service.subtipo && service.subtipo.length > 0 ? service.subtipo[0].price : 'N/A'}</td>
                                        <td>{service.type}</td>
                                        <td>
                                            {selectedServiceType === 'consultations' && (
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    onClick={() => handleOpenPopup(service, 'consultation')}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            )}
                                            {selectedServiceType === 'groupClasses' && (
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    onClick={() => handleOpenPopup(service, 'groupClass')}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            )}
                                            {selectedServiceType === 'subscriptions' && (
                                                <>
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
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    {selectedServiceType === 'subscriptions' && service.paymentPlans && service.paymentPlans.length > 0 && (
                                        <tr className="servicioslista-plan-row">
                                            <td colSpan="5">
                                                <table className="servicioslista-tabla-planes">
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre del Plan</th>
                                                            <th>Frecuencia</th>
                                                            <th>Duración</th>
                                                            <th>Precio</th>
                                                            <th>Descuento</th>
                                                            <th>Clientes</th> {/* Nueva columna para mostrar clientes */}
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {service.paymentPlans.map(plan => (
                                                            <tr key={plan._id}>
                                                                <td>{plan.planName}</td>
                                                                <td>{plan.frequency}</td>
                                                                <td>{`${plan.durationValue} ${plan.durationUnit}`}</td>
                                                                <td>{plan.price}</td>
                                                                <td>{plan.discount}</td>
                                                                <td>{getClientsForPlan(plan._id)}</td> {/* Mostrar clientes asociados al plan */}
                                                                <td>
                                                                    <Button 
                                                                        variant="contained" 
                                                                        color="primary" 
                                                                        onClick={() => handleOpenCreatePlanPopup(service, plan)}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedServiceType === 'citas' && (
                    <table className="servicioslista-tabla-servicios">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Tipo</th>
                                <th>Costo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map(cita => (
                                <tr key={cita._id}>
                                    <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                                    <td>{cita.clienteNombre}</td>
                                    <td>{cita.tipo}</td>
                                    <td>{cita.costo}</td>
                                    <td>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleOpenPopup(cita, 'cita')}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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
                    {popupType === 'groupClass' && (
                        <GroupClassesPopup service={selectedService} onClose={handleClosePopup} />
                    )}
                    {popupType === 'subscription' && (
                        <SuscripcionesPopup 
                            service={selectedService} 
                            onClose={handleClosePopup} 
                            onAddClient={handleAddClientToSubscription} 
                        />
                    )}
                    {popupType === 'createPlan' && (
                        <NuevoPlanPagoPopup 
                            onClose={handleClosePopup} 
                            subscription={selectedSubscription}  
                            existingPlan={selectedPlan} 
                        />
                    )}
                    {popupType === 'cita' && (
                        <CitasPopup service={selectedService} onClose={handleClosePopup} />
                    )}
                    {popupType === 'create' && (
                        <ServiciosPopup onClose={handleClosePopup} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Nuevo modal para ver las citas */}
            <Dialog
                open={isCitasPopupOpen}
                onClose={handleCloseCitasPopup}
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
                    <CitasPopup citas={citas} onClose={handleCloseCitasPopup} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiciosLista;
