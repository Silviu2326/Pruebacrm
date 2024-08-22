import React, { useState } from 'react';
import axios from 'axios';
import './widgetgasto.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import NavbarFiltros from './NavbarFiltros';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const WidgetGasto = ({ isEditMode, onTitleClick, theme, setTheme, gastos }) => {
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
  const [isGastoDropdownOpen, setIsGastoDropdownOpen] = useState(false);
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
        setNewGasto(updatedData);
      })
      .catch(error => console.error('Error updating status:', error));
  };

  const toggleGastoDropdown = () => {
    setIsGastoDropdownOpen(!isGastoDropdownOpen);
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
      setNewGasto([...gastos, response.data]);
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
      setIsGastoDropdownOpen(false);
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
      const tipoCondition = filters.tipo ? item.tipo === filters.tipo : true;
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

  const getDurationLabel = () => {
    switch (newGasto.frequency) {
      case 'weekly':
        return 'Duración (een semanas)';
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
          placeholder="Buscar gasto..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={theme}
        />
        <div className="gasto-button-container">
          <div className="dropdownFilters">
            <button onClick={toggleFilterDropdown} className={`widget-button ${theme}`}>Filtros</button>
            {isFilterDropdownOpen && (
              <div className={`ExFilter-dropdown-content ${theme}`}>
                <div className="filter-field">
                  <label>Fecha Inicio:</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={filters.startDate} 
                    onChange={handleFilterFieldChange} 
                    className={theme}
                  />
                </div>
                <div className="filter-field">
                  <label>Fecha Fin:</label>
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
                  <label>Importe Mín:</label>
                  <input 
                    type="number" 
                    name="minMonto" 
                    value={filters.minMonto} 
                    onChange={handleFilterFieldChange} 
                    className={theme}
                  />
                </div>
                <div className="filter-field">
                  <label>Importe Máx:</label>
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
            <button onClick={toggleGastoDropdown} className={theme}>Añadir Gasto</button>
            {isGastoDropdownOpen && (
              <div className={`Exdropdown-content ${theme}`}>
                <h3 className="Widgetgastoanadir-title">Añadir Gasto</h3>
                <form onSubmit={handleAddGasto} className="Widgetgastoanadir-form">
                  <label htmlFor="concept" className="Widgetgastoanadir-label">Concepto</label>
                  <input 
                    type="text" 
                    id="concept"
                    name="concepto" 
                    placeholder="Concepto" 
                    value={newGasto.concepto} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />
                  
                  <label htmlFor="description" className="Widgetgastoanadir-label">Descripción</label>
                  <input 
                    type="text" 
                    id="description"
                    name="description" 
                    placeholder="Descripción" 
                    value={newGasto.description} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />

                  <label htmlFor="category" className="Widgetgastoanadir-label">Categoría</label>
                  <input 
                    type="text" 
                    id="category"
                    name="category" 
                    placeholder="Categoría" 
                    value={newGasto.category} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />

                  <label htmlFor="amount" className="Widgetgastoanadir-label">Importe</label>
                  <input 
                    type="number" 
                    id="amount"
                    name="monto" 
                    placeholder="Importe" 
                    value={newGasto.monto} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />

                  <label htmlFor="status" className="Widgetgastoanadir-label">Estado</label>
                  <input 
                    type="text" 
                    id="status"
                    name="estado" 
                    placeholder="Estado" 
                    value={newGasto.estado} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />

                  <label htmlFor="date" className="Widgetgastoanadir-label">Fecha</label>
                  <input 
                    type="date" 
                    id="date"
                    name="fecha" 
                    placeholder="Fecha" 
                    value={newGasto.fecha} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-input ${theme}`}
                    required
                  />

                  <label htmlFor="isRecurrente" className="Widgetgastoanadir-label">¿Es recurrente?</label>
                  <input 
                    type="checkbox" 
                    id="isRecurrente"
                    name="isRecurrente" 
                    checked={newGasto.isRecurrente} 
                    onChange={handleGastoChange} 
                    className={`Widgetgastoanadir-checkbox ${theme}`}
                  />

                  {newGasto.isRecurrente && (
                    <>
                      <label htmlFor="frequency" className="Widgetgastoanadir-label">Frecuencia</label>
                      <select 
                        id="frequency"
                        name="frequency" 
                        value={newGasto.frequency} 
                        onChange={handleGastoChange} 
                        className={`Widgetgastoanadir-select ${theme}`}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="weekly">Semanal</option>
                        <option value="biweekly">Quincenal</option>
                        <option value="monthly">Mensual</option>
                      </select>

                      <label htmlFor="duration" className="Widgetgastoanadir-label">{getDurationLabel()}</label>
                      <input 
                        type="number" 
                        id="duration"
                        name="duration" 
                        placeholder={getDurationPlaceholder()} 
                        value={newGasto.duration} 
                        onChange={handleGastoChange} 
                        className={`Widgetgastoanadir-input ${theme}`}
                      />
                    </>
                  )}

                  <button type="submit" className={`Widgetgastoanadir-button ${theme}`}>Añadir</button>
                </form>
              </div>
            )}
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
      <table className={`widget-gasto-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            {visibleColumns.concepto && <th>Concepto</th>}
            {visibleColumns.fecha && <th>Fecha</th>}
            {visibleColumns.estado && <th>Estado</th>}
            {visibleColumns.monto && <th>Importe</th>}
            {visibleColumns.tipo && <th>Tipo de Gasto</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item._id} className={theme}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item._id)} 
                  onChange={() => handleCheckboxChange(item._id)} 
                />
              </td>
              {visibleColumns.concepto && <td>{item.concept}</td>}
              {visibleColumns.fecha && <td>{item.date}</td>}
              {visibleColumns.estado && <td>{item.status}</td>}
              {visibleColumns.monto && <td>€{item.amount}</td>}
              {visibleColumns.tipo && <td>{item.category}</td>}
              <td>
                <div className="dropdown options-dropdown">
                  <button className={`dropdown-toggle options-btn ${theme}`}>...</button>
                  <div className={`dropdown-menu options-menu ${theme}`}>
                    <button className={`dropdown-item ${theme}`} onClick={() => handleChangeStatus(item._id, item.status)}>
                      Cambiar Estado
                    </button>
                    <button className={`dropdown-item ${theme}`}>Opción 2</button>
                    <button className={`dropdown-item ${theme}`}>Opción 3</button>
                  </div>
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
