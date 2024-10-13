// src/components/AgregarNotaModal.js

import React, { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AgregarNotaModal.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const AgregarNotaModal = ({ open, onClose, cliente, onNotaAgregada }) => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');

    const handleAgregarNota = async () => {
        if (contenido.trim() === '') {
            toast.error('El contenido de la nota no puede estar vacío.');
            return;
        }

        const nuevaNota = {
            titulo,
            contenido,
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/api/clientes/${cliente._id}/notas`, nuevaNota);
            toast.success('Nota agregada correctamente.');
            onNotaAgregada(response.data); // Notifica al componente padre que la nota ha sido agregada
            onClose(); // Cierra el modal
        } catch (error) {
            toast.error('Error al agregar la nota.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="agregar-nota-modal-content">
                <h2 className="agregar-nota-modal-title">Agregar Nota</h2>
                <TextField
                    label="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    fullWidth
                    margin="normal"
                    className="agregar-nota-modal-textfield"
                />
                <TextField
                    label="Contenido"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    className="agregar-nota-modal-textfield"
                />
                <div className="agregar-nota-modal-actions">
                    <Button onClick={onClose} color="secondary">Cancelar</Button>
                    <Button onClick={handleAgregarNota} color="primary">Agregar Nota</Button>
                </div>
            </div>
        </Modal>
    );
};

export default AgregarNotaModal;
