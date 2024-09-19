// src/CheckinsPopup.js
import React, { useState } from 'react';
import './CheckinsPopup.css';
import { X, User, Calendar, ChevronRight, ClipboardList } from 'lucide-react';

const CheckinsPopup = ({ clients, onClose }) => {
    const [selectedClient, setSelectedClient] = useState(clients[0]);
    const [selectedCheckin, setSelectedCheckin] = useState(null);

    const handleClientClick = (client) => {
        setSelectedClient(client);
        setSelectedCheckin(null);
    };

    const handleCheckinClick = (checkin) => {
        setSelectedCheckin(checkin);
    };

    return (
        <div className="checkins-popup">
            <div className="checkins-popup-content">
                <button className="checkins-close" onClick={onClose}>
                    <X size={24} />
                </button>
                <div className="checkins-container">
                    <div className="clients-list">
                        <h3><User size={20} style={{ marginRight: '8px' }} />Clientes</h3>
                        <ul>
                            {clients.map(client => (
                                <li 
                                    key={client.id} 
                                    className={client === selectedClient ? 'selected' : ''}
                                    onClick={() => handleClientClick(client)}
                                >
                                    {client.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="checkins-history">
                        {selectedCheckin ? (
                            <div className="checkin-details">
                                <h3>Detalles del Checkin</h3>
                                <p><strong>Fecha:</strong> {selectedCheckin.date}</p>
                                <p><strong>Título:</strong> {selectedCheckin.title}</p>
                                <p><strong>Descripción:</strong> {selectedCheckin.description}</p>
                                <p><strong>Estado:</strong> <span className={`status-circle ${selectedCheckin.status}`}></span></p>
                                <button onClick={() => setSelectedCheckin(null)}>Volver al Historial</button>
                            </div>
                        ) : (
                            <div className="checkin-history-list">
                                <h3><ClipboardList size={20} style={{ marginRight: '8px' }} />Historial de Checkins</h3>
                                <ul>
                                    {selectedClient.checkins.map(checkin => (
                                        <li key={checkin.id} onClick={() => handleCheckinClick(checkin)}>
                                            <div className="checkin-item">
                                                <Calendar size={16} />
                                                <span>{checkin.date}</span>
                                                <span className="checkin-title">{checkin.title}</span>
                                                <span className={`status-circle ${checkin.status}`}></span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckinsPopup;
