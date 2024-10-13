import React, { useState } from 'react';
import './widget-ContratosDuplicado.css';

function WidgetContratosDuplicado({ isEditMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    titulo: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const contratos = [
    { id: 2, titulo: 'Contrato 1', fecha: '2023-01-02' },
    { id: 4, titulo: 'Contrato 2', fecha: '2023-01-04' },
    { id: 6, titulo: 'Contrato 3', fecha: '2023-01-06' },
  ];

  const filteredContratos = contratos.filter(contrato =>
    contrato.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContratos.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);

  return (
    <div className="Contratos-widget">
      <h2>Contratos</h2>
      <div className="Contratos-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="Contratos-filter-input"
        />
      </div>
      <table className="Contratos-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.titulo && <th>Título</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((contrato) => (
            <tr key={contrato.id}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.titulo && <td>{contrato.titulo}</td>}
              {selectedColumns.fecha && <td>{contrato.fecha}</td>}
              <td>
                <div className="Contratos-action-dropdown">
                  <button
                    className="Contratos-action-button"
                    onClick={() => toggleActionDropdown(contrato.id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[contrato.id] && (
                    <div className="Contratos-action-content">
                      <button className="Contratos-action-item">Descargar</button>
                      <button className="Contratos-action-item">Borrar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Contratos-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="Contratos-pagination-button"
        >
          Anterior
        </button>
        <span className="Contratos-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Contratos-pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default WidgetContratosDuplicado;
