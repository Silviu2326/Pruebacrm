import React, { useState, useEffect, useRef } from 'react';
import './widget-facturas.css';
import ModalDeEscaneoDeFacturas from './ModalDeEscaneoDeFacturas';
import NavbarFiltrosFacturas from './NavbarFiltrosFacturas';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import ScanInvoiceForm from './Duplicados/ScanInvoiceForm';
import Modal from './Modal';
import CreacionDeFacturas from './CreacionDeFacturas';

const WidgetFacturas = ({ isEditMode, handleRemoveItem, onTitleClick, theme, setTheme, onOpenCreationModal }) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    cliente: true,
    monto: true,
    fecha: true,
    tipo: true,
    plan: true,
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estatus: '',
    minMonto: '',
    maxMonto: '',
    tipo: '',
    plan: '',
    invoiceDate: '',
    paymentMethod: '',
    total: '',
    type: '',
    personType: '',
    name: '',
    surname: '',
    serviceCode: '',
  });
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [optionsOpenIndex, setOptionsOpenIndex] = useState(null);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState('todos');
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const addButtonRef = useRef(null); // Referencia al botón "Añadir Factura"

  useEffect(() => {
    fetch('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/invoices')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setOriginalData(data); 
        setSelectedItems(new Array(data.length).fill(false));
      })
      .catch(error => {
        console.error('Error al obtener las facturas:', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
  };

  const toggleColumnDropdown = () => {
    setIsColumnDropdownOpen(!isColumnDropdownOpen);
  };

  const toggleOptions = (index) => {
    setOptionsOpenIndex(optionsOpenIndex === index ? null : index);
  };

  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
  };

  const handleAddFactura = (factura) => {
    setData([...data, factura]);
    setOriginalData([...originalData, factura]); 
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

  const handleClearAllFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      estatus: '',
      minMonto: '',
      maxMonto: '',
      tipo: '',
      plan: '',
      invoiceDate: '',
      paymentMethod: '',
      total: '',
      type: '',
      personType: '',
      name: '',
      surname: '',
      serviceCode: '',
    });

    setData(originalData);
    setIsFilterDropdownOpen(false);
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const startDateCondition = filters.startDate ? new Date(item.invoiceDate) >= new Date(filters.startDate) : true;
      const endDateCondition = filters.endDate ? new Date(item.invoiceDate) <= new Date(filters.endDate) : true;
      const minMontoCondition = filters.minMonto ? parseFloat(item.total) >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? parseFloat(item.total) <= parseFloat(filters.maxMonto) : true;
      const tipoCondition = filters.tipo ? item.type === filters.tipo : true;
      const paymentMethodCondition = filters.paymentMethod ? item.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase()) : true;
      const personTypeCondition = filters.personType ? item.personType.toLowerCase().includes(filters.personType.toLowerCase()) : true;
      const nameCondition = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const surnameCondition = filters.surname ? item.surname.toLowerCase().includes(filters.surname.toLowerCase()) : true;
      const serviceCodeCondition = filters.serviceCode ? item.services.some(service => service.serviceCode.toLowerCase().includes(filters.serviceCode.toLowerCase())) : true;

      return startDateCondition && endDateCondition && minMontoCondition && maxMontoCondition && tipoCondition 
        && paymentMethodCondition && personTypeCondition && nameCondition && surnameCondition && serviceCodeCondition;
    });
  };

  const handleApplyFilters = () => {
    const filteredItems = applyFilters(originalData); 
    setData(filteredItems);
    setIsFilterDropdownOpen(false);
  };

  const filteredData = applyFilters(
    data.filter((item) =>
      (selectedInvoiceType === 'todos' || item.type === selectedInvoiceType) &&
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelectAll = () => {
    const newSelectedAll = !selectedAll;
    setSelectedAll(newSelectedAll);
    setSelectedItems(new Array(filteredData.length).fill(newSelectedAll));
  };

  const handleSelectItem = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);

    if (newSelectedItems.includes(false)) {
      setSelectedAll(false);
    } else {
      setSelectedAll(true);
    }
  };

  const handleOpenCreationModal = () => {
    const buttonRect = addButtonRef.current.getBoundingClientRect();
    setDropdownPosition({ top: buttonRect.top - 400, left: buttonRect.left }); // Ajusta la posición para que aparezca arriba
    setIsCreationModalOpen(true);
  };

  const handleCloseCreationModal = () => {
    setIsCreationModalOpen(false);
  };

  return (
    <div className={`WidgetFacturas-widget WidgetFacturas-widget-facturas ${theme}`}>
      <div className="WidgetFacturas-widget-handle"></div>
      <h2 onClick={onTitleClick} className={`widget-title ${theme}`}>Facturas</h2>
      <div className="WidgetFacturas-filter-button">
        <div className="WidgetFacturas-filter-container">
          <input
            type="text"
            placeholder="Filtrar..."
            value={searchTerm}
            onChange={handleFilterChange}
            className={`widget-filter-input ${theme}`}
          />
          <select
            className={`uniquePrefix-Documentos-filter-select ${theme}`}
            value={selectedInvoiceType}
            onChange={(e) => setSelectedInvoiceType(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="escaneada">Facturas Escaneadas</option>
            <option value="made">Facturas Emitidas</option>
          </select>
          <div className="dropdownFilters">
            <button onClick={toggleFilterDropdown} className={`widget-button ${theme}`}>Filtros</button>
            {isFilterDropdownOpen && (
              <div className={`Prevdropdown-content ${theme}`}>
                <div className="Prevprevisiones-filtros">
                  <div className="Prevfilter-field">
                    <label>Fecha de Factura:</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={filters.invoiceDate}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Método de Pago:</label>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={filters.paymentMethod}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Total:</label>
                    <input
                      type="number"
                      name="total"
                      value={filters.total}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Tipo de Factura:</label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    >
                      <option value="">Todos</option>
                      <option value="received">Recibida</option>
                      <option value="made">Emitida</option>
                    </select>
                  </div>
                  <div className="Prevfilter-field">
                    <label>Tipo de Persona:</label>
                    <input
                      type="text"
                      name="personType"
                      value={filters.personType}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={filters.name}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      name="surname"
                      value={filters.surname}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Código de Servicio:</label>
                    <input
                      type="text"
                      name="serviceCode"
                      value={filters.serviceCode}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                </div>
                <button onClick={handleApplyFilters} className={`apply-filters-btn ${theme}`}>Aplicar Filtros</button>
                <button onClick={handleClearAllFilters} className={`clear-filters-btn ${theme}`}>Borrar Filtros</button>
              </div>
            )}
          </div>
        </div>
        <div className="WidgetFacturas-actions">
          {isEditMode && (
            <div className="WidgetFacturas-dropdown-campos">
              <button className={`WidgetFacturas-campos-btn ${theme}`} onClick={toggleColumnDropdown}>Campos</button>
              {isColumnDropdownOpen && (
                <div className={`WidgetFacturas-dropdown-content WidgetFacturas-column-dropdown ${theme}`}>
                  <h3>Seleccionar Campos</h3>
                  {Object.keys(selectedColumns).map(column => (
                    <div key={column} className="WidgetFacturas-dropdown-item">
                      <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                      <button onClick={() => handleColumnToggle(column)}>
                        {selectedColumns[column] ? 'x' : '+'}
                      </button>
                    </div>
                  ))}
                  <button className={`WidgetFacturas-close-dropdown-btn ${theme}`} onClick={toggleColumnDropdown}>Cerrar</button>
                </div>
              )}
            </div>
          )}
          <button className={`WidgetFacturas-scan-btn ${theme}`} onClick={handleOpenScanModal}>Escanear Factura</button>
          <button 
            className={`WidgetFacturas-add-btn ${theme}`} 
            onClick={handleOpenCreationModal} 
            ref={addButtonRef} // Referencia al botón
          >
            Añadir Factura
          </button>
        </div>
      </div>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={selectedColumns}
          handleColumnToggle={handleColumnToggle}
          theme={theme}
        />
      )}
      <NavbarFiltrosFacturas filters={filters} clearFilter={clearFilter} theme={theme} />
      <table className={`WidgetFacturas-facturas-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedAll}
                onChange={handleSelectAll}
              />
            </th>
            {selectedColumns.cliente && <th>Cliente</th>}
            {selectedColumns.monto && <th>Importe</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            {selectedColumns.plan && <th>Plan</th>}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={theme}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems[index]}
                  onChange={() => handleSelectItem(index)}
                />
              </td>
              {selectedColumns.cliente && <td>{item.name || item.companyName}</td>}
              {selectedColumns.monto && <td>{item.total}</td>}
              {selectedColumns.fecha && <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>}
              {selectedColumns.tipo && <td>{item.type === 'made' ? 'Emitida' : 'Escaneada'}</td>}
              {selectedColumns.plan && <td>{item.plan || 'N/A'}</td>}
              <td>
                <div className="WidgetFacturas-dropdown-options">
                  <button onClick={() => toggleOptions(index)}>...</button>
                  {optionsOpenIndex === index && (
                    <div className={`WidgetFacturas-dropdown-content WidgetFacturas-options-dropdown ${theme}`}>
                      {item.type === 'escaneada' && <button>Añadir como Gasto</button>}
                      <button>Opción 1</button>
                      <button>Opción 2</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isScanModalOpen && (
        <Modal closeModal={handleCloseScanModal}>
          <ScanInvoiceForm closeModal={handleCloseScanModal} />
        </Modal>
      )}
      {isCreationModalOpen && (
        <div className="CreacionDeFacturasModal" style={{ 
          position: 'absolute', 
          top: dropdownPosition.top, 
          left: dropdownPosition.left, 
          zIndex: 10000 
        }}>
          <CreacionDeFacturas
            isOpen={isCreationModalOpen}
            closeModal={handleCloseCreationModal}
            theme={theme}
          />
        </div>
      )}
      <ModalDeEscaneoDeFacturas isOpen={isDetailedModalOpen} closeModal={handleCloseDetailedModal} theme={theme} />
    </div>
  );
}

export default WidgetFacturas;
