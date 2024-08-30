import React from 'react';
import './VisualizadorDeCitas.css';

const VisualizadorDeCitas = ({ open, onClose, cita, cliente }) => {
    console.log("Props recibidas en VisualizadorDeCitas:", { open, cita, cliente }); // Log para verificar las props

    if (!open || !cita) return null;

    return (
        <div className="VisualizadorDeCitas-overlay">
            <div className="VisualizadorDeCitas-container">
                <button className="VisualizadorDeCitas-close-button" onClick={onClose}>✖</button>
                <h2 className="VisualizadorDeCitas-title">{cita.actividad}</h2>
                <p className="VisualizadorDeCitas-subtitle">Consulta médica</p>

                <div className="VisualizadorDeCitas-details">
                    <div className="VisualizadorDeCitas-detail">
                        <span role="img" aria-label="frecuencia">📅</span> Frecuencia: {cita.frecuencia}
                    </div>
                    <div className="VisualizadorDeCitas-detail">
                        <span role="img" aria-label="sesiones">⏱️</span> Sesiones: {cita.sesiones}
                    </div>
                    <div className="VisualizadorDeCitas-detail">
                        <span role="img" aria-label="precio por hora">💰</span> Precio por hora: €{cita.precioHora}
                    </div>
                    <div className="VisualizadorDeCitas-detail">
                        <span role="img" aria-label="fecha de caducidad">📅</span> Fecha de caducidad: {new Date(cita.fechaDeCaducidad).toLocaleDateString()}
                    </div>
                </div>

                <div className="VisualizadorDeCitas-section">
                    <h3>Planes de pago</h3>
                    {cita.paymentPlans && cita.paymentPlans.map(plan => (
                        <div key={plan._id} className="VisualizadorDeCitas-plan">
                            <p><strong>Plan:</strong> {plan.planName}</p>
                            <p><strong>Frecuencia:</strong> {plan.frequency}</p>
                            <p><strong>Duración:</strong> {plan.durationValue} {plan.durationUnit}</p>
                            <p><strong>Precio:</strong> €{plan.price}</p>
                            <p><strong>Descuento:</strong> {plan.discount}%</p>
                        </div>
                    ))}
                </div>

                <div className="VisualizadorDeCitas-section">
                    <h3>Clientes</h3>
                    {cliente ? (
                        <div className="VisualizadorDeCitas-client">
                            <p><strong>Nombre:</strong> {cliente.nombre}</p>
                            <p><strong>Correo:</strong> {cliente.email}</p>
                            <p><strong>Estado:</strong> {cliente.status}</p>
                        </div>
                    ) : (
                        <p>No hay cliente disponible</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizadorDeCitas;
