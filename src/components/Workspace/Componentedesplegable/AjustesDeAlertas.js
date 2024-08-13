// AjustesDeAlertas.js
import React, { useState } from 'react';
import './AjustesDeAlertas.css';

const AjustesDeAlertas = ({ alertas, selectedAlertas, setSelectedAlertas, closeModal }) => {
    const [selectedTipos, setSelectedTipos] = useState([]);

    const handleCheckboxChange = (alertaId) => {
        if (selectedAlertas.includes(alertaId)) {
            setSelectedAlertas(selectedAlertas.filter(id => id !== alertaId));
        } else {
            setSelectedAlertas([...selectedAlertas, alertaId]);
        }
    };

    const handleTipoChange = (tipo) => {
        if (selectedTipos.includes(tipo)) {
            setSelectedTipos(selectedTipos.filter(t => t !== tipo));
            setSelectedAlertas(alertas.filter(alerta => alerta.tipo !== tipo).map(alerta => alerta._id));
        } else {
            setSelectedTipos([...selectedTipos, tipo]);
            setSelectedAlertas([...selectedAlertas, ...alertas.filter(alerta => alerta.tipo === tipo).map(alerta => alerta._id)]);
        }
    };

    const alertasPorTipo = alertas.reduce((acc, alerta) => {
        if (!acc[alerta.tipo]) {
            acc[alerta.tipo] = [];
        }
        acc[alerta.tipo].push(alerta);
        return acc;
    }, {});

    return (
        <div className="ajustes-modal" style={{ display: 'flex' }}>
            <div className="ajustes-modal-content">
                <span className="ajustes-close" onClick={closeModal}>&times;</span>
                <h2>Personalizar Alertas</h2>
                {Object.keys(alertasPorTipo).map(tipo => (
                    <div key={tipo} className="ajustes-tipo-section">
                        <h3>
                            <input
                                type="checkbox"
                                checked={selectedTipos.includes(tipo)}
                                onChange={() => handleTipoChange(tipo)}
                            />
                            {tipo}
                        </h3>
                        <div className="ajustes-alertas-list">
                            {alertasPorTipo[tipo].map((alerta) => (
                                <div key={alerta._id} className="ajustes-alerta-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedAlertas.includes(alerta._id)}
                                        onChange={() => handleCheckboxChange(alerta._id)}
                                    />
                                    <label>{alerta.title}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button className="ajustes-save-button" onClick={closeModal}>Guardar</button>
            </div>
        </div>
    );
};

export default AjustesDeAlertas;
