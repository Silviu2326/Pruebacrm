import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alertas.css';
import AjustesDeAlertas from './AjustesDeAlertas';
import { Settings } from 'lucide-react';

const Alertas = ({ theme }) => {
    const [alertas, setAlertas] = useState([]);
    const [selectedAlerta, setSelectedAlerta] = useState(null);
    const [showAjustesModal, setShowAjustesModal] = useState(false);
    const [selectedAlertas, setSelectedAlertas] = useState([]);

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                const response = await axios.get('http://localhost:5005/api/alertas');
                setAlertas(response.data);
                setSelectedAlertas(response.data.map(alerta => alerta._id)); // Inicialmente mostrar todas las alertas
            } catch (error) {
                console.error('Error fetching alertas:', error);
            }
        };

        fetchAlertas();
    }, []);

    const handleItemClick = (alerta) => {
        setSelectedAlerta(alerta);
    };

    const closeModal = () => {
        setSelectedAlerta(null);
    };

    const openAjustesModal = () => {
        setShowAjustesModal(true);
    };

    const closeAjustesModal = () => {
        setShowAjustesModal(false);
    };

    const filteredAlertas = alertas.filter(alerta => selectedAlertas.includes(alerta._id));

    return (
        <div className={`alertas-column ${theme}`}>
            <h3>Alertas</h3>
            <button 
                className={`alertas-personalizar-button ${theme}`} 
                onClick={openAjustesModal}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '15px'
                }}
            >
                <Settings size={20} color="white" style={{ marginRight: '8px' }} />
                Filtrar Alertas Disponibles
            </button>
            <div className={`alertas-alerts-container ${theme}`}>
                {filteredAlertas.map((alerta) => (
                    <div className={`alertas-item ${theme}`} key={alerta._id} onClick={() => handleItemClick(alerta)}>
                        <div className={`alertas-status-text ${theme}`}>
                            <div className={`alertas-status ${alerta.status} ${theme}`}></div>
                            <p><strong>{alerta.title}</strong>: {alerta.message}</p>
                        </div>
                        {alerta.date && (
                            <div className={`alertas-date ${theme}`}>
                                <p>{alerta.date}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedAlerta && (
                <div className={`alertas-modal ${theme}`} style={{ display: 'flex' }}>
                    <div className={`alertas-modal-content ${theme}`}>
                        <span className={`alertas-close ${theme}`} onClick={closeModal}>&times;</span>
                        <h2>{selectedAlerta.title}</h2>
                        <p>{selectedAlerta.message}</p>
                        {selectedAlerta.date && <p><strong>Fecha:</strong> {selectedAlerta.date}</p>}
                    </div>
                </div>
            )}

            {showAjustesModal && (
                <AjustesDeAlertas
                    alertas={alertas}
                    selectedAlertas={selectedAlertas}
                    setSelectedAlertas={setSelectedAlertas}
                    closeModal={closeAjustesModal}
                    theme={theme}
                />
            )}
        </div>
    );
};

export default Alertas;
