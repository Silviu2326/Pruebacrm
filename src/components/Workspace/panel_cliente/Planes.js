import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Planes.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const Planes = ({ cliente }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [fixedPlans, setFixedPlans] = useState([]); // Estado para almacenar los planes fijos

    useEffect(() => {
        const fetchFixedPlans = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/plans/fixed`);
                setFixedPlans(response.data);
            } catch (error) {
                console.error('Error fetching fixed plans:', error);
            }
        };

        fetchFixedPlans();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPlan(null); // Limpiar el plan seleccionado al cerrar el modal
    };

    const handleViewPlan = async (planId) => {
        if (!planId) {
            console.error('ID del plan no encontrado');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/plans/fixed/${planId}`);
            setSelectedPlan(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching plan details:', error);
        }
    };

    return (
        <div className="section">
            <div className="header">
                <h3>Planes</h3>
            </div>
            <ul>
                {fixedPlans.map((plan, index) => (
                    <li key={index}>
                        <div>
                            <strong>Nombre del Plan:</strong> {plan.name} <br />
                            <strong>ID del Plan:</strong> {plan._id}
                        </div>
                        <button 
                            onClick={() => handleViewPlan(plan._id)} 
                            className="verButton"
                            disabled={!plan._id} // Desactiva el botón si no hay ID
                        >
                            Ver información de plan
                        </button>
                    </li>
                ))}
            </ul>
            {showModal && selectedPlan && (
                <div className="popup-overlay" onClick={handleCloseModal}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Información del Plan</h2>
                        <h3>Nombre: {selectedPlan.name}</h3> {/* Se actualiza para usar el campo `name` */}
                        <p>ID del Plan: {selectedPlan._id}</p>
                        <p>Fecha Inicio: {new Date(selectedPlan.startDate).toLocaleDateString()}</p> {/* Se usa `startDate` */}
                        {selectedPlan.endDate && <p>Fecha Fin: {new Date(selectedPlan.endDate).toLocaleDateString()}</p>} {/* Se usa `endDate` */}
                        <p>Frecuencia: {selectedPlan.frequency}</p>
                        <p>Duración : {selectedPlan.contractDuration} mes(es)</p>
                        <p>Tarifa: {selectedPlan.rate} €/mes</p>
                        <p>Día de Pago: {selectedPlan.paymentDay}</p>
                        <p>Estado: {selectedPlan.status}</p>
                        <p>Sesiones por Semana: {selectedPlan.sessionsPerWeek}</p>
                        <p>Sesiones Totales: {selectedPlan.totalSessions}</p>
                        <p>Sesiones Completadas: {selectedPlan.completedSessions}</p>
                        <button onClick={handleCloseModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planes;
