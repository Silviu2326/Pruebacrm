import React, { useState } from 'react';
import axios from 'axios';
import './Suscripcion.css';

const Suscripcion = () => {
    const [nombreSubscripcion, setNombreSubscripcion] = useState('');
    const [servicios, setServicios] = useState([
        { id: Date.now(), servicioConcreto: '', nombreServicio: '', precio: '' }
    ]);

    const handleAddServicio = () => {
        const newServicio = {
            id: Date.now(),
            servicioConcreto: '',
            nombreServicio: '',
            precio: ''
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

    const calcularIngresoTotal = () => {
        return servicios.reduce((total, servicio) => total + parseFloat(servicio.precio || 0), 0);
    };

    const handleCreateSubscription = async () => {
        const newSubscription = {
            name: nombreSubscripcion,
            services: servicios,
        };

        try {
            const response = await axios.post('http://localhost:5005/api/subscriptions', newSubscription);
            console.log('Subscription created successfully:', response.data);
            // Maneja la redirección o estado de éxito aquí
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    return (
        <div className="suscripcionesservicios-container">
            <h5>Crear Nueva Suscripción</h5>

            <div className="suscripcionesservicios-field">
                <label>Nombre de la suscripción</label>
                <input
                    type="text"
                    value={nombreSubscripcion}
                    onChange={(e) => setNombreSubscripcion(e.target.value)}
                />
            </div>

            <div className="suscripcionesservicios-services">
                {servicios.map((servicio, index) => (
                    <div className="suscripcionesservicios-service" key={servicio.id}>
                        <div className="suscripcionesservicios-field">
                            <label>Servicio</label>
                            <select
                                value={servicio.servicioConcreto}
                                onChange={(e) => handleServicioChange(servicio.id, 'servicioConcreto', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un servicio</option>
                                <option value="planificacion">Planificación</option>
                                <option value="dieta">Dieta</option>
                                <option value="otros">Otros servicios</option>
                            </select>
                        </div>
                        <div className="suscripcionesservicios-field">
                            <label>Nombre del servicio</label>
                            <input
                                type="text"
                                value={servicio.nombreServicio}
                                onChange={(e) => handleServicioChange(servicio.id, 'nombreServicio', e.target.value)}
                            />
                        </div>
                        <div className="suscripcionesservicios-field">
                            <label>Precio</label>
                            <input
                                type="number"
                                value={servicio.precio}
                                onChange={(e) => handleServicioChange(servicio.id, 'precio', e.target.value)}
                            />
                        </div>
                        {index > 0 && (
                            <button
                                className="suscripcionesservicios-button remove-service"
                                onClick={() => handleRemoveServicio(servicio.id)}
                            >
                                Eliminar servicio
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleAddServicio} className="suscripcionesservicios-button add-service">
                Agregar Servicio
            </button>

            <div className="suscripcionesservicios-summary">
                <h6>Resumen de servicios</h6>
                {servicios.map((servicio, index) => (
                    <div className="suscripcionesservicios-resumen-item" key={index}>
                        <p><strong>Servicio:</strong> {servicio.servicioConcreto}</p>
                        <p><strong>Nombre del servicio:</strong> {servicio.nombreServicio}</p>
                        <p><strong>Precio:</strong> {servicio.precio}</p>
                    </div>
                ))}
                <p><strong>Ingreso Total:</strong> {calcularIngresoTotal()}</p>
            </div>

            <div className="suscripcionesservicios-actions">
                <button onClick={handleCreateSubscription} className="suscripcionesservicios-button create">
                    Crear Suscripción
                </button>
            </div>
        </div>
    );
};

export default Suscripcion;
