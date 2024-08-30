// src/components/PaymentPlansAsesoriapopupdetalles.js
import React from 'react';
import './PaymentPlansAsesoriapopupdetalles.css';

const PaymentPlansAsesoriapopupdetalles = ({ plan, clients, onClose }) => {
    return (
        <div className="PaymentPlansAsesoriapopupdetalles-dialog">
            <div className="PaymentPlansAsesoriapopupdetalles-dialog-title">
                Detalles del Plan de Pago
            </div>
            <div className="PaymentPlansAsesoriapopupdetalles-dialog-content">
                <div className="PaymentPlansAsesoriapopupdetalles-section">
                    <div className="PaymentPlansAsesoriapopupdetalles-title">Nombre del Plan</div>
                    <div className="PaymentPlansAsesoriapopupdetalles-content">{plan.planName}</div>
                </div>

                <div className="PaymentPlansAsesoriapopupdetalles-section">
                    <div className="PaymentPlansAsesoriapopupdetalles-title">Frecuencia</div>
                    <div className="PaymentPlansAsesoriapopupdetalles-content">{plan.frequency}</div>
                </div>

                <div className="PaymentPlansAsesoriapopupdetalles-section">
                    <div className="PaymentPlansAsesoriapopupdetalles-title">Duración</div>
                    <div className="PaymentPlansAsesoriapopupdetalles-content">{plan.durationValue} {plan.durationUnit}</div>
                </div>

                <div className="PaymentPlansAsesoriapopupdetalles-section">
                    <div className="PaymentPlansAsesoriapopupdetalles-title">Precio</div>
                    <div className="PaymentPlansAsesoriapopupdetalles-content">{plan.price}€</div>
                </div>

                <div className="PaymentPlansAsesoriapopupdetalles-section">
                    <div className="PaymentPlansAsesoriapopupdetalles-title">Descuento</div>
                    <div className="PaymentPlansAsesoriapopupdetalles-content">{plan.discount}%</div>
                </div>

                <div className="PaymentPlansAsesoriapopupdetalles-section PaymentPlansAsesoriapopupdetalles-clientes">
                    <div className="PaymentPlansAsesoriapopupdetalles-title" style={{ marginTop: '20px' }}>Clientes Asociados</div>
                    {clients && clients.length > 0 ? (
                        <table className="PaymentPlansAsesoriapopupdetalles-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client._id}>
                                        <td>{client.client.nombre} {client.client.apellido}</td>
                                        <td>{client.client.email}</td>
                                        <td>{client.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="PaymentPlansAsesoriapopupdetalles-no-clients">No hay clientes asociados a este plan.</div>
                    )}
                </div>
            </div>
            <div className="PaymentPlansAsesoriapopupdetalles-dialog-actions">
                <button onClick={onClose} className="PaymentPlansAsesoriapopupdetalles-close-button">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default PaymentPlansAsesoriapopupdetalles;
