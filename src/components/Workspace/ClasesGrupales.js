import React, { useState } from 'react';
import './ClasesGrupales.css';

const ClasesGrupales = ({ theme }) => {
    const [tipoCreacion, setTipoCreacion] = useState('nueva'); 
    const [claseSeleccionada, setClaseSeleccionada] = useState(''); 
    const [nombreClase, setNombreClase] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [maxParticipantes, setMaxParticipantes] = useState('');
    const [estatus, setEstatus] = useState('activa');
    const [mensaje, setMensaje] = useState('');  

    const clasesDisponibles = [
        { id: 'clase1', nombre: 'Yoga Avanzado', descripcion: 'Clases intensivas de yoga avanzado', maxParticipantes: 20 },
        { id: 'clase2', nombre: 'Pilates Básico', descripcion: 'Curso de pilates para principiantes', maxParticipantes: 15 },
        { id: 'clase3', nombre: 'Crossfit', descripcion: 'Entrenamiento de alta intensidad en grupo', maxParticipantes: 25 }
    ];

    const handleClaseSeleccionada = (e) => {
        const seleccionada = clasesDisponibles.find(clase => clase.id === e.target.value);
        if (seleccionada) {
            setClaseSeleccionada(seleccionada.id);
            setNombreClase(seleccionada.nombre);
            setDescripcion(seleccionada.descripcion);
            setMaxParticipantes(seleccionada.maxParticipantes);
        }
    };

    const handleSubmit = async () => {
        const data = {
            name: nombreClase, 
            description: descripcion, 
            maxParticipants: parseInt(maxParticipantes),
            status: estatus, 
        };
    
        try {
            const response = await fetch('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/groupClasses/group-classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                const result = await response.json();
                setMensaje('Clase creada exitosamente');
                console.log('Clase creada:', result);
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.error}`);
                console.error('Error al crear la clase:', errorData);
            }
        } catch (error) {
            setMensaje(`Error de red: ${error.message}`);
            console.error('Error de red:', error);
        }
    };
    
    return (
        <div className={`Clasegrupal-container ${theme}`}>
            <h1>{tipoCreacion === 'nueva' ? 'Crear Clase Grupal' : 'Importar Clase Grupal'}</h1>
            
            <div className={`Clasegrupal-field ${theme}`}>
                <label>Tipo de Creación</label>
                <select value={tipoCreacion} onChange={(e) => setTipoCreacion(e.target.value)}>
                    <option value="nueva">Nueva Clase Grupal</option>
                    <option value="importar">Importar Clase Grupal</option>
                </select>
            </div>

            {tipoCreacion === 'nueva' ? (
                <>
                    <div className={`Clasegrupal-field ${theme}`}>
                        <label>Nombre de la Clase</label>
                        <input
                            type="text"
                            value={nombreClase}
                            onChange={(e) => setNombreClase(e.target.value)}
                            placeholder="Ingresa el nombre de la clase"
                        />
                    </div>

                    <div className={`Clasegrupal-field ${theme}`}>
                        <label>Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ingresa una descripción de la clase"
                            rows="3"
                        />
                    </div>

                    <div className={`Clasegrupal-field ${theme}`}>
                        <label>Número Máximo de Participantes</label>
                        <input
                            type="number"
                            value={maxParticipantes}
                            onChange={(e) => setMaxParticipantes(e.target.value)}
                            placeholder="Máximo número de participantes"
                        />
                    </div>

                    <div className={`Clasegrupal-field ${theme}`}>
                        <label>Estatus</label>
                        <select value={estatus} onChange={(e) => setEstatus(e.target.value)}>
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>
                </>
            ) : (
                <div className={`Clasegrupal-field ${theme}`}>
                    <label>Seleccionar Clase para Importar</label>
                    <select value={claseSeleccionada} onChange={handleClaseSeleccionada}>
                        <option value="" disabled>Selecciona una clase</option>
                        {clasesDisponibles.map((clase) => (
                            <option key={clase.id} value={clase.id}>
                                {clase.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={`Clasegrupal-crear-button-container ${theme}`}>
                <button className={`Clasegrupal-crear-button ${theme}`} onClick={handleSubmit}>
                    {tipoCreacion === 'nueva' ? 'Crear Clase Grupal' : 'Importar Clase'}
                </button>
            </div>

            {mensaje && <p className={`Clasegrupal-mensaje ${theme}`}>{mensaje}</p>}
        </div>
    );
};

export default ClasesGrupales;
