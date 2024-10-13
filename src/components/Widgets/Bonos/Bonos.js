import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonos.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import { Filter, CirclePower } from 'lucide-react'; // Importamos el ícono de lucide-react
import Modalcreacionbonos from './Modalcreacionbonos';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Bonos = ({ isEditMode, onTitleClick, theme, onOpenCreateBonoModal }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    fechaComienzo: true,
    fechaExpiracion: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true
  });
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    tipo: '',
    descripcion: '',
    fechaExpiracion: '',
    fechaComienzo: '',
    servicio: '',
    sesiones: '',
    fechaVenta: '',
    precio: '',
  });
  const [isBonoDropdownOpen, setIsBonoDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estado: 'Todos',
    cliente: '',
    minMonto: '',
    maxMonto: '',
    tipo: 'Todos',
  });
  const [showCreateBonoModal, setShowCreateBonoModal] = useState(false);

  useEffect(() => {
    const fetchBonos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bonos`);
        console.log('Bonos fetched from server:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching bonos:', error);
      }
    };

    fetchBonos();
  }, []);

  // Función de formateo de fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const toggleBonoDropdown = () => {
    setIsBonoDropdownOpen(!isBonoDropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Form data updated:', { ...formData, [name]: value });
  };

  const handleCreateBono = async (e) => {
    e.preventDefault();
    console.log('handleCreateBono triggered');

    const newBono = {
      ...formData,
      nombre: `B${(data.length + 1).toString().padStart(3, '0')}`,
      fechaCreacion: new Date().toISOString()
    };

    console.log('Creando bono con los siguientes datos:', newBono);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bonos`, newBono);
      console.log('Bono creado en el servidor:', response.data);
      setData([...data, response.data]);
      setFormData({
        nombre: '',
        cliente: '',
        tipo: '',
        descripcion: '',
        fechaExpiracion: '',
        fechaComienzo: '',
        servicio: '',
        sesiones: '',
        fechaVenta: '',
        precio: '',
      });
      setIsBonoDropdownOpen(false);
    } catch (error) {
      console.error('Error al crear el bono:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleFilterFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      estado: 'Todos',
      cliente: '',
      minMonto: '',
      maxMonto: '',
      tipo: 'Todos',
    });
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    const estadosPosibles = ['Activo', 'No Activo', 'Pendiente'];
    let estadoActualIndex = estadosPosibles.indexOf(newData[index].estado);
    newData[index].estado = estadosPosibles[(estadoActualIndex + 1) % estadosPosibles.length];
    setData(newData);
  };

  const handleFilterBonos = () => {
    const filteredData = data.filter(item => item.estado === 'Activo');
    setData(filteredData);
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const startDateCondition = filters.startDate ? new Date(item.fechaComienzo) >= new Date(filters.startDate) : true;
      const endDateCondition = filters.endDate ? new Date(item.fechaExpiracion) <= new Date(filters.endDate) : true;
      const estadoCondition = filters.estado === 'Todos' || item.estado === filters.estado;
      const clienteCondition = filters.cliente ? item.beneficiario.toLowerCase().includes(filters.cliente.toLowerCase()) : true;
      const minMontoCondition = filters.minMonto ? item.monto >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? item.monto <= parseFloat(filters.maxMonto) : true;
      const tipoCondition = filters.tipo === 'Todos' || item.tipo === filters.tipo;

      return (
        startDateCondition &&
        endDateCondition &&
        estadoCondition &&
        clienteCondition &&
        minMontoCondition &&
        maxMontoCondition &&
        tipoCondition
      );
    });
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleCloseCreateBonoModal = () => {
    setShowCreateBonoModal(false);
  };

  return (
    <div className={`Widget-bono-widget-bonos ${theme}`}>
      <h2 onClick={onTitleClick}>Bonos</h2>
      <div className="Widget-bono-controls">
      <div style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={handleFilterChange}
            className={`panelcontrol-filter-input ${theme}`}
            style={{
              background: 'transparent',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
              width: '230px',
              height: '44px',
              marginRight: '15px',
            }}
          />
          <div className="Widget-bono-dropdown">
          <button
            className={`Widget-bono-filter-btn ${theme}`}
            onClick={toggleBonoDropdown}
            style={{
              background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : '1px solid var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
          >
            <Filter size={16} color="white" />
          </button>
          {isBonoDropdownOpen && (
            <div className={`Widget-bono-dropdown-content ${theme}`}>
              <div className="filter-field">
                <label>Inicio:</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterFieldChange}
                  className={theme}
                />
              </div>
              <div className="filter-field">
                <label>Fin:</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterFieldChange}
                  className={theme}
                />
              </div>
              <div className="filter-field">
                <label>Estado:</label>
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterFieldChange}
                  className={theme}
                >
                  <option value="Todos">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="No Activo">No Activo</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
              <div className="filter-field">
                <label>Clientes:</label>
                <input
                  type="text"
                  name="cliente"
                  value={filters.cliente}
                  onChange={handleFilterFieldChange}
                  className={theme}
                />
              </div>
              <div className="filter-field" >
                <label>€Mín:</label>
                <input
                  type="number"
                  name="minMonto"
                  value={filters.minMonto}
                  onChange={handleFilterFieldChange}
                  className={theme}
                />
              </div>
              <div className="filter-field" >
                <label>€Máx:</label>
                <input
                  type="number"
                  name="maxMonto"
                  value={filters.maxMonto}
                  onChange={handleFilterFieldChange}
                  className={theme}
                />
              </div>
              <div className="filter-field">
                <label>Tipo:</label>
                <select
                  name="tipo"
                  value={filters.tipo}
                  onChange={handleFilterFieldChange}
                  className={theme}
                >
                  <option value="Todos">Todos</option>
                  <option value="Fijo">Fijo</option>
                  <option value="Variable">Variable</option>
                </select>
              </div>
              <div className="Widget-bono-buttons">
                <button onClick={applyFilters} className="apply-filters-btn">
                  Aplicar filtros
                </button>
                <button onClick={handleClearFilters} className="clear-filters-btn" style={{
                  marginLeft: '0',
                }}>
                  Borrar filtros
                </button>
              </div>
            </div>
          )}
          </div>
          </div> 
        <div className="Widget-bono-bono-button-container">
          <div className="Widget-bono">
            <button
              onClick={onOpenCreateBonoModal}
              className={`Widget-bono-bono-button ${theme}`}
              style={{
                background: 'var(--create-button-bg)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : '1px solid var(--button-border-light)',
                padding: '14px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background 0.3s ease',
              }}
            >
              Crear Bono
            </button>
          </div>
        </div>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
            theme={theme}
          />
        )}
      </div>
      <table
        className={theme}
        style={{
          borderRadius: '10px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead
          className={theme}
          style={{
            backgroundColor: theme === 'dark' ? '#555555' : '#265db5',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
          }}
        >
          <tr>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                color: 'white',
                fontWeight: 'bold'
              }}
            ></th>
            {visibleColumns.nombre && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Nombre de Bono
              </th>
            )}
            {visibleColumns.fechaComienzo && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Fecha de Comienzo
              </th>
            )}
            {visibleColumns.fechaExpiracion && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Fecha de Expiración
              </th>
            )}
            {visibleColumns.estado && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Estado
              </th>
            )}
            {visibleColumns.beneficiario && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Clientes asignados
              </th>
            )}
            {visibleColumns.monto && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Importe
              </th>
            )}
            {visibleColumns.tipo && (
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                Tipo de Bono
              </th>
            )}
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                color: 'white',
                fontWeight: 'bold'
              }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className={theme}
              style={{
                backgroundColor: theme === 'dark'
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
              }}
            >
              <td>
                <input type="checkbox" />
              </td>
              {visibleColumns.nombre && (
                <td style={{ padding: '12px' }}>{item.nombre}</td>
              )}
              {visibleColumns.fechaComienzo && (
                <td style={{ padding: '12px' }}>{formatDate(item.fechaComienzo)}</td>
              )}
              {visibleColumns.fechaExpiracion && (
                <td style={{ padding: '12px' }}>{formatDate(item.fechaExpiracion)}</td>
              )}
              {visibleColumns.estado && (
                <td style={{ padding: '12px' }}>{item.estado}</td>
              )}
              {visibleColumns.beneficiario && (
                <td style={{ padding: '12px' }}>{item.beneficiario}</td>
              )}
              {visibleColumns.monto && (
                <td style={{ padding: '12px' }}>{item.monto}</td>
              )}
              {visibleColumns.tipo && (
                <td style={{ padding: '12px' }}>{item.tipo}</td>
              )}
              <td style={{ padding: '12px' }}>
                <div className="Widget-bono-dropdown Widget-bono-options-dropdown">
                  <button className={`Widget-bono-dropdown-toggle Widget-bono-options-btn ${theme}`}>...</button>
                  <div className={`Widget-bono-dropdown-menu Widget-bono-options-menu ${theme}`}>
                    <button
                      className={`Widget-bono-dropdown-item ${theme}`}
                      onClick={() => handleChangeStatus(index)}
                    >
                      <CirclePower size={18} />
                    </button>
                    <button className={`Widget-bono-dropdown-item ${theme}`}>Opción 2</button>
                    <button className={`Widget-bono-dropdown-item ${theme}`}>Opción 3</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCreateBonoModal && <Modalcreacionbonos onClose={handleCloseCreateBonoModal} />}
    </div>
  );
};

export default Bonos;
