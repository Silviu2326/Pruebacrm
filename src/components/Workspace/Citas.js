import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import './Citas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Citas = ({ onSave }) => {
    const [actividad, setActividad] = useState('');
    const [nombreCita, setNombreCita] = useState('');
    const [numeroSesiones, setNumeroSesiones] = useState(1);
    const [importeTotal, setImporteTotal] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGuardarCita = () => {
        if (!actividad || !nombreCita || !numeroSesiones || !importeTotal) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const nuevaCita = {
            actividad,
            nombre: nombreCita,
            sesiones: numeroSesiones,
            precioHora: importeTotal,
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
        setImporteTotal('');
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
                <label>Precio por Hora (€)</label>
                <TextField
                    value={importeTotal}
                    onChange={(e) => setImporteTotal(e.target.value)}
                    fullWidth
                    margin="normal"
                    type="number"
                    variant="outlined"
                    disabled={loading}
                />
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
