import React, { useState } from 'react';
import axios from 'axios';
import './widgetgasto.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import NavbarFiltros from './NavbarFiltros';
import { Filter, Receipt } from 'lucide-react'; // Importamos el ícono de lucide-react

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const WidgetGasto = ({ isEditMode, onTitleClick, theme, setTheme, gastos, setGastos, onOpenGastoModal, handleCloseGastoModal }) => { // Asegúrate de pasar setGastos como prop si manejas gastos en el componente padre
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    concepto: true,
    fecha: true,
    estado: true,
    monto: true,
    tipo: true,
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estado: '',
    minMonto: '',
    maxMonto: '',
    tipo: '',
  });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [newGasto, setNewGasto] = useState({
    concepto: '',
    description: '',
    category: '',
    fecha: '',
    estado: '',
    monto: '',
    tipo: '',
    isRecurrente: false,
    frequency: '',
    duration: ''
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Pagado' ? 'Pendiente' : 'Pagado';
    axios.put(`${API_BASE_URL}/api/expenses/update-status/${id}`, { status: newStatus })
      .then(response => {
        const updatedData = gastos.map(item => item._id === id ? response.data : item);
        setGastos(updatedData); // Asegúrate de tener setGastos como prop
      })
      .catch(error => console.error('Error updating status:', error));
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleGastoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGasto({ ...newGasto, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddGasto = (e) => {
    e.preventDefault();

    if (!newGasto.concepto || !newGasto.description || !newGasto.category || !newGasto.fecha || !newGasto.estado || !newGasto.monto || !newGasto.tipo) {
      console.error('All fields are required');
      return;
    }

    axios.post(`${API_BASE_URL}/api/expenses`, {
      concept: newGasto.concepto,
      description: newGasto.description,
      category: newGasto.category,
      amount: newGasto.monto,
      status: newGasto.estado,
      date: newGasto.fecha,
      planType: newGasto.tipo,
      isRecurrente: newGasto.isRecurrente,
      frequency: newGasto.isRecurrente ? newGasto.frequency : null,
      duration: newGasto.isRecurrente ? newGasto.duration : null
    })
    .then(response => {
      // Actualizar la lista de gastos
      setGastos([...gastos, response.data]); // Asegúrate de tener setGastos como prop
      setNewGasto({
        concepto: '',
        description: '',
        category: '',
        fecha: '',
        estado: '',
        monto: '',
        tipo: '',
        isRecurrente: false,
        frequency: '',
        duration: ''
      });
      handleCloseGastoModal();
    })
    .catch(error => console.error('Error adding expense:', error));
  };

  const handleFilterFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterToggleChange = (field, value) => {
    setFilters({ ...filters, [field]: filters[field] === value ? '' : value });
  };

  const clearFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: '' });
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const startDateCondition = filters.startDate ? new Date(item.date) >= new Date(filters.startDate) : true;
      const endDateCondition = filters.endDate ? new Date(item.date) <= new Date(filters.endDate) : true;
      const estadoCondition = filters.estado ? item.status === filters.estado : true;
      const minMontoCondition = filters.minMonto ? item.amount >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? item.amount <= parseFloat(filters.maxMonto) : true;
      const tipoCondition = filters.tipo ? item.planType === filters.planType : true; // Asegúrate de que 'tipo' corresponde a 'planType'
      return startDateCondition && endDateCondition && estadoCondition && minMontoCondition && maxMontoCondition && tipoCondition;
    });
  };

  const filteredData = applyFilters(
    gastos.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : filteredData.map((item) => item._id));
  };

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Maneja valores nulos o indefinidos
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Si la fecha no es válida, retorna la cadena original
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JS son 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDurationLabel = () => {
    switch (newGasto.frequency) {
      case 'weekly':
        return 'Duración (en semanas)';
      case 'biweekly':
        return 'Duración (cada 15 días)';
      case 'monthly':
        return 'Duración (en meses)';
      default:
        return 'Duración';
    }
  };

  const getDurationPlaceholder = () => {
    switch (newGasto.frequency) {
      case 'weekly':
        return 'Duración (en semanas)';
      case 'biweekly':
        return 'Duración (cada 15 días)';
      case 'monthly':
        return 'Duración (en meses)';
      default:
        return 'Duración';
    }
  };

  return (
    <div className={`widget-gasto ${theme}`}>
      <h2 onClick={onTitleClick}>Gastos</h2>
      <div className="controls">
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
        <div className="gasto-button-container">
          <div className="dropdownFilters">
            <button onClick={toggleFilterDropdown} className={`widget-button ${theme}`}
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
              <Filter size={16} color="white" /> {/* Icono de filtro */}
            </button>
            {isFilterDropdownOpen && (
              <div className={`ExFilter-dropdown-content ${theme}`}>
                <div className="filter-field">
                  <label>Fecha Inicio:</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={filters.startDate} 
                    onChange={handleFilterFieldChange} 
                    className={`filter-input ${theme}`}
                  />
                </div>
                <div className="filter-field">
                  <label>Fecha Fin:</label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={filters.endDate} 
                    onChange={handleFilterFieldChange} 
                    className={`filter-input ${theme}`}
                  />
                </div>
                <div className="filter-field">
                  <label>Estado:</label>
                  <button 
                    type="button" 
                    onClick={() => handleFilterToggleChange('estado', 'Pagado')}
                    className={`${filters.estado === 'Pagado' ? 'active' : ''} ${theme}`}
                  >
                    Pagado
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleFilterToggleChange('estado', 'Pendiente')}
                    className={`${filters.estado === 'Pendiente' ? 'active' : ''} ${theme}`}
                  >
                    Pendiente
                  </button>
                </div>
                <div className="filter-field">
                  <label>Mínimo:</label>
                  <input 
                    type="number" 
                    name="minMonto" 
                    value={filters.minMonto} 
                    onChange={handleFilterFieldChange} 
                    className={`filter-input ${theme}`}
                  />
                </div>
                <div className="filter-field">
                  <label>Máximo:</label>
                  <input 
                    type="number" 
                    name="maxMonto" 
                    value={filters.maxMonto} 
                    onChange={handleFilterFieldChange} 
                    className={`filter-input ${theme}`}
                  />
                </div>
                <div className="filter-field">
                  <label>Tipo:</label>
                  <button 
                    type="button" 
                    onClick={() => handleFilterToggleChange('tipo', 'Fijo')}
                    className={`${filters.tipo === 'Fijo' ? 'active' : ''} ${theme}`}
                  >
                    Fijo
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleFilterToggleChange('tipo', 'Variable')}
                    className={`${filters.tipo === 'Variable' ? 'active' : ''} ${theme}`}
                  >
                    Variable
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button onClick={onOpenGastoModal} className={theme}
            style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}>Añadir Gasto</button>
            
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
      <NavbarFiltros filters={filters} clearFilter={clearFilter} theme={theme} />
      <table 
        className={`widget-gasto-table ${theme}`} 
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
            backgroundColor: theme === 'dark' ? '#333' : 'rgb(38 93 181)',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
        }}>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            {visibleColumns.concepto && <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Concepto</th>}
            {visibleColumns.fecha && <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>}
            {visibleColumns.estado && <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Estado</th>}
            {visibleColumns.monto && <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Importe</th>}
            {visibleColumns.tipo && <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tipo de Gasto</th>}
            <th style={{ padding: '8px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item._id} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
            }}>
              <td style={{ padding: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item._id)} 
                  onChange={() => handleCheckboxChange(item._id)} 
                />
              </td>
              {visibleColumns.concepto && <td style={{ padding: '8px' }}>{item.concept}</td>}
              {visibleColumns.fecha && <td style={{ padding: '8px' }}>{formatDate(item.date)}</td>}
              {visibleColumns.estado && <td style={{ padding: '8px' }}>{item.status}</td>}
              {visibleColumns.monto && <td style={{ padding: '8px' }}>€{item.amount}</td>}
              {visibleColumns.tipo && <td style={{ padding: '8px' }}>{item.planType}</td>} {/* Asegúrate de que 'tipo' corresponde a 'planType' */}
              <td style={{ padding: '8px' }}>
              <div className="WG-options">
              <button className={`WG-action-btn ${theme}`} onClick={() => handleChangeStatus(item._id, item.status)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}>
                  <Receipt size={16} color="var(--text)" />
                  </button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetGasto;
