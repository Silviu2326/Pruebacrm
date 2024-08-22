import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./NuevoPlanPagoPopup.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const NuevoPlanPagoPopup = ({ onClose, subscription, existingPlan = null }) => {
    const [planName, setPlanName] = useState(existingPlan?.planName || '');
    const [frequency, setFrequency] = useState(existingPlan?.frequency || 'monthly');
    const [durationValue, setDurationValue] = useState(existingPlan?.durationValue || '');
    const [durationUnit, setDurationUnit] = useState(existingPlan?.durationUnit || 'months');
    const [price, setPrice] = useState(existingPlan?.price || '');
    const [discount, setDiscount] = useState(existingPlan?.discount || 0);
    const [selectedClient, setSelectedClient] = useState('');
    const [clients, setClients] = useState([]);
    const [associatedClients, setAssociatedClients] = useState([]);

    useEffect(() => {
        if (existingPlan) {
            setPlanName(existingPlan.planName);
            setFrequency(existingPlan.frequency);
            setDurationValue(existingPlan.durationValue);
            setDurationUnit(existingPlan.durationUnit);
            setPrice(existingPlan.price);
            setDiscount(existingPlan.discount);

            // Buscar los clientes asociados a este plan dentro de la suscripción
            const clientsForPlan = subscription.clients.filter(client => client.paymentPlan === existingPlan._id);
            if (clientsForPlan.length > 0) {
                // Mapear directamente los clientes asociados
                setAssociatedClients(clientsForPlan.map(client => ({
                    id: client.client,
                })));
            }
        }

        // Cargar los clientes al montar el componente
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => setClients(response.data))
            .catch(error => console.error('Error al cargar los clientes:', error));
    }, [existingPlan, subscription]);

    useEffect(() => {
        if (associatedClients.length > 0 && clients.length > 0) {
            // Asociar los nombres de los clientes cargados con los clientes asociados al plan
            const updatedAssociatedClients = associatedClients.map(associatedClient => {
                const clientData = clients.find(client => client._id === associatedClient.id);
                return {
                    ...associatedClient,
                    name: clientData ? clientData.nombre : 'Cliente no encontrado'
                };
            });
            setAssociatedClients(updatedAssociatedClients);
        }
    }, [clients, associatedClients.length]);

    const handleAddClient = () => {
        if (selectedClient) {
            const clientToAdd = clients.find(client => client._id === selectedClient);
            if (clientToAdd && !associatedClients.find(client => client.id === selectedClient)) {
                setAssociatedClients([...associatedClients, { id: clientToAdd._id, name: clientToAdd.nombre }]);
            }
            setSelectedClient('');
        }
    };

    const handleRemoveClient = (clientId) => {
        setAssociatedClients(associatedClients.filter(client => client.id !== clientId));
    };

    const handleSavePlan = () => {
        const updatedPlan = {
            planName,
            frequency,
            durationValue: parseInt(durationValue),
            durationUnit,
            price: parseFloat(price),
            discount: parseFloat(discount)
        };

        const updatedPlans = existingPlan
            ? subscription.paymentPlans.map(plan => plan._id === existingPlan._id ? updatedPlan : plan)
            : [...subscription.paymentPlans, updatedPlan];

        const updatedClients = associatedClients.map(client => ({
            client: client.id,
            paymentPlan: existingPlan._id
        }));

        axios.put(`${API_BASE_URL}/api/subscriptions/${subscription._id}`, {
            ...subscription,
            paymentPlans: updatedPlans,
            clients: updatedClients
        })
            .then(response => {
                console.log('Plan guardado con éxito:', response.data);
                onClose();
            })
            .catch(error => {
                console.error('Error al guardar el plan de pago:', error);
            });
    };

    return (
        <div className="Plandepagopopup-container">
            <h2 className="Plandepagopopup-title">{existingPlan ? 'Editar' : 'Crear'} Plan de Pago para {subscription?.name}</h2>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Nombre del Plan:</label>
                <input 
                    type="text" 
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="Plandepagopopup-input"
                />
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Frecuencia:</label>
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="Plandepagopopup-select"
                >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="3_months">Cada 3 meses</option>
                    <option value="6_months">Cada 6 meses</option>
                    <option value="annual">Anual</option>
                </select>
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Duración en Unidades:</label>
                <input 
                    type="number" 
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="Plandepagopopup-input"
                />
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Unidad de Duración:</label>
                <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="Plandepagopopup-select"
                >
                    <option value="weeks">Semanas</option>
                    <option value="months">Meses</option>
                </select>
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Precio:</label>
                <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="Plandepagopopup-input"
                />
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Descuento:</label>
                <input 
                    type="number" 
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="Plandepagopopup-input"
                />
            </div>
            
            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Clientes Asociados:</label>
                <div className="Plandepagopopup-clients">
                    {associatedClients.length > 0 ? (
                        associatedClients.map(client => (
                            <div key={client.id} className="Plandepagopopup-client">
                                <span>{client.name}</span>
                                <button 
                                    onClick={() => handleRemoveClient(client.id)} 
                                    className="Plandepagopopup-remove-button"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="Plandepagopopup-no-clients">No hay clientes asociados.</p>
                    )}
                </div>
            </div>

            <div className="Plandepagopopup-field">
                <label className="Plandepagopopup-label">Seleccionar Cliente:</label>
                <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="Plandepagopopup-select"
                >
                    <option value="">
                        Ninguno
                    </option>
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>
                            {client.nombre}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleAddClient} 
                    disabled={!selectedClient}
                    className="Plandepagopopup-add-button"
                >
                    Añadir Cliente
                </button>
            </div>

            <div className="Plandepagopopup-actions">
                <button onClick={onClose} className="Plandepagopopup-cancel-button">
                    Cancelar
                </button>
                <button onClick={handleSavePlan} className="Plandepagopopup-save-button">
                    {existingPlan ? 'Guardar Cambios' : 'Crear'}
                </button>
            </div>
        </div>
    );
};

export default NuevoPlanPagoPopup;
