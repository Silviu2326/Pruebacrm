import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SuscripcionesPopup.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import { FaInfoCircle, FaUserMinus } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const SuscripcionesPopup = ({ service, onClose }) => {
    const [allClients, setAllClients] = useState([]);
    const [clients, setClients] = useState(service?.clients || []);
    const [editingService, setEditingService] = useState(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState({ ...service });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => setAllClients(response.data))
            .catch(error => console.error('Error al cargar los clientes:', error));
    }, []);

    const handleRemoveClient = (clientId) => {
        const updatedClients = clients.filter(client => client._id !== clientId);
        setClients(updatedClients);
        updateSubscription({ clients: updatedClients });
    };

    const updateSubscription = (updatedFields) => {
        const updatedSubscription = {
            ...subscriptionDetails,
            ...updatedFields
        };
        axios.put(`${API_BASE_URL}/api/subscriptions/${service._id}`, updatedSubscription)
            .then(response => setSubscriptionDetails(response.data))
            .catch(error => console.error('Error al actualizar la suscripción:', error));
    };

    const handleEditService = () => {
        setEditingService(!editingService);
    };

    const handleChangeDetail = (e) => {
        const { name, value } = e.target;
        setSubscriptionDetails(prev => ({ ...prev, [name]: value }));
    };

    const getPaymentPlanName = () => {
        const annualPlan = service.paymentPlans.find(p => p.planName === "Pago Anual");
        return annualPlan ? annualPlan.planName : 'Pago Anual';
    };

    const combinedClientsWithPlans = clients.map(client => {
        const clientDetails = allClients.find(c => c._id === client.client);

        return {
            ...client,
            ...clientDetails,
            paymentPlanName: getPaymentPlanName()
        };
    });

    if (!service) return null;

    return (
        <div className="SuscripcionesPopup-popup">
            <div className="SuscripcionesPopup-popup-inner">
                <h2 className="SuscripcionesPopup-title">Detalles de la Suscripción</h2>
                
                <Tabs defaultValue="details">
                    <TabsList>
                        <TabsTrigger value="details">Detalles de la Suscripción</TabsTrigger>
                        <TabsTrigger value="clients">Gestión de Clientes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                    <div className="SuscripcionesPopup-details">
    {editingService ? (
        <>
            <input
                type="text"
                name="name"
                value={subscriptionDetails.name}
                onChange={handleChangeDetail}
                placeholder="Nombre de la suscripción"
            />
            <input
                type="number"
                name="paymentDay"
                value={subscriptionDetails.paymentDay}
                onChange={handleChangeDetail}
                placeholder="Día de Pago"
            />
            <Button onClick={() => updateSubscription({ ...subscriptionDetails })}>Guardar Cambios</Button>
        </>
    ) : (
        <>
            <p><strong>Nombre:</strong> {subscriptionDetails.name}</p>
            
            {/* Mostrar servicios de la suscripción */}
            <div className="SuscripcionesPopup-services">
                <h3>Servicios Incluidos:</h3>
                <ul>
                    {subscriptionDetails.services.map(service => (
                        <li key={service._id}>
                            <strong>{service.serviceName}</strong> - ${service.price}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mostrar planes de pago */}
            <div className="SuscripcionesPopup-payment-plans">
                <h3>Planes de Pago Disponibles:</h3>
                <ul>
                    {subscriptionDetails.paymentPlans.map(plan => (
                        <li key={plan._id}>
                            <strong>{plan.planName}</strong> - Frecuencia: {plan.frequency}, Precio: ${plan.price}, Descuento: {plan.discount}%
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )}
    <Button onClick={handleEditService} variant="secondary">
        {editingService ? 'Cancelar Edición' : 'Editar Suscripción'}
    </Button>
</div>
                    </TabsContent>

                    <TabsContent value="clients">
                        <h3>Gestión de Clientes</h3>
                        <div className="SuscripcionesPopup-client-list">
                            <h4>Clientes en la Suscripción:</h4>
                            <ul>
                                {combinedClientsWithPlans.map(client => (
                                    <li key={client._id} className="SuscripcionesPopup-client-item">
                                        <div className="SuscripcionesPopup-client-info">
                                            <p className="client-name"><strong>{client.nombre}</strong></p>
                                            <p className="client-email">{client.email}</p>
                                        </div>
                                        <div className="SuscripcionesPopup-client-action">
                                            <Button variant="white" size="sm" className="mr-2 flex items-center">
                                                <FaInfoCircle className="mr-1" /> Ver Info
                                            </Button>
                                            <Button 
                                            variant="red" 
                                            size="sm" 
                                            className="btn-red flex items-center"
                                            onClick={() => handleRemoveClient(client._id)} 
                                            >
                                            <FaUserMinus className="mr-1" /> Quitar
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="SuscripcionesPopup-actions">
                    <Button onClick={onClose} variant="black" className="SuscripcionesPopup-close-btn">Cerrar</Button>
                </div>
            </div>
        </div>
    );
};

export default SuscripcionesPopup;
