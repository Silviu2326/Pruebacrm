// src/components/Workspace/ListaDeRutinasDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaDeRutinasDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ListaDeRutinasDashboard = ({ theme, setTheme }) => {
  const [rutinas, setRutinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routines`);
        if (Array.isArray(response.data)) {
          setRutinas(response.data);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };

    fetchRutinas();
    // Nota: API_BASE_URL es una constante y no necesita estar en las dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar rutinas basadas en el término de búsqueda (case-insensitive)
  const filteredRutinas = rutinas.filter(rutina =>
    rutina.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`dashboard-rutinas-lista ${theme}`}>
      <h2>Clases Planificadas</h2>

      {/* Campo de Entrada para Filtrar Rutinas (Alineado a la Izquierda) */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Buscar por clase..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={`filter-input ${theme}`}
          aria-label="Buscar por nombre de clase"
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

      {/* Tabla de Rutinas */}
      <table className={`dashboard-rutinas-table ${theme}`}>
        <thead>
          <tr>
            <th>Clase</th>
            <th>Instructor</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {filteredRutinas.length > 0 ? (
            filteredRutinas.map((rutina) => (
              <tr key={rutina._id}>
                <td>{rutina.nombre}</td>
                <td>{rutina.instructor}</td>
                <td>{formatDate(rutina.fechaInicio)}</td>
                <td>{new Date(rutina.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No se encontraron clases.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaDeRutinasDashboard;
