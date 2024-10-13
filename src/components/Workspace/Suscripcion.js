import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suscripcion.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Suscripcion = ({ theme }) => {
    const [nombreSubscripcion, setNombreSubscripcion] = useState('');
    const [descripcionSubscripcion, setDescripcionSubscripcion] = useState('');
    const [servicios, setServicios] = useState([
        { 
            id: Date.now(), 
            serviceType: '', 
            serviceName: '', 
            durationUnit: '',  
            durationValue: '',  
            isNewPack: false, 
            selectedPack: '', 
            actividad: '', 
            sesiones: 0, 
            selectedCita: null 
        }
    ]);
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/citas`);
                setCitas(response.data);
            } catch (error) {
                console.error('Error fetching citas:', error);
            }
        };

        fetchCitas();
    }, []);

    const handleAddServicio = () => {
        const newServicio = {
            id: Date.now(),
            serviceType: '',
            serviceName: '',
            durationUnit: '',
            durationValue: '',
            isNewPack: false,
            selectedPack: '',
            actividad: '',
            sesiones: 0,
            selectedCita: null
        };
        setServicios([...servicios, newServicio]);
    };

    const handleRemoveServicio = (id) => {
        setServicios(servicios.filter(servicio => servicio.id !== id));
    };

    const handleServicioChange = (id, field, value) => {
        setServicios(servicios.map(servicio =>
            servicio.id === id ? { ...servicio, [field]: value } : servicio
        ));
    };

    const handleCitaSelect = (id, citaId) => {
        const citaSeleccionada = citas.find(cita => cita._id === citaId);
        if (citaSeleccionada) {
            setServicios(servicios.map(servicio =>
                servicio.id === id
                    ? {
                        ...servicio,
                        selectedCita: citaId,
                        serviceName: citaSeleccionada.nombre,
                        actividad: citaSeleccionada.actividad,
                        sesiones: citaSeleccionada.sesiones
                    }
                    : servicio
            ));
        }
    };

    const calcularIngresoTotal = () => {
        return servicios.reduce((total, servicio) => total + parseFloat(servicio.precio || 0), 0);
    };

    const handleCreateSubscription = async () => {
        const newSubscription = {
            name: nombreSubscripcion,
            description: descripcionSubscripcion,
            services: servicios,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/subscriptions`, newSubscription);
            console.log('Subscription created successfully:', response.data);
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    return (
        <div className={`S-suscripcionesservicios-container ${theme}`}>
            <h5>Crear Nueva Suscripción</h5>

            <div className={`suscripcionesservicios-field ${theme}`}>
                <label>Nombre de la suscripción</label>
                <input
                    type="text"
                    value={nombreSubscripcion}
                    onChange={(e) => setNombreSubscripcion(e.target.value)}
                />
            </div>

            <div className={`suscripcionesservicios-field ${theme}`}>
                <label>Descripción de la suscripción</label>
                <textarea
                    value={descripcionSubscripcion}
                    onChange={(e) => setDescripcionSubscripcion(e.target.value)}
                />
            </div>

            <div className={`suscripcionesservicios-services ${theme}`}>
                {servicios.map((servicio, index) => (
                    <div className={`suscripcionesservicios-service ${theme}`} key={servicio.id}>
                        <div className={`suscripcionesservicios-field ${theme}`}>
                            <label>Tipo de Servicio</label>
                            <select
                                value={servicio.serviceType}
                                onChange={(e) => handleServicioChange(servicio.id, 'serviceType', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un servicio</option>
                                <option value="planificacion">Planificación</option>
                                <option value="dieta">Dieta</option>
                                <option value="otros">Otros servicios</option>
                                <option value="pack-citas">Pack de Citas</option>
                            </select>
                        </div>

                        <div className={`suscripcionesservicios-field ${theme}`}>
                            <label>Nombre del Servicio</label>
                            <input
                                type="text"
                                value={servicio.serviceName}
                                onChange={(e) => handleServicioChange(servicio.id, 'serviceName', e.target.value)}
                            />
                        </div>

                        <div className={`suscripcionesservicios-field ${theme}`}>
                            <label>Duración (Valor)</label>
                            <input
                                type="number"
                                value={servicio.durationValue}
                                onChange={(e) => handleServicioChange(servicio.id, 'durationValue', e.target.value)}
                            />
                        </div>

                        <div className={`suscripcionesservicios-field ${theme}`}>
                            <label>Duración (Unidad)</label>
                            <select
                                value={servicio.durationUnit}
                                onChange={(e) => handleServicioChange(servicio.id, 'durationUnit', e.target.value)}
                            >
                                <option value="" disabled>Selecciona la unidad</option>
                                <option value="weeks">Semanas</option>
                                <option value="months">Meses</option>
                            </select>
                        </div>

                        {servicio.serviceType === 'pack-citas' && (
                            <div className={`suscripcionesservicios-field ${theme}`}>
                                <label>¿Crear nuevo o elegir existente?</label>
                                <select
                                    value={servicio.isNewPack ? 'nuevo' : 'existente'}
                                    onChange={(e) => handleServicioChange(servicio.id, 'isNewPack', e.target.value === 'nuevo')}
                                >
                                    <option value="nuevo">Crear nuevo</option>
                                    <option value="existente">Seleccionar existente</option>
                                </select>
                            </div>
                        )}

                        {servicio.serviceType === 'pack-citas' && servicio.isNewPack && (
                            <>
                                <div className={`suscripcionesservicios-field ${theme}`}>
                                    <label>Actividad</label>
                                    <input
                                        type="text"
                                        value={servicio.actividad}
                                        onChange={(e) => handleServicioChange(servicio.id, 'actividad', e.target.value)}
                                    />
                                </div>
                                <div className={`suscripcionesservicios-field ${theme}`}>
                                    <label>Sesiones</label>
                                    <input
                                        type="number"
                                        value={servicio.sesiones}
                                        onChange={(e) => handleServicioChange(servicio.id, 'sesiones', e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {servicio.serviceType === 'pack-citas' && !servicio.isNewPack && (
                            <div className={`suscripcionesservicios-field ${theme}`}>
                                <label>Selecciona un Pack de Citas</label>
                                <select
                                    value={servicio.selectedCita}
                                    onChange={(e) => handleCitaSelect(servicio.id, e.target.value)}
                                >
                                    <option value="" disabled>Selecciona una cita</option>
                                    {citas.map(cita => (
                                        <option key={cita._id} value={cita._id}>
                                            {cita.nombre} - {cita.sesiones} sesiones a ${cita.precioHora}/hora
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {index > 0 && (
                            <button
                                className={`suscripcionesservicios-button remove-service ${theme}`}
                                onClick={() => handleRemoveServicio(servicio.id)}
                            >
                                Eliminar servicio
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleAddServicio} className={`suscripcionesservicios-button add-service ${theme}`}>
                Agregar Servicio
            </button>

            <div className={`suscripcionesservicios-summary ${theme}`}>
                <h6>Resumen de servicios</h6>
                {servicios.map((servicio, index) => (
                    <div className={`suscripcionesservicios-resumen-item ${theme}`} key={index}>
                        <p><strong>Tipo de Servicio:</strong> {servicio.serviceType}</p>
                        <p><strong>Nombre del servicio:</strong> {servicio.serviceName || servicio.selectedPack}</p>
                        <p><strong>Duración:</strong> {servicio.durationValue} {servicio.durationUnit}</p>
                        <p><strong>Actividad:</strong> {servicio.actividad}</p>
                        <p><strong>Sesiones:</strong> {servicio.sesiones}</p>
                        <p><strong>Precio:</strong> {servicio.precio}</p>
                    </div>
                ))}
                <p><strong>Ingreso Total:</strong> {calcularIngresoTotal()}</p>
            </div>

            <div className={`suscripcionesservicios-actions ${theme}`}>
                <button onClick={handleCreateSubscription} className={`suscripcionesservicios-button create ${theme}`}>
                    Crear Suscripción
                </button>
            </div>
        </div>
    );
};

export default Suscripcion;
