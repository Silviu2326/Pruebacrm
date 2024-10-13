import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Rutinas.css';
import PopupDeCreacionDePlanificacion from '../../Rutinas/PopupDeCreacionDePlanificacion'; // Ajusta la ruta según corresponda

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const Rutinas = ({ cliente, actualizarCliente, onPreviewRutina }) => {
    const [showModal, setShowModal] = useState(false);
    const [rutinas, setRutinas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRutinas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/clientes/${cliente._id}/rutinas`);
                setRutinas(response.data);
            } catch (error) {
                console.error('Error fetching rutinas:', error);
            }
        };

        if (cliente && cliente._id) {
            fetchRutinas();
        }
    }, [cliente._id]);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveRutina = (rutina) => {
        const nuevasRutinas = [...rutinas, rutina];
        setRutinas(nuevasRutinas);
        actualizarCliente({ ...cliente, planEntrenamiento: nuevasRutinas });
    };

    const handleEditRoutine = (routineId) => {
        navigate(`/edit-routine/${routineId}`);
    };

    const handlePreviewRutina = async (rutinaId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/routines/${rutinaId}`);
            onPreviewRutina(response.data); // Pasar la rutina seleccionada al componente padre
        } catch (error) {
            console.error('Error fetching routine details:', error);
        }
    };

    return (
        <div className="rutinas-section">
            <div className="rutinas-header">
                <h3>Rutinas</h3>
                <button onClick={handleShowModal} className="rutinas-notas-button">+</button>
            </div>
            <ul>
                {rutinas.map((rutina, index) => (
                    <li key={index}>
                        {rutina.nombre}
                        <button
                            className="rutinas-editar-button"
                            onClick={() => handleEditRoutine(rutina._id)}
                        >
                            Editar
                        </button>
                        <button
                            className="rutinas-previsualizar-button"
                            onClick={() => handlePreviewRutina(rutina._id)}
                        >
                            Previsualizar Rutina
                        </button>
                    </li>
                ))}
            </ul>
            {showModal && (
                <PopupDeCreacionDePlanificacion
                    show={showModal}
                    onClose={handleCloseModal}
                    predefinedMetas={['Meta 1', 'Meta 2', 'Meta 3']} // Actualiza según sea necesario
                />
            )}
        </div>
    );
};

export default Rutinas;
