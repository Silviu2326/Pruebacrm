import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import Checkins from './Checkins';
import Alertas from './Alertas';
import Chater from './Chater';
import Tab from './Tab';
import { MessageSquare, ClipboardList, Settings, Minimize2 } from 'lucide-react'; // Importación de los íconos
import './Componentedesplegable.css';

const Componentedesplegable = ({ onClose, openChatModal, theme, setTheme }) => {
    const [visibleColumns, setVisibleColumns] = useState({
        checkins: true,
        alertas: true,
        chater: true,
    });

    const toggleColumnVisibility = (column) => {
        setVisibleColumns((prevState) => ({
            ...prevState,
            [column]: !prevState[column],
        }));
    };

    return (
        <div className={`draggable-container ${theme}`}>
            <ResizableBox
                className={`componentedesplegable ${theme}`}
                width={'100%'}
                height={400} // Altura inicial
                minConstraints={[500, 100]} // Mínimo: 100px de altura
                maxConstraints={[window.innerWidth, window.innerHeight * 0.9]} // Máximo: 90% del alto de la pantalla
                resizeHandles={['s']} // Solo permite redimensionar verticalmente (sur)
                axis="y" // Restringe el redimensionamiento al eje Y
            >
                <div className={`draggable-content ${theme}`}>
                    <div className={`header ${theme}`}>
                        <Settings className={`settings-icon ${theme}`} /> {/* Icono de configuración */}
                        <button onClick={onClose} className={`close-button ${theme}`} style={{ color: 'var(--text)', padding: '2px', top: '5px' }}><Minimize2 /></button>
                    </div>
                    <div className={`tabs ${theme}`}>
                        <Tab
                            label="Check ins"
                            isActive={visibleColumns.checkins}
                            onClick={() => toggleColumnVisibility('checkins')}
                        />
                        <Tab
                            label="Alertas"
                            isActive={visibleColumns.alertas}
                            onClick={() => toggleColumnVisibility('alertas')}
                        />
                        <Tab
                            label="Chater"
                            isActive={visibleColumns.chater}
                            onClick={() => toggleColumnVisibility('chater')}
                        />
                    </div>
                    <div className={`content ${theme}`}>
                        {visibleColumns.checkins && <Checkins theme={theme}/>}
                        {visibleColumns.alertas && <Alertas theme={theme}/>}
                        {visibleColumns.chater && <Chater openChatModal={openChatModal} theme={theme}/>}
                    </div>
                </div>
            </ResizableBox>
        </div>
    );
};

export default Componentedesplegable;
