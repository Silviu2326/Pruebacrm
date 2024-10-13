// src/components/Workspace/ClientesListaDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ClientesListaDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ClientesListaDashboard = ({ theme, setTheme }) => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    useEffect(() => {
        cargarClientes();
        // Nota: API_BASE_URL es una constante y no necesita estar en las dependencias
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarClientes = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => {
                setClientes(response.data);
                toast.success('Clientes cargados correctamente');
            })
            .catch(error => {
                console.error('Error al cargar los clientes:', error);
                toast.error('Error al cargar los clientes');
            });
    };

    // Función para manejar cambios en el input de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar clientes basados en el término de búsqueda (case-insensitive)
    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`dashboard-clientes-lista ${theme}`}>
            <ToastContainer />
            <h2>Tabla de Clientes</h2>

            {/* Campo de Entrada para Filtrar Clientes */}
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={`filter-input ${theme}`}
                    style={{
                        background: 'transparent',
                        border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background 0.3s ease',  
                        width: '230px',
                        height: '44px',
            }}
            
                />
            </div>

            {/* Tabla de Clientes */}
            <table className={`dashboard-clientes-table ${theme}`}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Última Clase</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                            <tr key={cliente._id}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.ultimoCheckin ? new Date(cliente.ultimoCheckin).toLocaleString() : 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>No se encontraron clientes.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesListaDashboard;
