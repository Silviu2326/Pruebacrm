import React, { useState, useEffect } from 'react';
import './widget-DocumentosDuplicado.css';
import { Download, Trash2 } from 'lucide-react'; // Importamos los iconos necesarios

function WidgetContratosDuplicado({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    titulo: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContratos, setSelectedContratos] = useState([]); // Estado para los contratos seleccionados
  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox del thead
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

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedContratos(isChecked ? currentItems.map(item => item.id) : []);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedContratos.includes(id);
    if (isSelected) {
      setSelectedContratos(selectedContratos.filter(contratoId => contratoId !== id));
    } else {
      setSelectedContratos([...selectedContratos, id]);
    }
  };

  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);

  // Sincronizar el estado de "selectAll" cuando los contratos seleccionados cambian
  useEffect(() => {
    setSelectAll(selectedContratos.length === currentItems.length && currentItems.length > 0);
  }, [selectedContratos, currentItems]);

  const handleDownloadLicense = (licenciaId) => {
    console.log(`Descargar licencia con ID: ${licenciaId}`);
    // Lógica para manejar la descarga de la licencia
  };
  
  const handleDeleteLicense = (licenciaId) => {
    console.log(`Borrar licencia con ID: ${licenciaId}`);
    // Lógica para manejar el borrado de la licencia
  };

  return (
    <div className={`Contratos-widget ${theme}`}>
      <h2>Contratos</h2>
      <div className="Contratos-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="Contratos-filter-input"
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
      <table className={`Contratos-table ${theme}`} 
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
                checked={selectAll} 
                onChange={handleSelectAllChange} 
              />
            </th>
            {selectedColumns.titulo && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Título</th>}
            {selectedColumns.fecha && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((contrato, index) => (
            <tr key={contrato.id} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
            }}>
              <td style={{ padding: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedContratos.includes(contrato.id)} 
                  onChange={() => handleCheckboxChange(contrato.id)} 
                />
              </td>
              {selectedColumns.titulo && <td style={{ padding: '12px' }}>{contrato.titulo}</td>}
              {selectedColumns.fecha && <td style={{ padding: '12px' }}>{contrato.fecha}</td>}
              <td style={{ padding: '12px' }}>
                <div className="actions-buttons">
                  <button onClick={() => handleDownloadLicense(contrato.id)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '10px', 
                    color: theme === 'dark' ? '#fff' : '#000' 
                  }}>
                    <Download size={16} />
                  </button>
                  <button onClick={() => handleDeleteLicense(contrato.id)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '10px', 
                    color: theme === 'dark' ? '#ff4d4f' : '#f5222d' 
                  }}>
                    <Trash2 size={16} />
                  </button>
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
          style={{
            background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
            color: 'var(--button-text-dark)',
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
        <span className="Contratos-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Contratos-pagination-button"
          style={{
            background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
            color: 'var(--button-text-dark)',
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
    </div>
  );
}

export default WidgetContratosDuplicado;
