import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent } from '@mui/material';
import GroupClassesPopup from './GroupClassesPopup.tsx';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const GroupClassesLista = ({ theme }) => {
    const [groupClasses, setGroupClasses] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchGroupClasses();
    }, []);

    const fetchGroupClasses = () => {
        axios.get(`${API_BASE_URL}/api/groupClasses/group-classes`)
            .then(response => setGroupClasses(response.data))
            .catch(error => console.error('Error al cargar las clases grupales:', error));
    };

    const handleOpenPopup = (service) => {
        setSelectedService(service);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedService(null);
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <table className={`servicioslista-tabla-servicios ${theme}`}>
                <thead className={`${theme}`}>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {groupClasses.map(service => (
                        <tr key={service._id} className={`${theme}`}>
                            <td>{service.name}</td>
                            <td>{service.description}</td>
                            <td>{service.subtipo && service.subtipo.length > 0 ? service.subtipo[0].price : 'N/A'}</td>
                            <td>{service.type}</td>
                            <td>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={`${theme}`}
                                    onClick={() => handleOpenPopup(service)}
                                >
                                    Ver Detalles
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog
                open={isPopupOpen}
                onClose={handleClosePopup}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    style: {
                        minHeight: '80vh',
                        minWidth: '80vw',
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    },
                }}
            >
                <DialogContent className={`${theme}`}>
                    <GroupClassesPopup service={selectedService} onClose={handleClosePopup} theme={theme} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GroupClassesLista;
