import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Trash2, FileText, PlusCircle } from 'lucide-react'; // Importamos los iconos de Lucide React
import AsesoriaPopup from './AsesoriaPopup';
import PaymentPlansAsesoriapopup from './PaymentPlansAsesoriapopup';
import PaymentPlansAsesoriapopupdetalles from './PaymentPlansAsesoriapopupdetalles';
import PanelClienteAsesoria from './PanelClienteAsesoria';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const AsesoriasLista = ({ theme }) => {
    const [consultations, setConsultations] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [associatedClients, setAssociatedClients] = useState([]);
    const [isClientPopupOpen, setIsClientPopupOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedPlans, setExpandedPlans] = useState({});
    const [clientesDetails, setClientesDetails] = useState({});

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = () => {
        axios.get(`${API_BASE_URL}/api/individualConsultations`)
            .then(response => setConsultations(response.data))
            .catch(error => console.error('Error al cargar las asesorías individuales:', error));
    };

    const fetchClienteDetails = async (clienteId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes/${clienteId}`);
            setClientesDetails(prevState => ({
                ...prevState,
                [clienteId]: response.data
            }));
        } catch (error) {
            console.error(`Error al obtener detalles del cliente con ID ${clienteId}:`, error);
        }
    };

    const toggleRowExpansion = async (serviceId, clients) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [serviceId]: !prevState[serviceId]
        }));

        if (!expandedRows[serviceId]) {
            for (const client of clients) {
                if (!clientesDetails[client.client._id]) {
                    await fetchClienteDetails(client.client._id);
                }
            }
        }
    };

    const togglePlanExpansion = (planId) => {
        setExpandedPlans(prevState => ({
            ...prevState,
            [planId]: !prevState[planId]
        }));
    };

    const handleOpenPopup = (service, type) => {
        setSelectedService(service);
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleOpenCreatePlanPopup = (service) => {
        setSelectedService(service);
        setPopupType('createPlan');
        setIsPopupOpen(true);
    };

    const handleOpenPlanDetailsPopup = (plan, clients) => {
        setSelectedPlan(plan);
        setAssociatedClients(clients);
        setPopupType('planDetails');
        setIsPopupOpen(true);
    };

    const handleOpenClientPopup = (client) => {
        setSelectedClient(client);
        setSelectedService(consultations.find(service => service.clients.some(c => c._id === client._id)));
        setIsClientPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
        setSelectedPlan(null);
        setAssociatedClients([]);
        setPopupType('');
    };

    const handleCloseClientPopup = () => {
        setIsClientPopupOpen(false);
        setSelectedClient(null);
    };

    const handleDeleteConsultation = async (consultationId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta asesoría? Esta acción no se puede deshacer.");
        if (confirmDelete) {
            try {
                await axios.delete(`${API_BASE_URL}/api/individualConsultations/${consultationId}`);
                setConsultations(consultations.filter(consultation => consultation._id !== consultationId));
                console.log('Asesoría eliminada exitosamente.');
            } catch (error) {
                console.error('Error al eliminar la asesoría:', error);
            }
        }
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
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
                        <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Nombre</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Descripción</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Duración</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Acciones</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {consultations.map(service => (
                        <React.Fragment key={service._id}>
                            <tr style={{
                                backgroundColor: theme === 'dark' ? (consultations.indexOf(service) % 2 === 0 ? '#333' : '#444') : (consultations.indexOf(service) % 2 === 0 ? '#f9f9f9' : '#ffffff')
                            }}>
                                <td style={{ padding: '12px' }}>{service.name}</td>
                                <td style={{ padding: '12px' }}>{service.description}</td>
                                <td style={{ padding: '12px' }}>
                                    {service.durationValue && service.durationUnit
                                        ? `${service.durationValue} ${service.durationUnit === 'weeks' ? 'semana(s)' : 'mes(es)'}` 
                                        : 'N/A'}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        className="action-button"
                                        onClick={() => handleOpenPopup(service, 'consultation')}
                                        style={{
                                          background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                          color: 'var(--button-text-dark)',
                                          borderRadius: '5px',
                                          cursor: 'pointer',
                                          padding: '10px 20px',
                                          fontSize: '16px',
                                          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                          transition: 'background 0.3s ease',
                                          display: 'flex', 
                                          alignItems: 'center',
                                          gap: '5px'
                                        }}
                                    >
                                        <FileText size={16} /> Ver Detalles
                                    </button>
                                    <button
                                        className="action-button"
                                        onClick={() => handleOpenCreatePlanPopup(service)}
                                        style={{ 
                                          marginLeft: '10px', 
                                          background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                          color: 'var(--button-text-dark)', 
                                          padding: '10px 20px', 
                                          borderRadius: '5px', 
                                          cursor: 'pointer', 
                                          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                          transition: 'background 0.3s ease',
                                          display: 'flex', 
                                          alignItems: 'center',
                                          gap: '5px'
                                        }}
                                    >
                                        <PlusCircle size={16} /> Crear Plan de Pago
                                    </button>
                                    <button
                                        className="action-button"
                                        onClick={() => handleDeleteConsultation(service._id)}
                                        style={{ 
                                          marginLeft: '10px', 
                                          background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                          color: 'var(--button-text-dark)', 
                                          padding: '10px 20px', 
                                          borderRadius: '5px', 
                                          cursor: 'pointer', 
                                          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                          transition: 'background 0.3s ease',
                                          display: 'flex', 
                                          alignItems: 'center',
                                          gap: '5px'
                                        }}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {(service.paymentPlans && service.paymentPlans.length > 0) || (service.clients && service.clients.length > 0) ? (
                                        <button
                                            className="action-button"
                                            onClick={() => toggleRowExpansion(service._id, service.clients)}
                                            style={{ 
                                              marginRight: '10px', 
                                              background: 'none', 
                                              border: 'none', 
                                              color: theme === 'dark' ? '#bbb' : '#236dc9', 
                                              cursor: 'pointer',
                                              padding: '5px',
                                              fontSize: '14px',
                                              display: 'flex', 
                                              alignItems: 'center',
                                              gap: '5px'
                                            }}
                                        >
                                            {expandedRows[service._id] ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    ) : null}
                                </td>
                            </tr>

                            {expandedRows[service._id] && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '0', background: '#f9f9f9' }}>
                                        <div className="expandable-section">
                                            {/* Tabla de Planes de Pago */}
                                            <table className="sub-table" style={{ width: '100%', marginLeft: '20px', borderCollapse: 'collapse' }}>
                                                <thead style={{
                                                    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#dfe5f1',
                                                    borderBottom: '1px solid',
                                                    borderColor: theme === 'dark' ? '#444' : '#ccc'
                                                }}>
                                                    <tr>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Plan</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Frecuencia</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Duración</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Precio</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {service.paymentPlans.map(plan => (
                                                        <React.Fragment key={plan._id}>
                                                            <tr>
                                                                <td style={{ padding: '12px' }}>{plan.planName}</td>
                                                                <td style={{ padding: '12px' }}>{plan.frequency}</td>
                                                                <td style={{ padding: '12px' }}>{plan.durationValue} {plan.durationUnit}</td>
                                                                <td style={{ padding: '12px' }}>{plan.price}</td>
                                                                <td style={{ padding: '12px' }}>
                                                                    <button
                                                                        className="action-button"
                                                                        onClick={() => togglePlanExpansion(plan._id)}
                                                                        style={{ 
                                                                          background: 'none', 
                                                                          border: 'none', 
                                                                          color: theme === 'dark' ? '#bbb' : '#236dc9', 
                                                                          cursor: 'pointer',
                                                                          padding: '5px',
                                                                          fontSize: '14px',
                                                                          display: 'flex', 
                                                                          alignItems: 'center',
                                                                          gap: '5px'
                                                                        }}
                                                                    >
                                                                        {expandedPlans[plan._id] ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                    </button>
                                                                </td>
                                                            </tr>

                                                            {/* Subtabla de clientes asociados al plan de pago */}
                                                            {expandedPlans[plan._id] && (
                                                                <tr>
                                                                    <td colSpan="5">
                                                                        <table className="sub-table" style={{ width: '100%', marginLeft: '40px', borderCollapse: 'collapse' }}>
                                                                            <thead style={{
                                                                                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#dfe5f1',
                                                                                borderBottom: '1px solid',
                                                                                borderColor: theme === 'dark' ? '#444' : '#ccc'
                                                                            }}>
                                                                                <tr>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Nombre Cliente</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Email</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Status</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Fecha de Inicio</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: theme === 'dark' ? 'white' : 'black' }}>Fecha de Fin</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {service.clients.filter(client => client.paymentPlan === plan._id).map(client => (
                                                                                    <tr key={client._id}>
                                                                                        <td style={{ padding: '12px' }}>{client.client.nombre}</td>
                                                                                        <td style={{ padding: '12px' }}>{client.client.email}</td>
                                                                                        <td style={{ padding: '12px' }}>{client.status}</td>
                                                                                        <td style={{ padding: '12px' }}>{new Date(client.startDate).toLocaleDateString()}</td>
                                                                                        <td style={{ padding: '12px' }}>{new Date(client.endDate).toLocaleDateString()}</td>
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
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Popup de consulta y detalles del plan */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        {popupType === 'consultation' && (
                            <AsesoriaPopup service={selectedService} onClose={handleClosePopup} />
                        )}
                        {popupType === 'planDetails' && (
                            <PaymentPlansAsesoriapopupdetalles
                                plan={selectedPlan}
                                clients={associatedClients}
                                onClose={handleClosePopup}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Modal para crear plan de pago */}
            {popupType === 'createPlan' && (
                <div className="modal-overlay" onClick={handleClosePopup}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <PaymentPlansAsesoriapopup
                            service={selectedService}
                            onClose={handleClosePopup}
                        />
                    </div>
                </div>
            )}

            {/* Panel de detalles del cliente */}
            {selectedClient && (
                <PanelClienteAsesoria
                    isOpen={isClientPopupOpen}
                    onClose={handleCloseClientPopup}
                    cliente={selectedClient.client}
                    asesoria={selectedService}
                />
            )}
        </div>
    );
};

export default AsesoriasLista;
