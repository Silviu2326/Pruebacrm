// src/components/PaymentPlansAsesoriapopupdetallesclientes.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const PaymentPlansAsesoriapopupdetallesclientes = ({ client, onClose }) => {
    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalles del Cliente</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Nombre</Typography>
                <Typography>{client.client.nombre} {client.client.apellido}</Typography>
                
                <Typography variant="h6">Email</Typography>
                <Typography>{client.client.email}</Typography>
                
                <Typography variant="h6">Estado</Typography>
                <Typography>{client.status}</Typography>
                
                <Typography variant="h6">Teléfono</Typography>
                <Typography>{client.client.telefono}</Typography>
                
                <Typography variant="h6">Ciudad</Typography>
                <Typography>{client.client.city}</Typography>
                
                <Typography variant="h6">País</Typography>
                <Typography>{client.client.country}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentPlansAsesoriapopupdetallesclientes;
