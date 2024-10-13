import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
import "./AsociarClientesDropdown.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const AsociarClientesDropdown = ({ plan, onTrade }) => {
  const [clientesAsociadosLocal, setClientesAsociadosLocal] = useState([]);
  const [clientesNoAsociadosLocal, setClientesNoAsociadosLocal] = useState([]);
  const [selectedAsociados, setSelectedAsociados] = useState([]); 
  const [selectedNoAsociados, setSelectedNoAsociados] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    email: true,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar la visibilidad del dropdown

  const allColumns = {
    nombre: 'Nombre',
    email: 'Email',
    genero: 'Género',
    edad: 'Edad',
    ocupacion: 'Ocupación',
    direccion: 'Dirección',
    nivelExperiencia: 'Nivel de Experiencia',
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesResponse = await axios.get(`${API_BASE_URL}/api/clientes/`);
        const todosLosClientes = clientesResponse.data;

        const clientesConPlanesResponse = await axios.get(`${API_BASE_URL}/api/clientes/plans`);
        const clientesConPlanes = clientesConPlanesResponse.data;

        const clientesConEstePlan = clientesConPlanes.filter(cliente => 
          cliente.associatedPlans.some(planAsociado => planAsociado._id === plan.id)
        );

        const clientesSinEstePlan = todosLosClientes.filter(cliente => 
          !cliente.associatedPlans.some(planAsociado => planAsociado._id === plan.id)
        );

        setClientesAsociadosLocal(clientesConEstePlan);
        setClientesNoAsociadosLocal(clientesSinEstePlan);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los clientes:', err);
        setError('Error al obtener los clientes.');
        setLoading(false);
      }
    };

    fetchClientes();
  }, [plan.id]);

  const handleCheckboxChange = (cliente, isAsociado) => {
    if (isAsociado) {
      if (selectedAsociados.includes(cliente._id)) {
        setSelectedAsociados(selectedAsociados.filter(id => id !== cliente._id));
      } else {
        setSelectedAsociados([...selectedAsociados, cliente._id]);
      }
    } else {
      if (selectedNoAsociados.includes(cliente._id)) {
        setSelectedNoAsociados(selectedNoAsociados.filter(id => id !== cliente._id));
      } else {
        setSelectedNoAsociados([...selectedNoAsociados, cliente._id]);
      }
    }
  };

  const handleTrade = async () => {
    const nuevosAsociados = clientesAsociadosLocal.filter(cliente => !selectedAsociados.includes(cliente._id));
    const nuevosNoAsociados = clientesNoAsociadosLocal.filter(cliente => !selectedNoAsociados.includes(cliente._id));

    const movidosAAsociados = clientesNoAsociadosLocal.filter(cliente => selectedNoAsociados.includes(cliente._id));
    const movidosANoAsociados = clientesAsociadosLocal.filter(cliente => selectedAsociados.includes(cliente._id));

    try {
      for (const cliente of movidosAAsociados) {
        await axios.post(`${API_BASE_URL}/api/clientes/${cliente._id}/plan`, { planId: plan.id, planType: plan.tipoPlan });
      }

      for (const cliente of movidosANoAsociados) {
        await axios.delete(`${API_BASE_URL}/api/clientes/${cliente._id}/plan`, { data: { planId: plan.id } });
      }
    } catch (error) {
      console.error('Error al guardar los cambios durante el trade:', error);
    }

    setClientesAsociadosLocal([...nuevosAsociados, ...movidosAAsociados]);
    setClientesNoAsociadosLocal([...nuevosNoAsociados, ...movidosANoAsociados]);

    setSelectedAsociados([]);
    setSelectedNoAsociados([]);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen); // Cambiar el estado al hacer clic en el botón
  };

  const filteredClientesNoAsociados = clientesNoAsociadosLocal.filter(cliente => {
    return Object.keys(allColumns).some(key => 
      cliente[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="TradePlans-loading">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="TradePlans-error">{error}</div>;
  }

  return (
    <div className="TradePlans-container">
      <h3 className="TradePlans-title">Nombre del plan: {plan.nombre}</h3>
      <div className="TradePlans-clientes-grid">
        <div className="TradePlans-clientes-asociados">
          <h4 className="TradePlans-subtitle">Clientes Asignados</h4>
          <table className="TradePlans-table">
            <thead>
              <tr>
                {visibleColumns.nombre && <th>Nombre</th>}
                {visibleColumns.email && <th>Email</th>}
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {clientesAsociadosLocal.map(cliente => (
                <tr key={cliente._id}>
                  {visibleColumns.nombre && <td>{cliente.nombre}</td>}
                  {visibleColumns.email && <td>{cliente.email}</td>}
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedAsociados.includes(cliente._id)}
                      onChange={() => handleCheckboxChange(cliente, true)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="TradePlans-trade-button-container">
          <button className="TradePlans-trade-button" onClick={handleTrade}>
            <FaExchangeAlt />
          </button>
        </div>

        <div className="TradePlans-clientes-no-asociados">
          <div className="TradePlans-controls">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
              className="TradePlans-search-bar"
            />
            <div className="TradePlans-dropdown">
              <button className="TradePlans-dropdown-button" onClick={handleDropdownToggle}>
                <FaFilter /> Filtrar Columnas
              </button>
              {isDropdownOpen && (
                <div className="TradePlans-dropdown-content">
                  {Object.keys(allColumns).map(column => (
                    <label key={column}>
                      <input 
                        type="checkbox" 
                        checked={!!visibleColumns[column]} 
                        onChange={() => handleColumnToggle(column)}
                      />
                      {allColumns[column]}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h4 className="TradePlans-subtitle">Clientes No Asignados</h4>
          <table className="TradePlans-table">
            <thead>
              <tr>
                {visibleColumns.nombre && <th>Nombre</th>}
                {visibleColumns.email && <th>Email</th>}
                {Object.keys(visibleColumns).map(column => 
                  visibleColumns[column] && column !== 'nombre' && column !== 'email' && <th key={column}>{allColumns[column]}</th>
                )}
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientesNoAsociados.map(cliente => (
                <tr key={cliente._id}>
                  {visibleColumns.nombre && <td>{cliente.nombre}</td>}
                  {visibleColumns.email && <td>{cliente.email}</td>}
                  {Object.keys(visibleColumns).map(column => 
                    visibleColumns[column] && column !== 'nombre' && column !== 'email' && <td key={column}>{cliente[column]}</td>
                  )}
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedNoAsociados.includes(cliente._id)}
                      onChange={() => handleCheckboxChange(cliente, false)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="TradePlans-action-buttons">
        <button className="TradePlans-button" onClick={() => onTrade([], [])}>Cancelar</button>
        <button className="TradePlans-button" onClick={() => onTrade([], [])}>Cerrar</button>
      </div>
    </div>
  );
};

export default AsociarClientesDropdown;
