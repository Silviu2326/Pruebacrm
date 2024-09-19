import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaDeRutinasDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ListaDeRutinasDashboard = () => {
  const [rutinas, setRutinas] = useState([]);

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
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-rutinas-lista">
      <h2>Clases Planificadas</h2>
      <table className="dashboard-rutinas-table">
        <thead>
          <tr>
            <th>Clase</th>
            <th>Instructor</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {rutinas.map((rutina) => (
            <tr key={rutina._id}>
              <td>{rutina.nombre}</td>
              <td>{rutina.instructor}</td>
              <td>{formatDate(rutina.fechaInicio)}</td>
              <td>{new Date(rutina.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaDeRutinasDashboard;
