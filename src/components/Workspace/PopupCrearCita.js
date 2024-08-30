import React, { useState } from 'react';
import './AsesoriaIndividualPopup.css';

const PopupCrearCita = ({ isOpen, onClose }) => {
    const [actividad, setActividad] = useState('');
    const [nombre, setNombre] = useState('');
    const [sesiones, setSesiones] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [fechaDeCaducidad, setFechaDeCaducidad] = useState('');

    const handleGuardar = () => {
        const cita = {
            actividad,
            nombre,
            sesiones,
            frecuencia,
            fechaDeCaducidad
        };
        console.log('Cita creada:', cita);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="AsesoriaIndividualpopup-overlay">
            <div className="AsesoriaIndividualpopup-dialog">
                <button className="AsesoriaIndividualpopup-close" onClick={onClose}>&times;</button>
                <div className="AsesoriaIndividualpopup-header">Crear Cita</div>
                <div className="AsesoriaIndividualpopup-content">
                    <select 
                        className="AsesoriaIndividualpopup-select" 
                        value={actividad} 
                        onChange={(e) => setActividad(e.target.value)}
                    >
                        <option value="" disabled>Seleccionar Actividad</option>
                        <option value="Entrenamiento Personal">Entrenamiento Personal</option>
                        <option value="Entrenamiento uno a uno">Entrenamiento uno a uno</option>
                    </select>
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Sesiones" 
                        value={sesiones} 
                        onChange={(e) => setSesiones(e.target.value)} 
                    />
                    <select 
                        className="AsesoriaIndividualpopup-select" 
                        value={frecuencia} 
                        onChange={(e) => setFrecuencia(e.target.value)}
                    >
                        <option value="" disabled>Seleccionar Frecuencia</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                        <option value="3_meses">Cada 3 meses</option>
                        <option value="6_meses">Cada 6 meses</option>
                        <option value="anual">Anual</option>
                    </select>
                    <input 
                        type="date" 
                        className="AsesoriaIndividualpopup-input" 
                        value={fechaDeCaducidad} 
                        onChange={(e) => setFechaDeCaducidad(e.target.value)} 
                    />
                    <button className="AsesoriaIndividualpopup-button" onClick={handleGuardar}>Guardar Cita</button>
                </div>
            </div>
        </div>
    );
};

export default PopupCrearCita;
