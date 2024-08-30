import React, { useState } from 'react';
import './AsesoriaIndividualPopup.css';

const PopupCrearDieta = ({ isOpen, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [duracionSemanas, setDuracionSemanas] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [restricciones, setRestricciones] = useState('');

    const handleGuardar = () => {
        const dieta = {
            nombre,
            fechaInicio,
            duracionSemanas,
            objetivo,
            restricciones
        };
        console.log('Dieta creada:', dieta);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="AsesoriaIndividualpopup-overlay">
            <div className="AsesoriaIndividualpopup-dialog">
                <button className="AsesoriaIndividualpopup-close" onClick={onClose}>&times;</button>
                <div className="AsesoriaIndividualpopup-header">Crear Dieta</div>
                <div className="AsesoriaIndividualpopup-content">
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Nombre de la Dieta" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        className="AsesoriaIndividualpopup-input" 
                        value={fechaInicio} 
                        onChange={(e) => setFechaInicio(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Duración en Semanas" 
                        value={duracionSemanas} 
                        onChange={(e) => setDuracionSemanas(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Objetivo" 
                        value={objetivo} 
                        onChange={(e) => setObjetivo(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Restricciones (opcional)" 
                        value={restricciones} 
                        onChange={(e) => setRestricciones(e.target.value)} 
                    />
                    <button className="AsesoriaIndividualpopup-button" onClick={handleGuardar}>Guardar Dieta</button>
                </div>
            </div>
        </div>
    );
};

export default PopupCrearDieta;
