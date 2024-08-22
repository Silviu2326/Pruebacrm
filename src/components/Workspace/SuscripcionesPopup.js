import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SuscripcionesPopup.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const SuscripcionesPopup = ({ service, onClose, onAddClient }) => {
    const [allClients, setAllClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [clients, setClients] = useState(service?.clients || []);
    const [editingService, setEditingService] = useState(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState({ ...service });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => setAllClients(response.data))
            .catch(error => console.error('Error al cargar los clientes:', error));
    }, []);

    const handleAddClient = () => {
        if (selectedClient) {
            onAddClient(selectedClient);
            setSelectedClient('');
        }
    };

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

    if (!service) return null;

    return (
        <div className="SuscripcionesPopup-popup">
            <div className="SuscripcionesPopup-popup-inner">
                <h2 className="SuscripcionesPopup-title">Detalles de la Suscripción</h2>
                
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
                            {/* Más campos editables según necesidad */}
                            <button onClick={() => updateSubscription({ ...subscriptionDetails })}>Guardar Cambios</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Nombre:</strong> {subscriptionDetails.name}</p>
                            <p><strong>Frecuencia de Pago:</strong> {subscriptionDetails.paymentFrequency === 'monthly' ? 'Mensual' : subscriptionDetails.paymentFrequency}</p>
                            <p><strong>Día de Pago:</strong> {subscriptionDetails.paymentDay}</p>
                            {/* Más detalles no editables */}
                        </>
                    )}
                    <button onClick={handleEditService}>
                        {editingService ? 'Cancelar Edición' : 'Editar Suscripción'}
                    </button>
                </div>

                <h3>Servicios Incluidos</h3>
                {/* Código para gestionar y editar servicios... */}

                <h3>Gestión de Clientes</h3>
                <div className="SuscripcionesPopup-client-management">
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="SuscripcionesPopup-client-select"
                    >
                        <option value="">Selecciona un cliente</option>
                        {allClients.map(client => (
                            <option key={client._id} value={client._id}>
                                {client.nombre} {client.apellido}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddClient} className="SuscripcionesPopup-add-client-btn">
                        Añadir Cliente
                    </button>
                </div>

                <div className="SuscripcionesPopup-client-list">
                    <h4>Clientes en la Suscripción:</h4>
                    <ul>
                        {clients.map(client => (
                            <li key={client._id} className="SuscripcionesPopup-client-item">
                                <div className="SuscripcionesPopup-client-info">
                                    <p><strong>Nombre:</strong> {client.nombre}</p>
                                    <p><strong>Email:</strong> {client.email}</p>
                                    <p><strong>Edad:</strong> {client.edad} años</p>
                                    <p><strong>Género:</strong> {client.genero}</p>
                                    <p><strong>Ciudad:</strong> {client.city}</p>
                                    <p><strong>País:</strong> {client.country}</p>
                                </div>
                                <div className="SuscripcionesPopup-client-action">
                                    <button 
                                        onClick={() => handleRemoveClient(client._id)} 
                                        className="SuscripcionesPopup-remove-client-btn"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="SuscripcionesPopup-actions">
                    <button onClick={onClose} className="SuscripcionesPopup-close-btn">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default SuscripcionesPopup;
