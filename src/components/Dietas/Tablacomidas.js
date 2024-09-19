import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tablacomidas.css';

const Tablacomidas = ({ theme }) => {
  const [comidas, setComidas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComidas = async () => {
      try {
        const response = await axios.get('/api/comidas');
        setComidas(response.data);
      } catch (error) {
        console.error('Error fetching comidas:', error);
      }
    };

    fetchComidas();
  }, []);

  const filteredComidas = comidas.filter((comida) =>
    comida.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={theme === 'dark' ? 'Tablacomida-dark' : ''}>
      <input
        className={`Tablacomida-searchInput ${theme === 'dark' ? 'Tablacomida-dark' : ''}`}
        type="text"
        placeholder="Buscar comidas"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="Tablacomida-tableContainer">
        <table className="Tablacomida-styledTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Calorías</th>
              <th>Carbohidratos</th>
              <th>Proteínas</th>
              <th>Grasas</th>
            </tr>
          </thead>
          <tbody>
            {filteredComidas.map((comida) => (
              <tr key={comida._id}>
                <td>{comida.nombre}</td>
                <td>{comida.descripcion}</td>
                <td>{comida.calorias}</td>
                <td>{comida.carb}</td>
                <td>{comida.protein}</td>
                <td>{comida.fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tablacomidas;
