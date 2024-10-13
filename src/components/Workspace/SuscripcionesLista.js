import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; 
import SuscripcionesPopup from './SuscripcionesPopup';
import PopupClasesMetodo from './popupclasesmetodo';
import SuscripcionesVerPlan from './SuscripcionesVerPlan';
import SuscripcionesVerCliente from './SuscripcionesVerCliente';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const SuscripcionesLista = ({ theme }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [associatedClients, setAssociatedClients] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedPlans, setExpandedPlans] = useState({});
    const [clientesDetails, setClientesDetails] = useState({});
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
        fetchAllClients();
    }, []);

    const fetchSubscriptions = () => {
        axios.get(`${API_BASE_URL}/api/subscriptions`)
            .then(response => {
                console.log('Suscripciones obtenidas:', response.data);
                setSubscriptions(response.data);
            })
            .catch(error => console.error('Error al cargar las suscripciones:', error));
    };

    const fetchAllClients = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => {
                console.log('Clientes obtenidos:', response.data);
                setAllClients(response.data);
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
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
                if (!clientesDetails[client.client]) {
                    await fetchClienteDetails(client.client);
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
        const allClientsInSubscription = service.clients.map(clientRelation => {
            return allClients.find(client => client._id === clientRelation.client);
        }).filter(client => client !== undefined); 

        setSelectedService({ ...service, clients: allClientsInSubscription });
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const handleOpenClientDetailsPopup = (client) => {
        const clientDetails = clientesDetails[client.client];
        setSelectedClient(clientDetails);
        setPopupType('clientDetails');
        setIsPopupOpen(true);
    };

    const handleOpenCreatePlanPopup = (service) => {
        setSelectedService(service);
        setPopupType('createPlan');
        setIsPopupOpen(true);
    };

    const handleOpenPlanDetailsPopup = (plan, clients) => {
        const processedClients = clients.map(client => ({
            ...client,
            nombre: clientesDetails[client.client]?.nombre
        }));

        setSelectedPlan(plan);
        setAssociatedClients(processedClients);
        setPopupType('planDetails');
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
        setSelectedPlan(null);
        setAssociatedClients([]);
        setPopupType('');
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <table 
              className={`servicioslista-tabla-servicios ${theme}`}
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
                    backgroundColor: 'var(--table-th-bg)',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    color: 'white'
                }}>
                    <tr style={{background: 'var(--table-th-bg)' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'white', background: 'var(--table-th-bg)' }}>Nombre</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'white', background: 'var(--table-th-bg)' }}>Descripción</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'white', background: 'var(--table-th-bg)' }}>Duración</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'white', background: 'var(--table-th-bg)' }}>Acciones</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'white', background: 'var(--table-th-bg)' }}>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map(service => (
                        <React.Fragment key={service._id}>
                            <tr style={{
                                backgroundColor: theme === 'dark' ? (subscriptions.indexOf(service) % 2 === 0 ? '#333' : '#444') : (subscriptions.indexOf(service) % 2 === 0 ? '#f9f9f9' : '#ffffff')
                            }}>
                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{service.name}</td>
                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{service.description}</td>
                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>
                                    {service.durationValue && service.durationUnit
                                        ? `${service.durationValue} ${service.durationUnit}`
                                        : 'N/A'}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        className={`action-button ${theme}`}
                                        onClick={() => handleOpenPopup(service, 'subscription')}
                                        style={{
                                          background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                          color: 'var(--button-text-dark)',
                                          borderRadius: '5px',
                                          cursor: 'pointer',
                                          padding: '10px 20px',
                                          fontSize: '16px',
                                          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                          transition: 'background 0.3s ease'
                                        }}
                                    >
                                        Ver Detalles
                                    </button>
                                    <button
                                        className={`action-button ${theme}`}
                                        onClick={() => handleOpenCreatePlanPopup(service)}
                                        style={{ 
                                          marginLeft: '10px', 
                                          background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)', 
                                          color: 'var(--button-text-dark)', 
                                          padding: '10px 20px', 
                                          borderRadius: '5px', 
                                          cursor: 'pointer', 
                                          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                          transition: 'background 0.3s ease'
                                        }}
                                    >
                                        Crear Plan de Pago
                                    </button>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {(service.paymentPlans && service.paymentPlans.length > 0) || (service.clients && service.clients.length > 0) ? (
                                        <button
                                            className={`action-button ${theme}`}
                                            onClick={() => toggleRowExpansion(service._id, service.clients)}
                                            style={{ 
                                              marginRight: '10px', 
                                              background: 'none', 
                                              border: 'none', 
                                              color: theme === 'dark' ? '#bbb' : '#236dc9', 
                                              cursor: 'pointer',
                                              padding: '5px',
                                              fontSize: '14px'
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
                                        <div className={`expandable-section ${theme}`}>
                                            <table className="sub-table" style={{ width: '100%', marginLeft: '20px', borderCollapse: 'collapse' }}>
                                                <thead style={{
                                                    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#dfe5f1',
                                                    borderBottom: '1px solid',
                                                    borderColor: theme === 'dark' ? '#444' : '#ccc',
                                                    borderTopLeftRadius: '10px',
                                                    borderTopRightRadius: '10px'
                                                }}>
                                                    <tr>
                                                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Plan</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Frecuencia</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Duración</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Precio</th>
                                                        <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {service.paymentPlans.map(plan => (
                                                        <React.Fragment key={plan._id}>
                                                            <tr>
                                                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.planName}</td>
                                                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.frequency}</td>
                                                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.durationValue} {plan.durationUnit}</td>
                                                                <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.price}</td>
                                                                <td style={{ padding: '12px' }}>
                                                                    <button
                                                                        className={`action-button ${theme}`}
                                                                        onClick={() => togglePlanExpansion(plan._id)}
                                                                        style={{ 
                                                                          background: 'none', 
                                                                          border: 'none', 
                                                                          color: theme === 'dark' ? '#bbb' : '#236dc9', 
                                                                          cursor: 'pointer',
                                                                          padding: '5px',
                                                                          fontSize: '14px'
                                                                        }}
                                                                    >
                                                                        {expandedPlans[plan._id] ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                    </button>
                                                                </td>
                                                            </tr>

                                                            {expandedPlans[plan._id] && (
                                                                <tr>
                                                                    <td colSpan="5">
                                                                        <table className="sub-table" style={{ width: '100%', marginLeft: '40px', borderCollapse: 'collapse' }}>
                                                                            <thead style={{
                                                                                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#dfe5f1',
                                                                                borderBottom: '1px solid',
                                                                                borderColor: theme === 'dark' ? '#444' : '#ccc',
                                                                                borderTopLeftRadius: '10px',
                                                                                borderTopRightRadius: '10px'
                                                                            }}>
                                                                                <tr>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Nombre Cliente</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Email</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Status</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Fecha de Inicio</th>
                                                                                    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Fecha de Fin</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {service.clients.filter(client => client.paymentPlan === plan._id).map(client => (
                                                                                    <tr key={client._id}>
                                                                                        <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{clientesDetails[client.client]?.nombre || 'Cargando...'}</td>
                                                                                        <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{clientesDetails[client.client]?.email || 'Cargando...'}</td>
                                                                                        <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{client.status}</td>
                                                                                        <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{new Date(client.startDate).toLocaleDateString()}</td>
                                                                                        <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{new Date(client.endDate).toLocaleDateString()}</td>
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

            {popupType === 'planDetails' && (
                <SuscripcionesVerPlan 
                    plan={selectedPlan} 
                    clients={associatedClients} 
                    onClose={handleClosePopup} 
                    theme={theme}
                />
            )}
            {popupType === 'clientDetails' && (
                <SuscripcionesVerCliente 
                    cliente={selectedClient} 
                    onClose={handleClosePopup} 
                    theme={theme}
                />
            )}

            {popupType === 'subscription' && (
                <SuscripcionesPopup service={selectedService} onClose={handleClosePopup} theme={theme}/>
            )}
            {popupType === 'createPlan' && (
                <PopupClasesMetodo
                    service={selectedService} 
                    onClose={handleClosePopup} 
                    theme={theme}
                />
            )}
        </div>
    );
};

export default SuscripcionesLista;
