import React, { useState } from 'react';
import AsesoriaPlantilla from './AsesoriaPlantilla';  // Importamos el nuevo componente
import './AsesoriaPopup.css';

const AsesoriaPopup = ({ service, onClose, onCreateAsesoriaFromTemplate }) => {
    const [loading, setLoading] = useState(false);
    const [paymentLink, setPaymentLink] = useState(null);

    if (!service) return null;

    const isPlantilla = service.type === 'plantilla';

    const handleCreateAsesoria = () => {
        if (onCreateAsesoriaFromTemplate) {
            onCreateAsesoriaFromTemplate(service);
        }
    };

    const handleGeneratePaymentLink = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: service.subtipo.reduce((total, subtype) => total + subtype.price, 0), // suma todos los precios de subtipo
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
                <h2 className="AsesoriaPopup-title">
                    {isPlantilla ? 'Detalles de la Plantilla' : 'Detalles de la Asesoría'}
                </h2>

                {isPlantilla ? (
                    <AsesoriaPlantilla initialData={service} onCreate={onClose} />
                ) : (
                    <>
                        {/* Información del Cliente, solo si no es plantilla */}
                        {service.cliente && (
                            <div className="AsesoriaPopup-client-details">
                                <h3>Información del Cliente</h3>
                                <p><strong>Nombre:</strong> {service.cliente.nombre} {service.cliente.apellido}</p>
                                <p><strong>Email:</strong> {service.cliente.email}</p>
                                <p><strong>Edad:</strong> {service.cliente.edad} años</p>
                                <p><strong>Género:</strong> {service.cliente.genero}</p>
                                <p><strong>Ciudad:</strong> {service.cliente.city}, {service.cliente.country}</p>
                            </div>
                        )}

                        {/* Información de la Asesoría */}
                        <div className="AsesoriaPopup-details">
                            <h3>Información de la Asesoría</h3>
                            <p><strong>Nombre:</strong> {service.name}</p>
                            <p><strong>Descripción:</strong> {service.description}</p>
                            <p><strong>Objetivos:</strong> {service.objectives}</p>
                            <p><strong>Duración:</strong> {service.duration} meses</p>
                            <p><strong>Frecuencia:</strong> {service.frequency.charAt(0).toUpperCase() + service.frequency.slice(1)}</p>
                            <p><strong>Fecha de Inicio:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                        </div>

                        {/* Sección para cada Subtipo */}
                        <div className="AsesoriaPopup-subtipo-section">
                            <h3>Servicios Incluidos</h3>
                            {service.subtipo.map((subtype) => (
                                <div key={subtype._id} className="AsesoriaPopup-subtipo-card">
                                    <h4>{subtype.name}</h4>
                                    <p><strong>Servicio:</strong> {subtype.service}</p>
                                    <p><strong>Precio:</strong> {subtype.price}€</p>
                                    <p><strong>Tipo de Pago:</strong> {subtype.paymentType === 'fijo' ? 'Fijo' : 'Variable'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Fechas de Pago Programadas */}
                        <div>
                            <h3>Fechas de Pago Programadas</h3>
                            <ul className="AsesoriaPopup-payment-dates">
                                {service.paymentDates.map((date, index) => (
                                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Botón para Generar Link de Pago */}
                        <div className="AsesoriaPopup-payment-link">
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
                        </div>
                    </>
                )}

                <div className="AsesoriaPopup-actions">
                    {isPlantilla && (
                        <button 
                            onClick={handleCreateAsesoria} 
                            className="AsesoriaPopup-create-btn"
                        >
                            Crear Asesoría desde esta Plantilla
                        </button>
                    )}
                    <button onClick={onClose} className="AsesoriaPopup-close-btn">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default AsesoriaPopup;
