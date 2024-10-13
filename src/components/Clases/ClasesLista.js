// src/components/Clases/ClasesLista.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ClasesLista.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ClasesLista = ({ onClientesSeleccionados, clientesSeleccionados, onClose, theme }) => {
  const [clientes, setClientes] = useState([]);
  const [selectedClienteIds, setSelectedClienteIds] = useState(
    clientesSeleccionados ? clientesSeleccionados.map(c => c.client) : []
  );
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes`);
      setClientes(response.data);
      toast.success('Clientes cargados correctamente');
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      toast.error('Error al cargar los clientes');
    }
  };

  const handleCheckboxChange = (clienteId) => {
    setSelectedClienteIds(prevSelected => {
      if (prevSelected.includes(clienteId)) {
        return prevSelected.filter(id => id !== clienteId);
      } else {
        return [...prevSelected, clienteId];
      }
    });
  };

  const handleConfirmarSeleccion = async () => {
    try {
      // Obtener los detalles completos de los clientes seleccionados
      const selected = clientes.filter(cliente => selectedClienteIds.includes(cliente._id));
      onClientesSeleccionados(selected);
      toast.success('Clientes asociados correctamente');
    } catch (error) {
      console.error('Error al asociar clientes:', error);
      toast.error('Error al asociar clientes');
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleSeleccionarTodos = () => {
    if (selectedClienteIds.length === clientesFiltrados.length) {
      setSelectedClienteIds([]);
    } else {
      setSelectedClienteIds(clientesFiltrados.map(c => c._id));
    }
  };

  return (
    <div className={`ClasesListaContainer ${theme}`}
  >
      <ToastContainer />
      <h1>Seleccionar Clientes</h1>
      <div className="buttonsContainer">
        <button className={`confirmarBtn ${theme}`} onClick={handleConfirmarSeleccion}
        style={{
          background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}
>Confirmar Selección</button>
        <button className={`cerrarBtn ${theme}`} onClick={onClose}>Cerrar</button>
      </div>
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={filtro}
        onChange={handleFiltroChange}
        className="filtroInput"
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          boxSizing: 'border-box',
        }}
      />
      <table className={`clientesTable ${theme}`} 
        style={{ 
          borderRadius: '10px', 
          borderCollapse: 'separate', 
          borderSpacing: '0', 
          width: '100%', 
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead style={{ 
            backgroundColor: theme === 'dark' ? '#333' : '#f3f3f3',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
        }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : '#236dc9', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={selectedClienteIds.length === clientesFiltrados.length && clientesFiltrados.length > 0}
                onChange={handleSeleccionarTodos}
              />
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : '#236dc9', fontWeight: 'bold' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : '#236dc9', fontWeight: 'bold' }}>Apellido</th>
            <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : '#236dc9', fontWeight: 'bold' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente, index) => (
            <tr 
              key={cliente._id} 
              style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Colores alternos en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Colores alternos en modo claro
              }}
            >
              <td style={{ padding: '12px' }}>
                <input
                  type="checkbox"
                  checked={selectedClienteIds.includes(cliente._id)}
                  onChange={() => handleCheckboxChange(cliente._id)}
                />
              </td>
              <td style={{ padding: '12px' }}>{cliente.nombre}</td>
              <td style={{ padding: '12px' }}>{cliente.apellido}</td>
              <td style={{ padding: '12px' }}>{cliente.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClasesLista;
