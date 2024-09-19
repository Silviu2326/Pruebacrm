import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ClientesListaDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ClientesListaDashboard = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        cargarClientes();
    }, [API_BASE_URL]);

    const cargarClientes = () => {
        axios.get(`${API_BASE_URL}/api/clientes`)
            .then(response => {
                setClientes(response.data);
                toast.success('Clientes cargados correctamente');
            })
            .catch(error => {
                toast.error('Error al cargar los clientes');
            });
    };

    return (
        <div className="dashboard-clientes-lista">
            <ToastContainer />
            <h2>Tabla de Clientes</h2>
            <table className="dashboard-clientes-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Última Clase</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente._id}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.ultimoCheckin}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesListaDashboard;
