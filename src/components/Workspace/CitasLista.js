import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CitasPopup from './CitasPopup'; // No necesitas importar VisualizadorDeCitas por separado
import './VisualizadorDeCitas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const CitasLista = ({ theme }) => {
    const [citas, setCitas] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [clientesDetails, setClientesDetails] = useState({});
    const [isCitasPopupOpen, setIsCitasPopupOpen] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isVisualizadorOpen, setIsVisualizadorOpen] = useState(false);

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = () => {
        axios.get(`${API_BASE_URL}/api/citas`)
            .then(response => {
                console.log("Citas cargadas:", response.data);
                setCitas(response.data);
            })
            .catch(error => console.error('Error al cargar las citas:', error));
    };

    const fetchClienteDetails = async (clienteId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes/${clienteId}`);
            setClientesDetails(prevState => ({
                ...prevState,
                [clienteId]: response.data
            }));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener detalles del cliente con ID ${clienteId}:`, error);
            return null;
        }
    };

    const toggleRowExpansion = async (citaId, clients) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [citaId]: !prevState[citaId]
        }));

        if (!expandedRows[citaId]) {
            for (const client of clients) {
                if (!clientesDetails[client.client]) {
                    await fetchClienteDetails(client.client);
                }
            }
        }
    };

    const handleOpenCitasPopup = () => {
        setIsCitasPopupOpen(true);
    };

    const handleCloseCitasPopup = () => {
        setIsCitasPopupOpen(false);
    };

    const handleViewDetails = async (cita, clientId) => {
        setSelectedCita(cita);

        let clientDetails = null;
        if (clientId) {
            clientDetails = clientesDetails[clientId] || await fetchClienteDetails(clientId);
            setSelectedClient(clientDetails);
        }

        if (cita && clientDetails) {
            setIsVisualizadorOpen(true);
        }
    };

    const handleCloseVisualizador = () => {
        setIsVisualizadorOpen(false);
        setSelectedCita(null);
        setSelectedClient(null);
    };

    // Componente VisualizadorDeCitas integrado
    const VisualizadorDeCitas = ({ open, onClose, cita, cliente }) => {
        if (!open || !cita) return null;

        return (
            <div className="VisualizadorDeCitas-overlay">
                <div className="VisualizadorDeCitas-container">
                    <button className="VisualizadorDeCitas-close-button" onClick={onClose}>✖</button>
                    <h2 className="VisualizadorDeCitas-title">{cita.actividad}</h2>
                    <p className="VisualizadorDeCitas-subtitle">Consulta médica</p>

                    <div className="VisualizadorDeCitas-details">
                        <div className="VisualizadorDeCitas-detail">📅 Frecuencia: {cita.frecuencia}</div>
                        <div className="VisualizadorDeCitas-detail">⏱️ Sesiones: {cita.sesiones}</div>
                        <div className="VisualizadorDeCitas-detail">💰 Precio por hora: €{cita.precioHora}</div>
                        <div className="VisualizadorDeCitas-detail">📅 Fecha de caducidad: {new Date(cita.fechaDeCaducidad).toLocaleDateString()}</div>
                    </div>

                    <div className="VisualizadorDeCitas-section">
                        <h3>Planes de pago</h3>
                        {cita.paymentPlans.map(plan => (
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

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <button className="action-button" onClick={handleOpenCitasPopup}>
                Ver Citas
            </button>
            <table 
              className="servicioslista-tabla-servicios"
              style={{
                borderRadius: '10px', 
                borderCollapse: 'separate', 
                borderSpacing: '0', 
                width: '100%', 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
                <thead style={{
                    backgroundColor: theme === 'dark' ? '#3a3a3a' : 'rgb(38, 93, 181)',
                    borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
                }}>
                    <tr>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Actividad</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Nombre</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Sesiones</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Precio por Hora</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Acciones</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {citas.map(cita => (
                        <React.Fragment key={cita._id}>
                            <tr style={{
                                backgroundColor: theme === 'dark' ? (citas.indexOf(cita) % 2 === 0 ? '#333' : '#444') : (citas.indexOf(cita) % 2 === 0 ? '#f9f9f9' : '#ffffff')
                            }}>
                                <td style={{ padding: '12px' }}>{cita.actividad}</td>
                                <td style={{ padding: '12px' }}>{cita.nombre}</td>
                                <td style={{ padding: '12px' }}>{cita.sesiones}</td>
                                <td style={{ padding: '12px' }}>{cita.precioHora}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        className="action-button"
                                        onClick={() => handleViewDetails(cita, cita.clients[0]?.client)}
                                        style={{
                                            background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                            color: 'var(--button-text-dark)',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                            transition: 'background 0.3s ease'
                                        }}
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {(cita.paymentPlans && cita.paymentPlans.length > 0) || (cita.clients && cita.clients.length > 0) ? (
                                        <button
                                            className="action-button"
                                            onClick={() => toggleRowExpansion(cita._id, cita.clients)}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                color: theme === 'dark' ? '#bbb' : '#236dc9', 
                                                cursor: 'pointer',
                                                padding: '5px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {expandedRows[cita._id] ? 'Ocultar' : 'Ver'}
                                        </button>
                                    ) : null}
                                </td>
                            </tr>

                            {expandedRows[cita._id] && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '0', background: '#f9f9f9' }}>
                                        <div className="expandable-section">
                                            {cita.paymentPlans.map(plan => (
                                                <div className="plan-details" style={{ padding: '12px' }} key={plan._id}>
                                                    <p><strong>Plan:</strong> {plan.planName}</p>
                                                    <p><strong>Frecuencia:</strong> {plan.frequency}</p>
                                                    <p><strong>Duración:</strong> {plan.durationValue} {plan.durationUnit}</p>
                                                    <p><strong>Precio:</strong> {plan.price}</p>
                                                    <p><strong>Descuento:</strong> {plan.discount}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Popup para citas */}
            {isCitasPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <CitasPopup citas={citas} onClose={handleCloseCitasPopup} />
                    </div>
                </div>
            )}

            {/* Visualizador de citas */}
            {isVisualizadorOpen && (
                <div className="popup-overlay" onClick={handleCloseVisualizador}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <VisualizadorDeCitas
                            open={isVisualizadorOpen}
                            onClose={handleCloseVisualizador}
                            cita={selectedCita}
                            cliente={selectedClient}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitasLista;
