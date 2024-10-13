// ServiciosLista.js

import React, { useState } from 'react';
import { MenuItem, Select, Button, TextField, Dialog } from '@mui/material';
import './ServiciosLista.css';
import CitasLista from './CitasLista';
import GroupClassesLista from './GroupClassesLista.tsx';
import SuscripcionesLista from './SuscripcionesLista';
import AsesoriasLista from './AsesoriasLista';
import ServiciosPopup from './ServiciosPopup';

const ServiciosLista = ({ theme }) => {
    const [selectedServiceType, setSelectedServiceType] = useState('groupClasses');
    const [filter, setFilter] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);  // Estado para controlar el popup

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const renderServiceList = () => {
        switch (selectedServiceType) {
            case 'groupClasses':
                return <GroupClassesLista theme={theme} filter={filter} />;
            case 'subscriptions':
                return <SuscripcionesLista theme={theme} filter={filter} />;
            case 'consultations':
                return <AsesoriasLista theme={theme} filter={filter} />;
            case 'citas':
                return <CitasLista theme={theme} filter={filter} />;
            default:
                return null;
        }
    };

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <h2>Gestión de Servicios</h2>
            <div className="servicioslista-botones-acciones">
                <Button variant="contained" color="secondary" onClick={handleOpenPopup}
                style={{
                    background:'var(--create-button-bg)', 
                    color:  'var(--button-text-dark)' ,
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background 0.3s ease',
                  }}
                >
                    Crear Servicio
                </Button>
            </div>
    
            <div className="servicioslista-tablas-contenedor">
                <div className="servicioslista-filtro-busqueda">
                    <TextField
                        label="Buscar Servicios"
                        variant="outlined"
                        value={filter}
                        onChange={handleFilterChange}
                        className="servicioslista-input-filtro"
                    />
                    <Select
                        value={selectedServiceType}
                        onChange={(e) => setSelectedServiceType(e.target.value)}
                        displayEmpty
                        className="servicioslista-dropdown-filtro"
                    >
                        <MenuItem value="groupClasses">Clases Grupales</MenuItem>
                        <MenuItem value="subscriptions">Suscripciones</MenuItem>
                        <MenuItem value="consultations">Asesorías Individuales</MenuItem>
                        <MenuItem value="citas">Citas</MenuItem>
                    </Select>
                </div>
    
                {renderServiceList()}
            </div>

            {/* Popup para crear servicio */}
            <Dialog open={isPopupOpen} onClose={handleClosePopup} fullWidth maxWidth="sm">
                <ServiciosPopup onClose={handleClosePopup} theme={theme} />
            </Dialog>
        </div>
    );
};

export default ServiciosLista;
