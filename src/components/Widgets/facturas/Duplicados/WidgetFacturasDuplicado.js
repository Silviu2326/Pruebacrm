import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacturasActionButtons from './FacturasActionButtons';
import InvoiceForm from './InvoiceForm';
import ScanInvoiceForm from './ScanInvoiceForm';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './widget-FacturasDuplicado.css';
import { Eye, Receipt } from 'lucide-react'; // Importar los íconos

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

function WidgetFacturasDuplicado({ isEditMode, theme, onTabChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    estado: true,
    cliente: true,
    monto: true,
    fecha: true,
    tipo: true,
    numeroFactura: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShowInvoiceModalOpen, setIsShowInvoiceModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false); // Estado para el checkbox global
  const [selectedItems, setSelectedItems] = useState([]); // Estado para los checkboxes individuales
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/invoices`);
        setInvoices(response.data);
        setSelectedItems(new Array(response.data.length).fill(false)); // Inicializar estado para los checkboxes
      } catch (error) {
        setError('Error al obtener las facturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredData = invoices.filter(
    item =>
      (item.companyName && item.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.total && item.total.toString().includes(searchTerm.toLowerCase())) ||
      (item.invoiceDate && new Date(item.invoiceDate).toLocaleDateString().includes(searchTerm)) ||
      (item.type && (item.type === 'made' ? 'Emitida' : 'Escaneada').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const toggleActionDropdown = id => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id],
    });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleScanClick = () => {
    setIsScanModalOpen(true);
  };

  const handleOpenClick = () => {
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const closeScanModal = () => {
    setIsScanModalOpen(false);
  };

  const openShowInvoiceModal = async (invoice) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/invoices/download/${invoice._id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
      setSelectedInvoice(invoice);
      setIsShowInvoiceModalOpen(true);
    } catch (error) {
      console.error('Error al obtener el PDF de la factura:', error);
    }
  };

  const closeShowInvoiceModal = () => {
    setIsShowInvoiceModalOpen(false);
    setSelectedInvoice(null);
    setPdfUrl('');
  };

  const handleEconomiaTabClick = () => {
    onTabChange('Panel de Control');
  };

  // Manejo del checkbox global
  const handleSelectAll = () => {
    const newSelectedAll = !selectedAll;
    setSelectedAll(newSelectedAll);
    setSelectedItems(new Array(currentItems.length).fill(newSelectedAll));
  };

  // Manejo del checkbox individual
  const handleSelectItem = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);

    // Desmarcar el checkbox global si alguno individual está desmarcado
    if (newSelectedItems.includes(false)) {
      setSelectedAll(false);
    } else {
      setSelectedAll(true);
    }
  };

  // Función para manejar el cambio de estado de la factura
  const handleChangeStatus = (index) => {
    // Lógica para cambiar el estado de la factura
    // Por ejemplo, alternar entre "Pagada" y "Pendiente"
    const updatedInvoices = [...invoices];
    // Asumiendo que el campo de estado se llama 'estado'
    updatedInvoices[index].estado = updatedInvoices[index].estado === 'Pagada' ? 'Pendiente' : 'Pagada';
    setInvoices(updatedInvoices);
  };

  if (loading) {
    return <div className={`WidgetFacturasDuplicado-widget ${theme}`}>Cargando...</div>;
  }

  if (error) {
    return <div className={`WidgetFacturasDuplicado-widget ${theme}`}>{error}</div>;
  }

  return (
    <div className={`WidgetFacturasDuplicado-widget ${theme}`}>
      <FacturasActionButtons onScanClick={handleScanClick} onOpenClick={handleOpenClick} />
      <div className="WidgetFacturasDuplicado-filter-container">
        <h2>Facturas</h2>
        <input
          type="text"
          placeholder="Filtrar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`WidgetFacturasDuplicado-filter-input ${theme}`}
          style={{
            background: 'var(--search-button-bg)',
            border: '1px solid var(--button-border)',
            padding: '5px',
            height: '44px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s',
            textAlign: 'left',
          }}
        />
      </div>

      <table className={`WidgetFacturasDuplicado-table ${theme}`} 
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
            backgroundColor: theme === 'dark' ? 'rgb(68, 68, 68)' : 'rgb(38 93 181)',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
        }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={selectedAll}
                onChange={handleSelectAll}
              />
            </th>
            {selectedColumns.cliente && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Cliente</th>}
            {selectedColumns.monto && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Importe</th>}
            {selectedColumns.fecha && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>}
            {selectedColumns.tipo && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tipo</th>}
            {selectedColumns.numeroFactura && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Número de Factura</th>}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
            }}>
              <td style={{ padding: '12px' }}>
                <input
                  type="checkbox"
                  checked={selectedItems[index]}
                  onChange={() => handleSelectItem(index)}
                />
              </td>
              {selectedColumns.cliente && <td style={{ padding: '12px' }}>{item.companyName || item.name}</td>}
              {selectedColumns.monto && <td style={{ padding: '12px' }}>{item.total.toFixed(2)}</td>}
              {selectedColumns.fecha && <td style={{ padding: '12px' }}>{new Date(item.invoiceDate).toLocaleDateString()}</td>}
              {selectedColumns.tipo && <td style={{ padding: '12px' }}>{item.type === 'made' ? 'Emitida' : 'Escaneada'}</td>}
              {selectedColumns.numeroFactura && <td style={{ padding: '12px' }}>{item.invoiceNumber}</td>}
              <td style={{ padding: '12px' }}>
                <div className="WidgetFacturasDuplicado-action-btn">
                  {/* Botón para cambiar el estado utilizando el ícono Receipt */}
                  <button 
                    className="WidgetFacturasDuplicado-action-item"
                    onClick={() => handleChangeStatus(index)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text)', 
                      padding: '3px',
                    }}
                    title="Cambiar Estado"
                  >
                    <Receipt size={16} />
                  </button>
                  {/* Botón para mostrar la factura utilizando el ícono Eye */}
                  <button 
                    className="WidgetFacturasDuplicado-action-item"
                    onClick={() => openShowInvoiceModal(item)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text)', 
                      padding: '3px',
                    }}
                    title="Mostrar Factura"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="WidgetFacturasDuplicado-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`WidgetFacturasDuplicado-pagination-button ${theme}`}
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
        >
          Anterior
        </button>
        <span className={`WidgetFacturasDuplicado-pagination-info ${theme}`}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`WidgetFacturasDuplicado-pagination-button ${theme}`}
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
        >
          Siguiente
        </button>
      </div>

      {/* Pop-up para el formulario de escanear factura */}
      {isScanModalOpen && (
        <div className="WidgetFacturasDuplicado-popup-overlay">
          <div className="WidgetFacturasDuplicado-popup-content">
            <ScanInvoiceForm closeModal={closeScanModal} />
          </div>
        </div>
      )}

      {/* Pop-up para el formulario de abrir factura */}
      {isInvoiceModalOpen && (
        <div className="WidgetFacturasDuplicado-popup-overlay">
          <div className="WidgetFacturasDuplicado-popup-content">
            <InvoiceForm closeModal={closeInvoiceModal} />
          </div>
        </div>
      )}

      {/* Modal para mostrar la factura seleccionada */}
      {isShowInvoiceModalOpen && (
        <div className="WidgetFacturasDuplicado-modal-overlay">
          <div className={`WidgetFacturasDuplicado-modal ${theme}`}>
            <button className={`WidgetFacturasDuplicado-modal-close-button ${theme}`} onClick={closeShowInvoiceModal}>Cerrar</button>
            {pdfUrl && (
              <div>
                <h2>Factura {selectedInvoice.invoiceNumber}</h2>
                <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetFacturasDuplicado;
