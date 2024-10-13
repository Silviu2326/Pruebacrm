import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widget-Documentos.css';
import FormDocumentos from './FormDocumentos';
import DetailedDocumento from './DetailedDocumento';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import { Download, Trash2, Eye } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

function WidgetDocumentos({ isEditMode, onTitleClick, theme, onOpenAddDocumentModal  }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [selectedColumns, setSelectedColumns] = useState({
    titulo: true,
    fecha: true,
    tipo: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [documentos, setDocumentos] = useState([]);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [detailedDocumento, setDetailedDocumento] = useState(null);

  const [selectedDocumentos, setSelectedDocumentos] = useState({});
  const [isSelectAll, setIsSelectAll] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/licenses/`);
        const mappedDocumentos = response.data.map(doc => ({
          id: doc._id,
          titulo: doc.name,
          fecha: new Date(doc.issueDate).toLocaleDateString(),
          tipo: doc.type
        }));
        setDocumentos(mappedDocumentos);
      } catch (error) {
        console.error('Error fetching documentos:', error);
      }
    };

    fetchDocumentos();
  }, []);

  useEffect(() => {
    const allSelected = documentos.length > 0 && documentos.every(doc => selectedDocumentos[doc.id]);
    setIsSelectAll(allSelected);
  }, [selectedDocumentos, documentos]);

  const filteredDocumentos = documentos.filter(documento => {
    const matchesType = filterType === 'todos' || 
      (filterType === 'licencia' && documento.tipo.toLowerCase() === 'software') || 
      documento.tipo?.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = documento.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          documento.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          documento.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

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

  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const handleOpenAddDocumentModal = () => {
    setIsAddDocumentModalOpen(true);
  };

  const handleCloseAddDocumentModal = () => {
    setIsAddDocumentModalOpen(false);
  };

  const handleOpenDetailedDocumento = (documento) => {
    setDetailedDocumento(documento);
    setIsDetailedDocumentoOpen(true);
  };

  const handleCloseDetailedDocumento = () => {
    setIsDetailedDocumentoOpen(false);
    setDetailedDocumento(null);
  };

  const handleSelectAll = () => {
    const newSelected = {};
    if (!isSelectAll) {
      currentItems.forEach(doc => {
        newSelected[doc.id] = true;
      });
    }
    setSelectedDocumentos(newSelected);
    setIsSelectAll(!isSelectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedDocumentos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`uniquePrefix-Documentos-widget uniquePrefix-Documentos-widget-documentos ${theme}`}>
      <div className="uniquePrefix-Documentos-widget-handle"></div>
      <h2 onClick={onTitleClick}>Documentos</h2>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={selectedColumns}
          handleColumnToggle={handleColumnToggle}
        />
      )}
      <div className="uniquePrefix-Documentos-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`uniquePrefix-Documentos-filter-input ${theme}`}
          style={{
            background: 'transparent',
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',  
          }}
        />
        <select 
          onChange={e => setFilterType(e.target.value)} 
          className={`uniquePrefix-Documentos-filter-select ${theme}`}
        >
          <option value="todos">Todos</option>
          <option value="licencia">Licencias</option>
          <option value="contrato">Contratos</option>
        </select>
      </div>
      <button onClick={onOpenAddDocumentModal} className={`uniquePrefix-Documentos-add-button ${theme}`}
      style={{
        background:'var(--create-button-bg)', 
        color:  'var(--button-text-dark)' ,
        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s ease',
      }}
>
        Añadir Documento
      </button>
      <table className={`uniquePrefix-Documentos-table ${theme}`} 
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
    backgroundColor: theme === 'dark' ? '#444444' : 'rgb(38 93 181)',
    borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
}}>
  <tr>
    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>
      <input 
        type="checkbox" 
        checked={isSelectAll} 
        onChange={handleSelectAll} 
      />
    </th>
    {/* Eliminar la columna ID */}
    {/* {selectedColumns.id && <th>ID</th>} */}
    {selectedColumns.titulo && <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Título</th>}
    {selectedColumns.fecha && <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Fecha</th>}
    {selectedColumns.tipo && <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Tipo</th>}
    <th style={{ padding: '12px', textAlign: 'left', color: theme === 'dark' ? 'white' : 'white', fontWeight: 'bold' }}>Acciones</th>
  </tr>
</thead>
<tbody>
  {currentItems.map((documento, index) => (
    <tr key={documento.id} style={{ 
        backgroundColor: theme === 'dark' 
          ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
          : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
    }}>
      <td style={{ padding: '12px' }}>
        <input 
          type="checkbox" 
          checked={!!selectedDocumentos[documento.id]} 
          onChange={() => handleCheckboxChange(documento.id)} 
        />
      </td>
      {/* Eliminar la columna ID */}
      {/* {selectedColumns.id && <td style={{ padding: '12px' }}>{documento.id}</td>} */}
      {selectedColumns.titulo && <td style={{ padding: '12px' }}>{documento.titulo}</td>}
      {selectedColumns.fecha && <td style={{ padding: '12px' }}>{documento.fecha}</td>}
      {selectedColumns.tipo && <td style={{ padding: '12px' }}>{documento.tipo}</td>}
      <td style={{ padding: '12px' }}>
          
              <div className="action-btn">
                <button className="uniquePrefix-Documentos-action-item" onClick={() => handleOpenDetailedDocumento(documento)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><Eye size={16}/></button>
                <button className="uniquePrefix-Documentos-action-item" style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><Download size={16}/></button>
                <button className="uniquePrefix-Documentos-action-item" style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><Trash2 size={16}/></button>
              </div> 
        </td>
    </tr>
  ))}
</tbody>
</table>
      <div className="uniquePrefix-Documentos-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`panelcontrol-nav-button ${theme}`}
          style={{
            background: 'transparent',
            color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
            border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
            padding: '5px 5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '8px',
            transition: 'background 0.3s ease',
          }}>
          &lt;
        </button>
    
          Página {currentPage} de {totalPages}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`panelcontrol-nav-button ${theme}`}
          style={{
            background: 'transparent',
            color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
            border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
            padding: '5px 5px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '8px',
            transition: 'background 0.3s ease',
          }}>
          &gt;
        </button>
      </div>
      
      <FormDocumentos
        isOpen={isAddDocumentModalOpen}
        onClose={handleCloseAddDocumentModal}
        theme={theme}
      />

      {isDetailedDocumentoOpen && detailedDocumento && (
        <DetailedDocumento documento={detailedDocumento} onClose={handleCloseDetailedDocumento} />
      )}
    </div>
  );
}

export default WidgetDocumentos;
