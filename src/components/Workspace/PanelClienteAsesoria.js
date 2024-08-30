import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PanelClienteAsesoria.css';
import PopupCrearRutina from './PopupCrearRutina';
import PopupCrearDieta from './PopupCrearDieta';
import PopupCrearCita from './PopupCrearCita';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const PanelClienteAsesoria = ({ isOpen, onClose, cliente, asesoria }) => {
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
            console.log('Asesoría recibida:', asesoria);
            console.log('Cliente recibido:', cliente);

            if (asesoria.subtipo.some(st => st.service === 'Planificación Deportiva')) {
                axios.get(`${API_BASE_URL}/api/routines`)
                    .then(response => {
                        console.log('Rutinas recibidas:', response.data);
                        const clienteRutina = response.data.find(r => r.cliente && r.cliente._id.toString() === cliente._id.toString());

                        if (clienteRutina) {
                            console.log('Rutina asociada encontrada:', clienteRutina);
                            setAssociatedRoutine(clienteRutina);
                        } else {
                            console.log('No se encontró rutina asociada, mostrando opciones para seleccionar.');
                            setRutinas(response.data);
                        }
                    })
                    .catch(error => console.error('Error al cargar las rutinas:', error));
            }

            if (asesoria.subtipo.some(st => st.service === 'Dieta')) {
                axios.get(`${API_BASE_URL}/api/dietas`)
                    .then(response => {
                        console.log('Dietas recibidas:', response.data);
                        setDietas(response.data);
                    })
                    .catch(error => console.error('Error al cargar las dietas:', error));
            }

            if (asesoria.subtipo.some(st => st.service === 'Cita Presencial')) {
                axios.get(`${API_BASE_URL}/api/citas`)
                    .then(response => {
                        console.log('Citas recibidas:', response.data);
                        setCitas(response.data);
                    })
                    .catch(error => console.error('Error al cargar las citas:', error));
            }
        }
    }, [asesoria, cliente._id]);

    const handleRoutineSelect = (event) => {
        setSelectedRoutine(event.target.value);
    };

    const handleViewRoutine = () => {
        console.log('Asignar Rutina:', selectedRoutine);
    };

    const handleCreateRoutine = () => {
        setRutinaPopupOpen(true);
    };

    const handleDeleteRoutine = () => {
        console.log('Borrar Rutina para:', cliente.nombre);
    };

    const handleDietSelect = (event) => {
        setSelectedDiet(event.target.value);
    };

    const handleViewDiet = () => {
        console.log('Asignar Dieta:', selectedDiet);
    };

    const handleCreateDiet = () => {
        setDietaPopupOpen(true);
    };

    const handleCitaSelect = (event) => {
        setSelectedCita(event.target.value);
    };

    const handleViewCita = () => {
        console.log('Asignar Cita:', selectedCita);
    };

    const handleCreateCita = () => {
        setCitaPopupOpen(true);
    };

    if (!isOpen) return null;

    return (
        <div className="PanelClienteAsesoria-overlay">
            <div className="PanelClienteAsesoria-dialog">
                <div className="PanelClienteAsesoria-header">
                    Detalles del Cliente y Asesoría
                </div>
                <div className="PanelClienteAsesoria-section">
                    <h6>Cliente</h6>
                    <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                    <p>Email: {cliente.email}</p>
                    <p>Teléfono: {cliente.telefono}</p>
                    <p>Ciudad: {cliente.city}</p>
                    <p>País: {cliente.country}</p>
                </div>
                <div className="PanelClienteAsesoria-section">
                    <h6>Asesoría</h6>
                    <p>Nombre de la Asesoría: {asesoria.name}</p>
                    <p>Descripción: {asesoria.description}</p>
                    <p>Objetivos: {asesoria.objectives}</p>
                </div>

                {/* Sección para crear o seleccionar Rutinas */}
                {asesoria.subtipo.some(st => st.service === 'Planificación Deportiva') && (
                    <div className="PanelClienteAsesoria-section">
                        <h6>Entrenamiento Personal</h6>
                        {associatedRoutine ? (
                            <div className="PanelClienteAsesoria-associated-routine">
                                <span>{associatedRoutine.nombre}</span>
                                <button 
                                    className="PanelClienteAsesoria-button-delete" 
                                    onClick={handleDeleteRoutine}
                                >
                                    Borrar Rutina
                                </button>
                            </div>
                        ) : (
                            <div className="PanelClienteAsesoria-select-wrapper">
                                <button className="PanelClienteAsesoria-button" onClick={handleCreateRoutine}>
                                    Crear Rutina
                                </button>
                                <select
                                    className="PanelClienteAsesoria-select"
                                    value={selectedRoutine}
                                    onChange={handleRoutineSelect}
                                >
                                    <option value="" disabled>Seleccionar rutina</option>
                                    {rutinas.map((routine) => (
                                        <option key={routine._id} value={routine._id}>
                                            {routine.nombre}
                                        </option>
                                    ))}
                                </select>
                                {selectedRoutine && (
                                    <button 
                                        className="PanelClienteAsesoria-button-secondary" 
                                        onClick={handleViewRoutine}
                                    >
                                        Asignar Rutina
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Sección para crear o seleccionar Dietas */}
                {asesoria.subtipo.some(st => st.service === 'Dieta') && (
                    <div className="PanelClienteAsesoria-section">
                        <h6>Dieta</h6>
                        <div className="PanelClienteAsesoria-select-wrapper">
                            <button className="PanelClienteAsesoria-button" onClick={handleCreateDiet}>
                                Crear Dieta
                            </button>
                            <select
                                className="PanelClienteAsesoria-select"
                                value={selectedDiet}
                                onChange={handleDietSelect}
                            >
                                <option value="" disabled>Seleccionar dieta</option>
                                {dietas.map((dieta) => (
                                    <option key={dieta._id} value={dieta._id}>
                                        {dieta.nombre}
                                    </option>
                                ))}
                            </select>
                            {selectedDiet && (
                                <button 
                                    className="PanelClienteAsesoria-button-secondary" 
                                    onClick={handleViewDiet}
                                >
                                    Asignar Dieta
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Sección para crear o seleccionar Citas */}
                {asesoria.subtipo.some(st => st.service === 'Cita Presencial') && (
                    <div className="PanelClienteAsesoria-section">
                        <h6>Citas</h6>
                        <div className="PanelClienteAsesoria-select-wrapper">
                            <button className="PanelClienteAsesoria-button" onClick={handleCreateCita}>
                                Crear Cita
                            </button>
                            <select
                                className="PanelClienteAsesoria-select"
                                value={selectedCita}
                                onChange={handleCitaSelect}
                            >
                                <option value="" disabled>Seleccionar cita</option>
                                {citas.map((cita) => (
                                    <option key={cita._id} value={cita._id}>
                                        {cita.nombre} - {cita.actividad}
                                    </option>
                                ))}
                            </select>
                            {selectedCita && (
                                <button 
                                    className="PanelClienteAsesoria-button-secondary" 
                                    onClick={handleViewCita}
                                >
                                    Asignar Cita
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="PanelClienteAsesoria-actions">
                    <button className="PanelClienteAsesoria-button" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Popups Modales */}
            <PopupCrearRutina 
                isOpen={isRutinaPopupOpen} 
                onClose={() => setRutinaPopupOpen(false)} 
            />
            <PopupCrearDieta 
                isOpen={isDietaPopupOpen} 
                onClose={() => setDietaPopupOpen(false)} 
            />
            <PopupCrearCita 
                isOpen={isCitaPopupOpen} 
                onClose={() => setCitaPopupOpen(false)} 
            />
        </div>
    );
};

export default PanelClienteAsesoria;
