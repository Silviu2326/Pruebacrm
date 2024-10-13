// ClientesSimplificadaView.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, Mail, Calendar, Box, Dumbbell } from 'lucide-react';
import './ClientesSimplificadaView.css';
import PopupCliente from './ClientessimplificadaPopup'; // Importamos el nuevo componente de Popup

const generarClasesAleatorias = () => {
    const clasesDisponibles = ['Yoga', 'Pilates', 'Levantamiento de pesas', 'CrossFit', 'Natación', 'Ciclismo', 'Zumba', 'Kickboxing'];
    const clasesAleatorias = [];
    const numeroDeClases = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numeroDeClases; i++) {
        const indiceAleatorio = Math.floor(Math.random() * clasesDisponibles.length);
        clasesAleatorias.push(clasesDisponibles[indiceAleatorio]);
        clasesDisponibles.splice(indiceAleatorio, 1);
    }

    return clasesAleatorias;
};

const ClientesSimplificadaView = ({ clientes, theme }) => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const generarFechaAleatoria = () => {
        const hoy = new Date();
        const diasAtras = Math.floor(Math.random() * 30);
        const fechaAleatoria = new Date(hoy);
        fechaAleatoria.setDate(hoy.getDate() - diasAtras);
        return fechaAleatoria.toISOString().split('T')[0];
    };

    return (
        <div className={`clientes-simplificada-view ${theme}`}>
            {clientes.map(cliente => {
                const clases = cliente.clases && cliente.clases.length > 0 ? cliente.clases : generarClasesAleatorias();

                return (
                    <div 
                        key={cliente._id} 
                        className="cliente-card" 
                        onClick={() => setClienteSeleccionado(cliente)} // Abrir popup al hacer clic
                    >
                        <div className="cliente-info">
                            <div className="cliente-header">
                                <div className="cliente-avatar"></div>
                                <div className="cliente-header-text">
                                    <h3>{cliente.nombre} {cliente.apellido}</h3>
                                    <span className="cliente-status active">
                                        <CheckCircle size={16} /> Activo
                                    </span>
                                </div>
                            </div>
                            <p className="cliente-email">
                                <Mail size={16} /> {cliente.email}
                            </p>
                            <p className="cliente-plan">
                                <Box size={16} /> {cliente.tipoDePlan || 'Mensual'}
                            </p>
                            <div className="cliente-clases">
                                <Dumbbell size={16} />
                                <div className="cliente-tags">
                                    {clases.map(clase => (
                                        <span key={clase} className="cliente-tag">
                                            {clase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="cliente-checkin">
                                <Calendar size={16} /> Último check-in: {cliente.ultimoCheckin || generarFechaAleatoria()}
                            </p>
                        </div>
                    </div>
                );
            })}

            {clienteSeleccionado && (
                <PopupCliente 
                    cliente={clienteSeleccionado} 
                    onClose={() => setClienteSeleccionado(null)} // Cerrar el popup
                />
            )}
        </div>
    );
};

ClientesSimplificadaView.propTypes = {
    clientes: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        apellido: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        tipoDePlan: PropTypes.string,
        clases: PropTypes.arrayOf(PropTypes.string),
        ultimoCheckin: PropTypes.string,
        estado: PropTypes.string
    })).isRequired,
    theme: PropTypes.string.isRequired,
};

export default ClientesSimplificadaView;
