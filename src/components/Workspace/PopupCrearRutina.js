import React, { useState } from 'react';
import './AsesoriaIndividualPopup.css';

const PopupCrearRutina = ({ isOpen, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [creador, setCreador] = useState('');
    const [duracion, setDuracion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [meta, setMeta] = useState('');

    const handleGuardar = () => {
        const rutina = {
            nombre,
            descripcion,
            creador,
            duracion,
            fechaInicio,
            meta
        };
        console.log('Rutina creada:', rutina);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="AsesoriaIndividualpopup-overlay">
            <div className="AsesoriaIndividualpopup-dialog">
                <button className="AsesoriaIndividualpopup-close" onClick={onClose}>&times;</button>
                <div className="AsesoriaIndividualpopup-header">Crear Rutina</div>
                <div className="AsesoriaIndividualpopup-content">
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Nombre de la Rutina" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                    <textarea 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Descripción" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Creador" 
                        value={creador} 
                        onChange={(e) => setCreador(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Duración" 
                        value={duracion} 
                        onChange={(e) => setDuracion(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        className="AsesoriaIndividualpopup-input" 
                        value={fechaInicio} 
                        onChange={(e) => setFechaInicio(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="AsesoriaIndividualpopup-input" 
                        placeholder="Meta" 
                        value={meta} 
                        onChange={(e) => setMeta(e.target.value)} 
                    />
                    <button className="AsesoriaIndividualpopup-button" onClick={handleGuardar}>Guardar Rutina</button>
                </div>
            </div>
        </div>
    );
};

export default PopupCrearRutina;
