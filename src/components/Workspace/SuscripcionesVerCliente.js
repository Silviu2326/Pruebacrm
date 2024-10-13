// SuscripcionesVerCliente.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import PopupCrearRutina from './PopupCrearRutina';
import PopupCrearDieta from './PopupCrearDieta';
import PopupCrearCita from './PopupCrearCita';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const SuscripcionesVerCliente = ({ cliente, onClose, asesoria }) => {
    const [rutinas, setRutinas] = useState([]);
    const [dietas, setDietas] = useState([]);
    const [citas, setCitas] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState('');
    const [selectedDiet, setSelectedDiet] = useState('');
    const [selectedCita, setSelectedCita] = useState('');
    const [associatedRoutine, setAssociatedRoutine] = useState(null);

    // Estados para manejar la apertura de popups
    const [isRutinaPopupOpen, setRutinaPopupOpen] = useState(false);
    const [isDietaPopupOpen, setDietaPopupOpen] = useState(false);
    const [isCitaPopupOpen, setCitaPopupOpen] = useState(false);

    useEffect(() => {
        if (asesoria) {
            // Cambia 'subtipo' por 'services' para acceder a la información correcta
            if (asesoria.services.some(service => service.serviceType === 'planificacion')) {
                axios.get(`${API_BASE_URL}/api/routines`)
                    .then(response => {
                        const clienteRutina = response.data.find(r => r.cliente && r.cliente._id.toString() === cliente._id.toString());
                        if (clienteRutina) {
                            setAssociatedRoutine(clienteRutina);
                        } else {
                            setRutinas(response.data);
                        }
                    })
                    .catch(error => console.error('Error al cargar las rutinas:', error));
            }

            if (asesoria.services.some(service => service.serviceType === 'dieta')) {
                axios.get(`${API_BASE_URL}/api/dietas`)
                    .then(response => setDietas(response.data))
                    .catch(error => console.error('Error al cargar las dietas:', error));
            }

            if (asesoria.services.some(service => service.serviceType === 'cita')) {
                axios.get(`${API_BASE_URL}/api/citas`)
                    .then(response => setCitas(response.data))
                    .catch(error => console.error('Error al cargar las citas:', error));
            }
        }
    }, [asesoria, cliente._id]);

    const handleRoutineSelect = (event) => setSelectedRoutine(event.target.value);
    const handleViewRoutine = () => console.log('Asignar Rutina:', selectedRoutine);
    const handleCreateRoutine = () => setRutinaPopupOpen(true);
    const handleDeleteRoutine = () => console.log('Borrar Rutina para:', cliente.nombre);

    const handleDietSelect = (event) => setSelectedDiet(event.target.value);
    const handleViewDiet = () => console.log('Asignar Dieta:', selectedDiet);
    const handleCreateDiet = () => setDietaPopupOpen(true);

    const handleCitaSelect = (event) => setSelectedCita(event.target.value);
    const handleViewCita = () => console.log('Asignar Cita:', selectedCita);
    const handleCreateCita = () => setCitaPopupOpen(true);

    if (!cliente) return null; // Si no hay cliente seleccionado, no mostrar nada.

    return (
        <Dialog open={Boolean(cliente)} onClose={onClose}>
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogContent>
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Email:</strong> {cliente.email}</p>
                <p><strong>Estado:</strong> {cliente.status}</p>

                {asesoria.services.some(service => service.serviceType === 'planificacion') && (
                    <div>
                        <h6>Entrenamiento Personal</h6>
                        {associatedRoutine ? (
                            <div>
                                <span>{associatedRoutine.nombre}</span>
                                <Button onClick={handleDeleteRoutine} color="secondary">
                                    Borrar Rutina
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Button onClick={handleCreateRoutine} color="primary">
                                    Crear Rutina
                                </Button>
                                <Select value={selectedRoutine} onChange={handleRoutineSelect} displayEmpty>
                                    <MenuItem value="" disabled>Seleccionar rutina</MenuItem>
                                    {rutinas.map(routine => (
                                        <MenuItem key={routine._id} value={routine._id}>
                                            {routine.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {selectedRoutine && (
                                    <Button onClick={handleViewRoutine} color="primary">
                                        Asignar Rutina
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {asesoria.services.some(service => service.serviceType === 'dieta') && (
                    <div>
                        <h6>Dieta</h6>
                        <Button onClick={handleCreateDiet} color="primary">
                            Crear Dieta
                        </Button>
                        <Select value={selectedDiet} onChange={handleDietSelect} displayEmpty>
                            <MenuItem value="" disabled>Seleccionar dieta</MenuItem>
                            {dietas.map(dieta => (
                                <MenuItem key={dieta._id} value={dieta._id}>
                                    {dieta.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedDiet && (
                            <Button onClick={handleViewDiet} color="primary">
                                Asignar Dieta
                            </Button>
                        )}
                    </div>
                )}

                {asesoria.services.some(service => service.serviceType === 'cita') && (
                    <div>
                        <h6>Citas</h6>
                        <Button onClick={handleCreateCita} color="primary">
                            Crear Cita
                        </Button>
                        <Select value={selectedCita} onChange={handleCitaSelect} displayEmpty>
                            <MenuItem value="" disabled>Seleccionar cita</MenuItem>
                            {citas.map(cita => (
                                <MenuItem key={cita._id} value={cita._id}>
                                    {cita.nombre} - {cita.actividad}
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedCita && (
                            <Button onClick={handleViewCita} color="primary">
                                Asignar Cita
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cerrar</Button>
            </DialogActions>

            {/* Popups Modales */}
            <PopupCrearRutina isOpen={isRutinaPopupOpen} onClose={() => setRutinaPopupOpen(false)} />
            <PopupCrearDieta isOpen={isDietaPopupOpen} onClose={() => setDietaPopupOpen(false)} />
            <PopupCrearCita isOpen={isCitaPopupOpen} onClose={() => setCitaPopupOpen(false)} />
        </Dialog>
    );
};

export default SuscripcionesVerCliente;
