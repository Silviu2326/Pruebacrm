import React, { useState } from 'react';
import { Select, MenuItem, Typography, Button, DialogActions } from '@mui/material';
import Suscripcion from './Suscripcion';
import AsesoriaIndividual from './AsesoriaIndividual';
import ClasesGrupales from './ClasesGrupales';
import Citas from './Citas';  // Importar el componente Citas
import './ServiciosPopup.css';

const ServiciosPopup = ({ onClose, theme }) => {
    const [selectedService, setSelectedService] = useState('');

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    const renderServiceComponent = () => {
        switch (selectedService) {
            case 'suscripcion':
                return <Suscripcion className={`suscripcion ${theme}`} theme={theme}/>;
            case 'asesoria_individual':
                return <AsesoriaIndividual className={`asesoria_individual ${theme}`} />;
            case 'clases_grupales':
                return <ClasesGrupales className={`clases_grupales ${theme}`} />;
            case 'citas':  // Caso para renderizar el componente Citas
                return <Citas className={`citas ${theme}`} />;
            default:
                return null;
        }
    };

    return (
        <div className={`servicios-popup ${theme}`}>
            <Typography variant="h6" className={`servicios-popup-title ${theme}`}>
                Elegir Servicio
            </Typography>
            <Select
                value={selectedService}
                onChange={handleServiceChange}
                fullWidth
                displayEmpty
                className={`servicios-popup-select ${theme}`}
                style={{
                    color: 'var(--text)',
                }}
            >
                <MenuItem value="" disabled style={{
                    color: 'var(--text)',
                }}>
                    Selecciona un servicio
                </MenuItem>
                <MenuItem value="suscripcion">Subscripción</MenuItem>
                <MenuItem value="asesoria_individual">Asesoría Individual</MenuItem>
                <MenuItem value="clases_grupales">Clases Grupales</MenuItem>
                <MenuItem value="citas">Citas</MenuItem>  {/* Nueva opción para Citas */}
            </Select>

            {renderServiceComponent()}

            <DialogActions className={`servicios-popup-actions ${theme}`}>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={() => console.log('Guardar')} color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </div>
    );
};

export default ServiciosPopup;
