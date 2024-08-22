import React, { useState } from 'react';
import { Select, MenuItem, Typography, Button, DialogActions } from '@mui/material';
import Suscripcion from './Suscripcion';
import AsesoriaIndividual from './AsesoriaIndividual';
import ClasesGrupales from './ClasesGrupales';
import Citas from './Citas';  // Importar el componente Citas
import './ServiciosPopup.css';

const ServiciosPopup = ({ onClose }) => {
    const [selectedService, setSelectedService] = useState('');

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    const renderServiceComponent = () => {
        switch (selectedService) {
            case 'suscripcion':
                return <Suscripcion />;
            case 'asesoria_individual':
                return <AsesoriaIndividual />;
            case 'clases_grupales':
                return <ClasesGrupales />;
            case 'citas':  // Caso para renderizar el componente Citas
                return <Citas />;
            default:
                return null;
        }
    };

    return (
        <div className="servicios-popup">
            <Typography variant="h6" className="servicios-popup-title">
                Elegir Servicio
            </Typography>
            <Select
                value={selectedService}
                onChange={handleServiceChange}
                fullWidth
                displayEmpty
                className="servicios-popup-select"
            >
                <MenuItem value="" disabled>
                    Selecciona un servicio
                </MenuItem>
                <MenuItem value="suscripcion">Subscripción</MenuItem>
                <MenuItem value="asesoria_individual">Asesoría Individual</MenuItem>
                <MenuItem value="clases_grupales">Clases Grupales</MenuItem>
                <MenuItem value="citas">Citas</MenuItem>  {/* Nueva opción para Citas */}
            </Select>

            {renderServiceComponent()}

            <DialogActions className="servicios-popup-actions">
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
