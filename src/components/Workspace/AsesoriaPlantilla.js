import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AsesoriaIndividual.css';

const AsesoriaPlantilla = ({ initialData, onCreate }) => {
    const [tipoCreacion, setTipoCreacion] = useState('asesoria');
    const [nombreAsesoria, setNombreAsesoria] = useState(initialData?.name || '');
    const [descripcion, setDescripcion] = useState(initialData?.description || '');
    const [objetivos, setObjetivos] = useState(initialData?.objectives || '');
    const [definido, setDefinido] = useState(initialData?.definedDuration ?? true);
    const [duracion, setDuracion] = useState(initialData?.duration || '');
    const [frecuenciaCobro, setFrecuenciaCobro] = useState(initialData?.frequency || 'mensual');
    const [diaInicio, setDiaInicio] = useState(initialData?.startDate ? new Date(initialData.startDate) : new Date());
    const [fechasPago, setFechasPago] = useState(initialData?.paymentDates ? initialData.paymentDates.map(date => new Date(date)) : []);
    const [subtipos, setSubtipos] = useState(
        initialData?.subtipo?.map((subtipo, index) => ({
            id: index + 1,
            nombre: subtipo.name,
            servicio: subtipo.service,
            planificacion: subtipo.planning || '',
            precio: subtipo.price,
            tipoPlanPago: subtipo.paymentType
        })) || [
            { id: 1, nombre: '', servicio: '', planificacion: '', precio: '', tipoPlanPago: 'fijo' }
        ]
    );
    const [selectedClient, setSelectedClient] = useState(initialData?.client || '');
    const [clients, setClients] = useState([]); // List to store clients

    useEffect(() => {
        // Fetch all clients available when the component mounts
        axios.get('http://localhost:5005/api/clientes')
            .then(response => setClients(response.data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const serviciosPrueba = [
        { id: 'planificacion', nombre: 'Planificación Deportiva' },
        { id: 'dieta', nombre: 'Dieta' },
        { id: 'cita', nombre: 'Cita Presencial' }
    ];

    const handleAddSubtipo = () => {
        const newSubtipo = {
            id: Date.now(),
            nombre: '',
            servicio: '',
            planificacion: '',
            precio: '',
            tipoPlanPago: 'fijo'
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

    const handleTipoPlanPagoChange = (id, tipo) => {
        setSubtipos(subtipos.map(subtipo =>
            subtipo.id === id ? { ...subtipo, tipoPlanPago: tipo } : subtipo
        ));
    };

    const handleClientSelection = (e) => {
        setSelectedClient(e.target.value);
    };

    const calcularFechasPago = () => {
        const fechas = [];
        const inicio = new Date(diaInicio);
        const duracionMeses = definido ? parseInt(duracion, 10) : 12; 
        let frecuenciaEnDias;

        switch(frecuenciaCobro) {
            case 'semanal':
                frecuenciaEnDias = 7;
                break;
            case 'mensual':
                frecuenciaEnDias = 30;
                break;
            case '3_meses':
                frecuenciaEnDias = 90;
                break;
            case '6_meses':
                frecuenciaEnDias = 180;
                break;
            case 'anual':
                frecuenciaEnDias = 365;
                break;
            default:
                frecuenciaEnDias = 30;
        }

        for (let i = 0; i < duracionMeses; i++) {
            fechas.push(new Date(inicio.getTime() + (frecuenciaEnDias * i * 24 * 60 * 60 * 1000)));
        }

        setFechasPago(fechas);
    };

    const modificarFechaPago = (index, nuevaFecha) => {
        const nuevasFechas = [...fechasPago];
        nuevasFechas[index] = new Date(nuevaFecha);
        setFechasPago(nuevasFechas);
    };

    useEffect(() => {
        calcularFechasPago();
    }, [duracion, frecuenciaCobro, diaInicio, definido]);

    const handleCreateAsesoria = async () => {
        const newAsesoria = {
            type: tipoCreacion,
            name: nombreAsesoria,
            description: descripcion,
            objectives: objetivos,
            definedDuration: definido,
            duration: definido ? duracion : undefined,
            frequency: frecuenciaCobro,
            startDate: diaInicio,
            subtipo: subtipos.map(subtipo => ({
                name: subtipo.nombre,
                service: subtipo.servicio,
                planning: subtipo.planificacion,
                price: subtipo.precio,
                paymentType: subtipo.tipoPlanPago
            })),
            client: selectedClient || undefined, 
            paymentDates: fechasPago
        };

        try {
            const response = await axios.post('http://localhost:5005/api/individualConsultations', newAsesoria);
            console.log('Asesoría creada exitosamente:', response.data);
            if (onCreate) {
                onCreate(response.data);
            }
        } catch (error) {
            console.error('Error creando la asesoría:', error);
        }
    };

    return (
        <div className="AsesoriaIndividual-container">
            <h1>Crear Asesoría Basada en Plantilla</h1>
            
            <div className="AsesoriaIndividual-field">
                <label>Nombre de la Asesoría</label>
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
                <label>Objetivos Específicos</label>
                <textarea
                    value={objetivos}
                    onChange={(e) => setObjetivos(e.target.value)}
                    placeholder="Define los objetivos específicos de esta asesoría"
                    rows="3"
                />
            </div>

            <div className="AsesoriaIndividual-botones-definido-indefinido">
                <button
                    className={definido ? "AsesoriaIndividual-active" : ""}
                    onClick={() => setDefinido(true)}
                >
                    Definido
                </button>
                <button
                    className={!definido ? "AsesoriaIndividual-active" : ""}
                    onClick={() => setDefinido(false)}
                >
                    Indefinido
                </button>
            </div>

            {definido && (
                <div className="AsesoriaIndividual-field">
                    <label>Duración (en meses)</label>
                    <input
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        placeholder="Duración en meses"
                    />
                </div>
            )}

            <div className="AsesoriaIndividual-field">
                <label>Frecuencia de Cobro</label>
                <select value={frecuenciaCobro} onChange={(e) => setFrecuenciaCobro(e.target.value)}>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="3_meses">Cada 3 meses</option>
                    <option value="6_meses">Cada 6 meses</option>
                    <option value="anual">Anual</option>
                </select>
            </div>

            <div className="AsesoriaIndividual-field">
                <label>Día de Inicio</label>
                <input
                    type="date"
                    value={diaInicio.toISOString().split('T')[0]}
                    onChange={(e) => setDiaInicio(new Date(e.target.value))}
                />
            </div>

            <div className="AsesoriaIndividual-field">
                <label>Cliente</label>
                <select
                    value={selectedClient}
                    onChange={handleClientSelection}
                >
                    <option value="" disabled>Selecciona un cliente</option>
                    {clients.map(client => (
                        <option key={client._id} value={client._id}>
                            {client.nombre} {client.apellido}
                        </option>
                    ))}
                </select>
            </div>

            <h2>Tipo de Plan de Pago</h2>

            {subtipos.map((subtipo, index) => (
                <React.Fragment key={subtipo.id}>
                    {index > 0 && <div className="AsesoriaIndividual-subtipo-separator"></div>}
                    
                    <div className="AsesoriaIndividual-tipo-plan-pago-buttons AsesoriaIndividual-subtipo-buttons">
                        <button
                            className={subtipo.tipoPlanPago === 'fijo' ? "AsesoriaIndividual-active" : ""}
                            onClick={() => handleTipoPlanPagoChange(subtipo.id, 'fijo')}
                        >
                            Fijo
                        </button>
                        <button
                            className={subtipo.tipoPlanPago === 'variable' ? "AsesoriaIndividual-active" : ""}
                            onClick={() => handleTipoPlanPagoChange(subtipo.id, 'variable')}
                        >
                            Variable
                        </button>
                    </div>

                    <div className="AsesoriaIndividual-subtipo-container">
                        <div className="AsesoriaIndividual-subtipo-first-row">
                            <div className="AsesoriaIndividual-field">
                                <label>Nombre del Servicio</label>
                                <input
                                    type="text"
                                    value={subtipo.nombre}
                                    onChange={(e) => handleSubtipoChange(subtipo.id, 'nombre', e.target.value)}
                                    placeholder="Nombre del servicio"
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

                        <div className="AsesoriaIndividual-subtipo-second-row">
                            {subtipo.tipoPlanPago === 'variable' ? (
                                <>
                                    <div className="AsesoriaIndividual-field">
                                        <label>Planificación</label>
                                        <select
                                            value={subtipo.planificacion}
                                            onChange={(e) => handleSubtipoChange(subtipo.id, 'planificacion', e.target.value)}
                                        >
                                            <option value="" disabled>Planificación</option>
                                            <option value="hora">Precio por hora</option>
                                            <option value="sesion">Precio por sesión</option>
                                        </select>
                                    </div>
                                    <div className="AsesoriaIndividual-field">
                                        <label>Precio por {subtipo.planificacion}</label>
                                        <input
                                            type="number"
                                            value={subtipo.precio}
                                            onChange={(e) => handleSubtipoChange(subtipo.id, 'precio', e.target.value)}
                                            placeholder={`Precio por ${subtipo.planificacion}`}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="AsesoriaIndividual-field">
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        value={subtipo.precio}
                                        onChange={(e) => handleSubtipoChange(subtipo.id, 'precio', e.target.value)}
                                        placeholder="Precio"
                                    />
                                </div>
                            )}
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

            <div className="AsesoriaIndividual-informacion-precios-planes">
                <h2>Resumen</h2>
                <div>
                    <p><strong>Nombre:</strong> {nombreAsesoria}</p>
                    <p><strong>Descripción:</strong> {descripcion}</p>
                    <p><strong>Objetivos:</strong> {objetivos}</p>
                    <p><strong>Definido/Indefinido:</strong> {definido ? 'Definido' : 'Indefinido'}</p>
                    {definido && <p><strong>Duración:</strong> {duracion} meses</p>}
                    <p><strong>Frecuencia de Cobro:</strong> {frecuenciaCobro}</p>
                    {subtipos.map((subtipo, index) => (
                        <div key={subtipo.id}>
                            <p><strong>Subtipo {index + 1}:</strong> {subtipo.nombre}</p>
                            <p><strong>Servicio:</strong> {subtipo.servicio}</p>
                            <p><strong>Tipo de Plan de Pago:</strong> {subtipo.tipoPlanPago}</p>
                            {subtipo.planificacion && <p><strong>Planificación:</strong> {subtipo.planificacion}</p>}
                            <p><strong>Precio:</strong> {subtipo.precio}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="AsesoriaIndividual-pagos">
                <h2>Pagos</h2>
                {fechasPago.map((fecha, index) => (
                    <div key={index} className="AsesoriaIndividual-pago-item">
                        <p><strong>Pago {index + 1}:</strong> {fecha.toLocaleDateString()} - $50</p>
                        <input 
                            type="date" 
                            value={fecha.toISOString().split('T')[0]} 
                            onChange={(e) => modificarFechaPago(index, e.target.value)} 
                        />
                    </div>
                ))}
            </div>

            <div className="AsesoriaIndividual-crear-button-container">
                <button onClick={handleCreateAsesoria} className="AsesoriaIndividual-crear-button">
                    Crear Asesoría
                </button>
            </div>
        </div>
    );
};

export default AsesoriaPlantilla;
