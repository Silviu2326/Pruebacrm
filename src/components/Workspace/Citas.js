import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import './Citas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Citas = ({ onSave }) => {
    const [actividad, setActividad] = useState('');
    const [nombreCita, setNombreCita] = useState('');
    const [numeroSesiones, setNumeroSesiones] = useState(1);
    const [frecuencia, setFrecuencia] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGuardarCita = () => {
        if (!actividad || !nombreCita || !numeroSesiones || !frecuencia) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const nuevaCita = {
            actividad,
            nombre: nombreCita,
            sesiones: numeroSesiones,
            frecuencia,
        };

        setLoading(true);
        setError(null);

        axios.post(`${API_BASE_URL}/api/citas`, nuevaCita)
            .then(response => {
                console.log('Cita guardada:', response.data);
                if (onSave) {
                    onSave(response.data);
                }
                handleCancelar();
            })
            .catch(error => {
                setError('Error al guardar la cita. Por favor, intenta nuevamente.');
                console.error('Error al guardar la cita:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCancelar = () => {
        setActividad('');
        setNombreCita('');
        setNumeroSesiones(1);
        setFrecuencia('');
        setError(null);
    };

    return (
        <Box className="suscripcionesservicios-container">
            <Typography variant="h5" className="citas-title">
                Crear Nueva Cita
            </Typography>

            {error && (
                <Typography color="error" variant="body2" className="citas-error">
                    {error}
                </Typography>
            )}

            <div className="suscripcionesservicios-field">
                <label>Elegir Actividad</label>
                <Select
                    value={actividad}
                    onChange={(e) => setActividad(e.target.value)}
                    fullWidth
                    variant="outlined"
                    disabled={loading}
                >
                    <MenuItem value="">Seleccionar actividad</MenuItem>
                    <MenuItem value="entrenamiento_personal">Entrenamiento Personal</MenuItem>
                    <MenuItem value="entrenamiento_uno_a_uno">Entrenamiento Uno a Uno</MenuItem>
                    {/* Agregar más actividades guardadas aquí */}
                </Select>
            </div>

            <div className="suscripcionesservicios-field">
                <label>Nombre de la Cita</label>
                <TextField
                    value={nombreCita}
                    onChange={(e) => setNombreCita(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled={loading}
                />
            </div>

            <div className="suscripcionesservicios-field">
                <label>Número de Sesiones</label>
                <TextField
                    value={numeroSesiones}
                    onChange={(e) => setNumeroSesiones(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                    variant="outlined"
                    disabled={loading}
                />
            </div>

            <div className="suscripcionesservicios-field">
                <label>Frecuencia</label>
                <Select
                    value={frecuencia}
                    onChange={(e) => setFrecuencia(e.target.value)}
                    fullWidth
                    variant="outlined"
                    disabled={loading}
                >
                    <MenuItem value="">Seleccionar frecuencia</MenuItem>
                    <MenuItem value="semanal">Semanal</MenuItem>
                    <MenuItem value="mensual">Mensual</MenuItem>
                    <MenuItem value="3_meses">Cada 3 meses</MenuItem>
                    <MenuItem value="6_meses">Cada 6 meses</MenuItem>
                    <MenuItem value="anual">Anual</MenuItem>
                </Select>
            </div>

            <div className="suscripcionesservicios-field">
                <label>Fecha de Caducidad</label>
                <Select
                    value={frecuencia} // Usa la frecuencia para calcular la caducidad
                    onChange={(e) => setFrecuencia(e.target.value)} // Cambia la frecuencia y, por lo tanto, la caducidad
                    fullWidth
                    variant="outlined"
                    disabled={loading}
                >
                    <MenuItem value="semanal">Caduca en 1 semana</MenuItem>
                    <MenuItem value="mensual">Caduca en 1 mes</MenuItem>
                    <MenuItem value="3_meses">Caduca en 3 meses</MenuItem>
                    <MenuItem value="6_meses">Caduca en 6 meses</MenuItem>
                    <MenuItem value="anual">Caduca en 1 año</MenuItem>
                </Select>
            </div>

            <Button
                onClick={handleGuardarCita}
                className="suscripcionesservicios-button save"
                disabled={loading}
            >
                {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
                onClick={handleCancelar}
                className="suscripcionesservicios-button cancel"
                disabled={loading}
            >
                Cancelar
            </Button>
        </Box>
    );
};

export default Citas;
