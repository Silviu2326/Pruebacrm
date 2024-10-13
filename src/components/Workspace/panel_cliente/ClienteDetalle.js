import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CondicionFisica from './CondicionFisica';
import Notas from './Notas';
import Finanzas from './Finanzas';
import PerfilCliente from './PerfilCliente';
import Rutinas from './Rutinas';
import Dietas from './Dietas';
import Planes from './Planes';
import Calendario from './Calendario';
import Historialderegistrodeprogreso from './Historialderegistrodeprogreso';
import Chequins from './Chequins';
import './ClienteDetalle.css';
import PopupDeCreacionDePlanificacion from '../../Rutinas/PopupDeCreacionDePlanificacion'; // Ajusta la ruta según corresponda

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const ClienteDetalle = ({ cliente, theme }) => {
    const [clienteDetalle, setClienteDetalle] = useState(cliente);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaNota, setNuevaNota] = useState('');
    const [nuevoTitulo, setNuevoTitulo] = useState('');
    const [mostrarRutinaModal, setMostrarRutinaModal] = useState(false);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

    useEffect(() => {
        const fetchClienteDetalle = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/clientes/${cliente._id}`);
                console.log('Datos del cliente recibidos desde la API:', response.data); // Añadido console.log
                setClienteDetalle(response.data);
            } catch (error) {
                console.error('Error fetching cliente details:', error);
            }
        };

        if (cliente && cliente._id) {
            fetchClienteDetalle();
        }
    }, [cliente]);

    const actualizarCliente = async (nuevoCliente) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/clientes/${clienteDetalle._id}`, nuevoCliente);
            setClienteDetalle(response.data);
        } catch (error) {
            console.error('Error actualizando cliente:', error);
        }
    };

    const abrirModal = () => {
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const handleNotaChange = (e) => {
        setNuevaNota(e.target.value);
    };

    const handleTituloChange = (e) => {
        setNuevoTitulo(e.target.value);
    };

    const handleAñadirNota = async () => {
        try {
            const nuevaNotaObj = {
                titulo: nuevoTitulo || '',
                contenido: nuevaNota
            };
            const response = await axios.post(`${API_BASE_URL}/api/clientes/${clienteDetalle._id}/notas`, { nota: nuevaNotaObj });
            actualizarCliente(response.data);
            setNuevaNota('');
            setNuevoTitulo('');
            cerrarModal();
        } catch (error) {
            console.error('Error añadiendo nota:', error);
        }
    };

    const handlePreviewRutina = (rutina) => {
        setRutinaSeleccionada(rutina);
        setMostrarRutinaModal(true);
    };

    const handleCerrarRutinaModal = () => {
        setMostrarRutinaModal(false);
        setRutinaSeleccionada(null);
    };

    return (
        <div className={`client-detail-container ${theme}`}>
            {clienteDetalle ? (
                <div className="client-detail-grid">
                    <CondicionFisica cliente={clienteDetalle} actualizarCliente={actualizarCliente} theme={theme} />
                    <Notas cliente={clienteDetalle} actualizarCliente={actualizarCliente} abrirModal={abrirModal} theme={theme} />
                    <Finanzas cliente={clienteDetalle} actualizarCliente={actualizarCliente} theme={theme} />
                    <PerfilCliente cliente={clienteDetalle} actualizarCliente={actualizarCliente} theme={theme} />
                    <Rutinas cliente={clienteDetalle} actualizarCliente={actualizarCliente} onPreviewRutina={handlePreviewRutina} theme={theme} />
                    <Dietas cliente={clienteDetalle} theme={theme} />
                    <Planes cliente={clienteDetalle} theme={theme} />
                    <Calendario theme={theme} />
                    <Historialderegistrodeprogreso registros={[]} theme={theme} />
                    <Chequins registros={[]} theme={theme} />
                </div>
            ) : (
                <p>Cargando detalles del cliente...</p>
            )}
            {mostrarModal && (
                <div className="notas-modal">
                    <div className="notas-modal-content">
                        <span className="notas-close" onClick={cerrarModal}>&times;</span>
                        <h4>Añadir Nota</h4>
                        <input
                            type="text"
                            placeholder="Título (opcional)"
                            value={nuevoTitulo}
                            onChange={handleTituloChange}
                        />
                        <textarea
                            placeholder="Añadir nota"
                            value={nuevaNota}
                            onChange={handleNotaChange}
                        />
                        <button onClick={handleAñadirNota} className="notasButton">Añadir Nota</button>
                    </div>
                </div>
            )}
            {mostrarRutinaModal && rutinaSeleccionada && (
                <div className="rutinas-popup-overlay" onClick={handleCerrarRutinaModal}>
                    <div className="rutinas-popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCerrarRutinaModal}>&times;</span>
                        <h2>Detalles de la Rutina</h2>
                        <div className="rutina-header">
                            <h3>{rutinaSeleccionada.nombre}</h3>
                            <p><strong>Descripción:</strong> {rutinaSeleccionada.descripcion}</p>
                            <p><strong>Creador:</strong> {rutinaSeleccionada.creador}</p>
                            <p><strong>Duración:</strong> {rutinaSeleccionada.duracion} semana(s)</p>
                            <p><strong>Meta:</strong> {rutinaSeleccionada.meta}</p>
                            <p><strong>Fecha Inicio:</strong> {new Date(rutinaSeleccionada.fechaInicio).toLocaleDateString()}</p>
                        </div>
                        {rutinaSeleccionada.semanas.map((semana, semanaIdx) => (
                            <div key={semanaIdx} className="semana-section">
                                <h4>{semana.nombre}</h4>
                                {semana.dias.map((dia, diaIdx) => (
                                    <div key={diaIdx} className="dia-section">
                                        <h5>{dia.nombre}</h5>
                                        {dia.sesiones.length > 0 ? (
                                            <ul>
                                                {dia.sesiones.map((sesion, sesionIdx) => (
                                                    <li key={sesionIdx} className="sesion-item">
                                                        <strong>{sesion.nombre}</strong>
                                                        <ul>
                                                            {sesion.actividades.map((actividad, actIdx) => (
                                                                <li key={actIdx}>
                                                                    <strong>Actividad:</strong> {actividad.name} ({actividad.type})<br />
                                                                    <strong>Modo:</strong> {actividad.mode}<br />
                                                                    <strong>Intensidad:</strong> {actividad.intensity}
                                                                    <ul>
                                                                        {actividad.exercises.map((exercise, exIdx) => (
                                                                            <li key={exIdx}>
                                                                                <strong>Ejercicio:</strong> {exercise.nombre}<br />
                                                                                {exercise.sets.map((set, setIdx) => (
                                                                                    <div key={setIdx} className="set-details">
                                                                                        <strong>Set {set.set}:</strong> {set.reps} reps @ {set.percent}% | Descanso: {set.rest} segundos
                                                                                    </div>
                                                                                ))}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay sesiones programadas</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button onClick={handleCerrarRutinaModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClienteDetalle;
