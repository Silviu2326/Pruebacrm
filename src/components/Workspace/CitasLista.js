import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Paper } from '@mui/material';
import CitasPopup from './CitasPopup'; // No necesitas importar VisualizadorDeCitas por separado
import './VisualizadorDeCitas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

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
            console.log(`Detalles del cliente con ID ${clienteId}:`, response.data); 
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
        console.log("Cita seleccionada:", cita);
        setSelectedCita(cita);

        let clientDetails = null;
        if (clientId) {
            clientDetails = clientesDetails[clientId] || await fetchClienteDetails(clientId);
            
            if (clientDetails) {
                console.log("Cliente seleccionado para ver detalles:", clientDetails);
                setSelectedClient(clientDetails);
            } else {
                console.warn(`No se encontraron detalles del cliente con ID ${clientId}`);
            }
        } else {
            console.warn("ID del cliente no está disponible");
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
        console.log("Props recibidas en VisualizadorDeCitas:", { open, cita, cliente });

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

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <Button variant="contained" color="primary" onClick={handleOpenCitasPopup}>
                Ver Citas
            </Button>
            <TableContainer component={Paper}>
                <Table className="servicioslista-tabla-servicios">
                    <TableHead>
                        <TableRow>
                            <TableCell>Actividad</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Sesiones</TableCell>
                            <TableCell>Precio por Hora</TableCell>
                            <TableCell>Acciones</TableCell>
                            <TableCell>Detalles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {citas.map(cita => (
                            <React.Fragment key={cita._id}>
                                <TableRow>
                                    <TableCell>{cita.actividad}</TableCell>
                                    <TableCell>{cita.nombre}</TableCell>
                                    <TableCell>{cita.sesiones}</TableCell>
                                    <TableCell>{cita.precioHora}</TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => handleViewDetails(cita, cita.clients[0]?.client)} 
                                        >
                                            Ver Detalles
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {(cita.paymentPlans && cita.paymentPlans.length > 0) || (cita.clients && cita.clients.length > 0) ? (
                                            <Button 
                                                variant="text" 
                                                color="secondary" 
                                                onClick={() => toggleRowExpansion(cita._id, cita.clients)}
                                            >
                                                {expandedRows[cita._id] ? 'Ocultar' : 'Ver'}
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>

                                {/* Subtabla para Payment Plans y Clientes */}
                                {cita.paymentPlans && cita.paymentPlans.length > 0 && (
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={expandedRows[cita._id]} timeout="auto" unmountOnExit>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Plan Name</TableCell>
                                                            <TableCell>Frequency</TableCell>
                                                            <TableCell>Duration</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>Discount</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {cita.paymentPlans.map(plan => (
                                                            <React.Fragment key={plan._id}>
                                                                <TableRow style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
                                                                    <TableCell>{plan.planName}</TableCell>
                                                                    <TableCell>{plan.frequency}</TableCell>
                                                                    <TableCell>{plan.durationValue} {plan.durationUnit}</TableCell>
                                                                    <TableCell>{plan.price}</TableCell>
                                                                    <TableCell>{plan.discount}</TableCell>
                                                                </TableRow>

                                                                {/* Renderizar los clientes asociados al plan */}
                                                                {cita.clients.filter(client => client.paymentPlan === plan._id).length > 0 && (
                                                                    <TableRow>
                                                                        <TableCell style={{ padding: '10px 16px', backgroundColor: '#e7f3ff', borderBottom: '1px solid #ddd' }} colSpan={5}>
                                                                            <Collapse in={expandedRows[cita._id]} timeout="auto" unmountOnExit>
                                                                                <Table size="small">
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                                                                            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                                                                                            <TableCell style={{ fontWeight: 'bold' }}>Estado</TableCell>
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    <TableBody>
                                                                                        {cita.clients.filter(client => client.paymentPlan === plan._id).map(client => {
                                                                                            const clientDetails = clientesDetails[client.client];
                                                                                            console.log("Detalles del cliente antes de pasar al visualizador:", clientDetails); 
                                                                                            return (
                                                                                                <TableRow key={client._id} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ddd' }}>
                                                                                                    <TableCell>
                                                                                                        <Button
                                                                                                            variant="text"
                                                                                                            onClick={() => handleViewDetails(cita, client.client)}
                                                                                                        >
                                                                                                            {clientDetails?.nombre || 'Cargando...'}
                                                                                                        </Button>
                                                                                                    </TableCell>
                                                                                                    <TableCell>{clientDetails?.email || 'Cargando...'}</TableCell>
                                                                                                    <TableCell>{client.status}</TableCell>
                                                                                                </TableRow>
                                                                                            );
                                                                                        })}
                                                                                    </TableBody>
                                                                                </Table>
                                                                            </Collapse>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={isCitasPopupOpen}
                onClose={handleCloseCitasPopup}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    style: {
                        minHeight: '80vh',
                        minWidth: '80vw',
                    },
                }}
            >
                <DialogContent>
                    <CitasPopup citas={citas} onClose={handleCloseCitasPopup} />
                </DialogContent>
            </Dialog>

            {/* Visualizador de Citas Integrado */}
            <Dialog
                open={isVisualizadorOpen}
                onClose={handleCloseVisualizador}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <VisualizadorDeCitas 
                        open={isVisualizadorOpen} 
                        onClose={handleCloseVisualizador} 
                        cita={selectedCita} 
                        cliente={selectedClient} 
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CitasLista;
