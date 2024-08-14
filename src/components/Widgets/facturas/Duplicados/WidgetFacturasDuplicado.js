// src/components/WidgetFacturasDuplicado.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacturasActionButtons from './FacturasActionButtons';
import InvoiceForm from './InvoiceForm';
import ScanInvoiceForm from './ScanInvoiceForm';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './widget-FacturasDuplicado.css';

function WidgetFacturasDuplicado({ isEditMode, theme }) {
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
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/invoices');
        setInvoices(response.data);
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
      item.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.monto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase())
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
      const response = await axios.get(`http://localhost:5005/api/invoices/download/${invoice._id}`, {
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

  if (loading) {
    return <div className={`Facturas-widget ${theme}`}>Cargando...</div>;
  }

  if (error) {
    return <div className={`Facturas-widget ${theme}`}>{error}</div>;
  }

  return (
    <div className={`Facturas-widget ${theme}`}>
      <FacturasActionButtons onScanClick={handleScanClick} onOpenClick={handleOpenClick} />
      <div className="Facturas-filter-container">
        <h2>Facturas</h2>
        <input
          type="text"
          placeholder="Filtrar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Facturas-filter-input ${theme}`}
        />
      </div>
      <table className={`Facturas-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.estado && <th>Estado</th>}
            {selectedColumns.cliente && <th>Cliente</th>}
            {selectedColumns.monto && <th>Monto</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            {selectedColumns.numeroFactura && <th>Número de Factura</th>}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.estado && <td>{item.estado}</td>}
              {selectedColumns.cliente && <td>{item.cliente}</td>}
              {selectedColumns.monto && <td>{item.monto}</td>}
              {selectedColumns.fecha && <td>{item.fecha}</td>}
              {selectedColumns.tipo && <td>{item.tipo}</td>}
              {selectedColumns.numeroFactura && <td>{item.numeroFactura}</td>}
              <td>
                <div className="Facturas-action-dropdown">
                  <button
                    className="Facturas-action-button"
                    onClick={() => toggleActionDropdown(index)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[index] && (
                    <div className="Facturas-action-content">
                      {item.tipo === 'Factura Recibida' && (
                        <button className="Facturas-action-item">Añadir como Gasto</button>
                      )}
                      <button className="Facturas-action-item" onClick={() => openShowInvoiceModal(item)}>Mostrar Factura</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Facturas-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="Facturas-pagination-button"
        >
          Anterior
        </button>
        <span className="Facturas-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Facturas-pagination-button"
        >
          Siguiente
        </button>
      </div>

      {isInvoiceModalOpen && (
        <div className="WFacturas-modal-overlay">
          <div className="WFacturas-modal">
            <button className="WFacturas-modal-close-button" onClick={closeInvoiceModal}>Cerrar</button>
            <InvoiceForm closeModal={closeInvoiceModal} />
          </div>
        </div>
      )}

      {isScanModalOpen && (
        <div className="WFacturas-modal-overlay">
          <div className="WFacturas-modal">
            <button className="WFacturas-modal-close-button" onClick={closeScanModal}>Cerrar</button>
            <ScanInvoiceForm closeModal={closeScanModal} />
          </div>
        </div>
      )}

      {isShowInvoiceModalOpen && (
        <div className="WFacturas-modal-overlay">
          <div className="WFacturas-modal">
            <button className="WFacturas-modal-close-button" onClick={closeShowInvoiceModal}>Cerrar</button>
            {pdfUrl && (
              <div>
                <h2>Factura {selectedInvoice.numeroFactura}</h2>
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
