import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mail, Calendar, Box, User, CreditCard } from 'lucide-react';

const PopupCliente = ({ cliente, onClose }) => {
    const [activeTab, setActiveTab] = useState('personalInfo');

    const tabContent = () => {
        switch (activeTab) {
            case 'personalInfo':
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>Información Personal</h3>
                        <div style={styles.infoRow}>
                            <div><strong>Edad:</strong> {cliente.edad || 'N/A'} años</div>
                            <div><strong>Género:</strong> {cliente.genero || 'N/A'}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <div><strong>Dirección:</strong> {cliente.direccion || 'N/A'}</div>
                            <div><strong>Altura / Peso:</strong> {cliente.altura || 'N/A'} / {cliente.peso || 'N/A'}</div>
                        </div>
                        <div style={styles.infoRow}>
                            <div><strong>Nivel de experiencia:</strong> {cliente.nivelExperiencia || 'N/A'}</div>
                        </div>
                        <h3 style={styles.sectionTitle}>Contactos</h3>
                        <div style={styles.infoRow}>
                            <div><strong>Email:</strong> {cliente.email || 'N/A'}</div>
                        </div>
                    </div>
                );
            case 'objectivesNotes':
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>Objetivos</h3>
                        <ul>
                            {cliente.objetivos.length > 0 ? cliente.objetivos.map((objetivo, idx) => (
                                <li key={idx}>{objetivo}</li>
                            )) : <li>Ningún objetivo registrado</li>}
                        </ul>
                        <h3 style={styles.sectionTitle}>Notas</h3>
                        <ul>
                            {cliente.notas.length > 0 ? cliente.notas.map(nota => (
                                <li key={nota._id}><strong>{nota.titulo}:</strong> {nota.contenido}</li>
                            )) : <li>Ninguna nota registrada</li>}
                        </ul>
                    </div>
                );
            case 'classesProgress':
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>Clases Asociadas</h3>
                        {cliente.clase ? (
                            <div>
                                <p><strong>Nombre de la clase:</strong> {cliente.clase.nombre}</p>
                                <p><strong>Tipo:</strong> {cliente.clase.tipo}</p>
                                <p><strong>Descripción:</strong> {cliente.clase.descripcion}</p>
                            </div>
                        ) : <p>No hay clases asociadas</p>}
                        <h3 style={styles.sectionTitle}>Progreso</h3>
                        <p>No hay datos de progreso.</p>
                    </div>
                );
            case 'paymentsPurchases':
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>Método de Pago</h3>
                        <p>{cliente.paymentMethod || 'No hay método de pago registrado'}</p>
                        <h3 style={styles.sectionTitle}>Historial de Compras</h3>
                        <p>No hay historial de compras registrado.</p>
                    </div>
                );
            case 'sessionsAppointments':
                return (
                    <div>
                        <h3 style={styles.sectionTitle}>Sesiones</h3>
                        {cliente.clase && cliente.clase.sesiones.length > 0 ? (
                            <ul>
                                {cliente.clase.sesiones.map(sesion => (
                                    <li key={sesion._id}>
                                        <p><strong>Fecha:</strong> {new Date(sesion.fecha).toLocaleDateString()}</p>
                                        <p><strong>Duración:</strong> {sesion.duracion} minutos</p>
                                        <p><strong>Precio:</strong> {sesion.precio} €</p>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>No hay sesiones registradas.</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeButton}>✖</button>
                <div style={styles.header}>
                    <div style={styles.avatar}>
                        <div style={styles.avatarImage}></div>
                    </div>
                    <div style={styles.tabs}>
                        <button style={activeTab === 'personalInfo' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('personalInfo')}>Información Personal</button>
                        <button style={activeTab === 'objectivesNotes' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('objectivesNotes')}>Objetivos y Notas</button>
                        <button style={activeTab === 'classesProgress' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('classesProgress')}>Clases y Progreso</button>
                        <button style={activeTab === 'paymentsPurchases' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('paymentsPurchases')}>Pagos y Compras</button>
                        <button style={activeTab === 'sessionsAppointments' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('sessionsAppointments')}>Sesiones y Citas</button>
                    </div>
                </div>
                <div style={styles.content}>
                    {tabContent()}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: 'var(--background)',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '800px',
        height: '500px',
        padding: '25px',
        position: 'relative',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        color: 'var(--text)',
        position: 'absolute',
        top: '0px',
        right: '0px',
        background: 'none',
        border: 'none',
        fontSize: '12px',
        cursor: 'pointer',
        padding: '10px',
    },
    header: {
        display: 'flex',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '0px',
    },
    avatar: {
        flex: '0 0 50px',
        marginRight: '20px',
    },
    avatarImage: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'red', // Avatar color (puedes personalizarlo)
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    tab: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: 'var(--table-tr-child-bg)',
        color: 'var(--text)',
        border: 'none',
        borderRadius: '5px',
        fontSize: '14px',
    },
    activeTab: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: 'var(--widget-bg)',
        color: 'var(--text)',
        border: '1px solid var(--secondary)',
        borderRadius: '5px',
        fontSize: '14px',
    },
    content: {
        overflowY: 'auto',
        padding: '20px 0',
    },
    sectionTitle: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    // Nuevo estilo para el grid de cliente-cards
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 columnas
        gap: '20px', // Espacio entre las tarjetas
        width: '100%', // Asegura que ocupe el ancho disponible
        maxWidth: '1200px', // Limita el ancho máximo para que no se extienda demasiado en pantallas grandes
        padding: '20px',
        margin: '0 auto', // Centra el grid horizontalmente
    },
    clienteCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    }
};

PopupCliente.propTypes = {
    cliente: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        edad: PropTypes.number,
        genero: PropTypes.string,
        direccion: PropTypes.string,
        altura: PropTypes.number,
        peso: PropTypes.number,
        nivelExperiencia: PropTypes.string,
        email: PropTypes.string.isRequired,
        objetivos: PropTypes.array,
        notas: PropTypes.array,
        clase: PropTypes.object,
        paymentMethod: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

// Este es el nuevo componente para renderizar cliente-cards en un grid
const ClientesGrid = ({ clientes }) => {
    return (
        <div style={styles.gridContainer}>
            {clientes.map((cliente) => (
                <div key={cliente.email} style={styles.clienteCard}>
                    <p><strong>Nombre:</strong> {cliente.nombre}</p>
                    <p><strong>Edad:</strong> {cliente.edad || 'N/A'}</p>
                    <p><strong>Email:</strong> {cliente.email || 'N/A'}</p>
                </div>
            ))}
        </div>
    );
};

ClientesGrid.propTypes = {
    clientes: PropTypes.arrayOf(
        PropTypes.shape({
            nombre: PropTypes.string.isRequired,
            edad: PropTypes.number,
            email: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default PopupCliente;
