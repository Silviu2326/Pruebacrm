import React, { useState } from 'react';
import './AsesoriaPopup.css';

const AsesoriaPopup = ({ service, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [paymentLink, setPaymentLink] = useState(null);

    if (!service) return null;

    const handleGeneratePaymentLink = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: service.paymentPlans.reduce((total, plan) => total + plan.price, 0), // suma todos los precios de los planes
                    currency: 'eur',
                    description: `Pago de Asesoría: ${service.name}`,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setPaymentLink(data.url);
            } else {
                console.error('Error generating payment link:', data.error);
            }
        } catch (error) {
            console.error('Error generating payment link:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="AsesoriaPopup-popup">
            <div className="AsesoriaPopup-popup-inner">
                <h2 className="AsesoriaPopup-title">{service.name}</h2>
                
                <div className="AsesoriaPopup-details">
                    <p><strong>Descripción:</strong> {service.description}</p>
                    <p><strong>Objetivos:</strong> {service.objectives}</p>
                </div>

                <div className="AsesoriaPopup-subtipos">
                    <h3>Servicios Incluidos</h3>
                    {service.subtipo.map((subtype) => (
                        <div key={subtype._id} className="AsesoriaPopup-subtipo-card">
                            <h4>{subtype.name}</h4>
                            <p><strong>Servicio:</strong> {subtype.service}</p>
                        </div>
                    ))}
                </div>

                <div className="AsesoriaPopup-payment-plans">
                    <h3>Planes de Pago</h3>
                    {service.paymentPlans.length > 0 ? (
                        service.paymentPlans.map(plan => (
                            <div key={plan._id} className="AsesoriaPopup-plan-card">
                                <h4>{plan.planName}</h4>
                                <p><strong>Frecuencia:</strong> {plan.frequency}</p>
                                <p><strong>Duración:</strong> {plan.durationValue} {plan.durationUnit}</p>
                                <p><strong>Precio:</strong> {plan.price}€</p>
                                <p><strong>Descuento:</strong> {plan.discount}%</p>

                                <div className="AsesoriaPopup-clients">
                                    <h5>Clientes en este Plan:</h5>
                                    {service.clients.filter(client => client.paymentPlan === plan._id).length > 0 ? (
                                        service.clients.filter(client => client.paymentPlan === plan._id).map(client => (
                                            <div key={client._id} className="AsesoriaPopup-client-card">
                                                <p><strong>Nombre:</strong> {client.client.nombre} {client.client.apellido}</p>
                                                <p><strong>Email:</strong> {client.client.email}</p>
                                                <p><strong>Estado:</strong> {client.status}</p>
                                                <p><strong>Fecha de Inicio:</strong> {new Date(client.startDate).toLocaleDateString()}</p>
                                                <p><strong>Fecha de Fin:</strong> {new Date(client.endDate).toLocaleDateString()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay clientes en este plan.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay planes de pago disponibles.</p>
                    )}
                </div>

                <div className="AsesoriaPopup-actions">
                    <button 
                        onClick={handleGeneratePaymentLink} 
                        className="AsesoriaPopup-generate-link-btn" 
                        disabled={loading}
                    >
                        {loading ? 'Generando Link...' : 'Generar Link de Pago'}
                    </button>
                    {paymentLink && (
                        <p>
                            <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                                Ir al link de pago
                            </a>
                        </p>
                    )}
                    <button onClick={onClose} className="AsesoriaPopup-close-btn">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default AsesoriaPopup;
