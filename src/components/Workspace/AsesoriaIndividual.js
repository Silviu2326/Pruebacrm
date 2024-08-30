import React, { useState } from 'react';
import axios from 'axios';
import './AsesoriaIndividual.css';

const AsesoriaIndividual = ({ initialData }) => {
    const [nombreAsesoria, setNombreAsesoria] = useState(initialData?.name || '');
    const [descripcion, setDescripcion] = useState(initialData?.description || '');
    const [objetivos, setObjetivos] = useState(initialData?.objectives || '');
    const [durationUnit, setDurationUnit] = useState(initialData?.durationUnit || 'weeks');
    const [durationValue, setDurationValue] = useState(initialData?.durationValue || 1);
    const [subtipos, setSubtipos] = useState(
        initialData?.subtipo?.map((subtipo, index) => ({
            id: index + 1,
            nombre: subtipo.name,
            servicio: subtipo.service
        })) || [
            { id: 1, nombre: '', servicio: '' }
        ]
    );

    const serviciosPrueba = [
        { id: 'planificacion', nombre: 'Planificación Deportiva' },
        { id: 'dieta', nombre: 'Dieta' },
        { id: 'cita', nombre: 'Cita Presencial' }
    ];

    const handleAddSubtipo = () => {
        const newSubtipo = {
            id: Date.now(),
            nombre: '',
            servicio: ''
        };
        setSubtipos([...subtipos, newSubtipo]);
    };

    const handleRemoveSubtipo = (id) => {
        setSubtipos(subtipos.filter(subtipo => subtipo.id !== id));
    };

    const handleSubtipoChange = (id, field, value) => {
        setSubtipos(subtipos.map(subtipo =>
            subtipo.id === id ? { ...subtipo, [field]: value } : subtipo
        ));
    };

    const handleCreateAsesoria = async () => {
        const newAsesoria = {
            name: nombreAsesoria,
            description: descripcion,
            objectives: objetivos,
            durationUnit,
            durationValue,
            subtipo: subtipos.map(subtipo => ({
                name: subtipo.nombre,
                service: subtipo.servicio
            }))
        };

        try {
            const response = await axios.post('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/individualConsultations', newAsesoria);
            console.log('Asesoría creada exitosamente:', response.data);
        } catch (error) {
            console.error('Error creando la asesoría:', error);
        }
    };

    return (
        <div className="AsesoriaIndividual-container">
            <h1>Crear Asesoría Individual</h1>
            
            <div className="AsesoriaIndividual-field">
                <label>Nombre de la asesoría</label>
                <input
                    type="text"
                    value={nombreAsesoria}
                    onChange={(e) => setNombreAsesoria(e.target.value)}
                    placeholder="Ingresa el nombre de la asesoría"
                />
            </div>

            <div className="AsesoriaIndividual-field">
                <label>Descripción</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ingresa una descripción de la asesoría"
                    rows="3"
                />
            </div>

            <div className="AsesoriaIndividual-field">
                <label>Unidad de Duración</label>
                <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                >
                    <option value="weeks">Semanas</option>
                    <option value="months">Meses</option>
                </select>
            </div>

            <div className="AsesoriaIndividual-field">
                <label>Duración en {durationUnit === 'weeks' ? 'semanas' : 'meses'}</label>
                <input
                    type="number"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    placeholder={`Ingresa la duración en ${durationUnit === 'weeks' ? 'semanas' : 'meses'}`}
                    min="1"
                />
            </div>

            <h2>Subtipos de Servicio</h2>

            {subtipos.map((subtipo, index) => (
                <React.Fragment key={subtipo.id}>
                    {index > 0 && <div className="AsesoriaIndividual-subtipo-separator"></div>}
                    
                    <div className="AsesoriaIndividual-subtipo-container">
                        <div className="AsesoriaIndividual-field">
                            <label>Nombre del Subtipo</label>
                            <input
                                type="text"
                                value={subtipo.nombre}
                                onChange={(e) => handleSubtipoChange(subtipo.id, 'nombre', e.target.value)}
                                placeholder="Nombre del subtipo"
                            />
                        </div>
                        <div className="AsesoriaIndividual-field">
                            <label>Servicio</label>
                            <select
                                value={subtipo.servicio}
                                onChange={(e) => handleSubtipoChange(subtipo.id, 'servicio', e.target.value)}
                            >
                                <option value="" disabled>Selecciona un servicio</option>
                                {serviciosPrueba.map((servicio) => (
                                    <option key={servicio.id} value={servicio.nombre}>
                                        {servicio.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {index > 0 && (
                        <button onClick={() => handleRemoveSubtipo(subtipo.id)} className="AsesoriaIndividual-remove-subtipo">
                            Eliminar
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button onClick={handleAddSubtipo} className="AsesoriaIndividual-add-subtipo">
                Añadir Subtipo
            </button>

            <div className="AsesoriaIndividual-crear-button-container">
                <button onClick={handleCreateAsesoria} className="AsesoriaIndividual-crear-button">
                    Crear Asesoría
                </button>
            </div>
        </div>
    );
};

export default AsesoriaIndividual;
