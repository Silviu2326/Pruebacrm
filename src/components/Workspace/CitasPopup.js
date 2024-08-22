import React from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import './CitasPopup.css';

const CitasPopup = ({ citas, onClose, onDelete, onEdit }) => {
    return (
        <div className="citas-popup-container">
            <h2>Lista de Citas</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Actividad</TableCell>
                        <TableCell>Sesiones</TableCell>
                        <TableCell>Precio por Hora (€)</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {citas.length > 0 ? citas.map(cita => (
                        <TableRow key={cita._id}>
                            <TableCell>{cita.nombre}</TableCell>
                            <TableCell>{cita.actividad}</TableCell>
                            <TableCell>{cita.sesiones}</TableCell>
                            <TableCell>{cita.precioHora}</TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => onEdit(cita)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={() => onDelete(cita._id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5}>No hay citas disponibles.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button onClick={onClose} className="citas-popup-close">
                Cerrar
            </Button>
        </div>
    );
};

export default CitasPopup; // Asegúrate de estar exportando por defecto
