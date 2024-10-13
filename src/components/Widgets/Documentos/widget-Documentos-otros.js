import React, { useState } from 'react';

function WidgetDocumentosOtros({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    nombre: true,
    descripcion: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [documentos, setDocumentos] = useState([]);
  const [showAddDocumentoModal, setShowAddDocumentoModal] = useState(false);
  const [newDocumento, setNewDocumento] = useState({
    nombre: '',
    descripcion: '',
    archivo: null,
  });
  const itemsPerPage = 5;

  const filteredDocumentos = documentos.filter(documento =>
    documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const handleAddDocumento = () => {
    setShowAddDocumentoModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDocumentoModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocumento({ ...newDocumento, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewDocumento({ ...newDocumento, archivo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fechaActual = new Date().toLocaleDateString();
    const nuevoDocumento = {
      id: documentos.length + 1, // Generar un ID simple basado en la longitud del array
      nombre: newDocumento.nombre,
      descripcion: newDocumento.descripcion,
      archivo: newDocumento.archivo,
      archivoURL: URL.createObjectURL(newDocumento.archivo), // Crear una URL para descargar el archivo
      fecha: fechaActual,
    };

    setDocumentos([...documentos, nuevoDocumento]);

    setShowAddDocumentoModal(false);
    setNewDocumento({
      nombre: '',
      descripcion: '',
      archivo: null,
    });
  };

  const handleDownload = (archivoURL, nombre) => {
    const link = document.createElement('a');
    link.href = archivoURL;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Otros Documentos</h2>
      <div className="Licencias-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Licencias-filter-input ${theme}`}
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
        <button className={`Licencias-add-button ${theme}`} onClick={handleAddDocumento}
        style={{
          background:'var(--create-button-bg)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}>
          Añadir Documento
        </button>
      </div>
      <table className={`Licencias-table ${theme}`} 
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
        <input type="checkbox" />
      </th>
      {selectedColumns.nombre && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre</th>}
      {selectedColumns.descripcion && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Descripción</th>}
      {selectedColumns.fecha && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>}
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {currentItems.map((documento, index) => (
      <tr key={documento.id} className={theme} style={{ 
          backgroundColor: theme === 'dark' 
            ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
            : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
      }}>
        <td style={{ padding: '12px' }}>
          <input type="checkbox" />
        </td>
        {selectedColumns.nombre && <td style={{ padding: '12px' }}>{documento.nombre}</td>}
        {selectedColumns.descripcion && <td style={{ padding: '12px' }}>{documento.descripcion}</td>}
        {selectedColumns.fecha && <td style={{ padding: '12px' }}>{documento.fecha}</td>}
        <td style={{ padding: '12px' }}>
          <div className="Licencias-action-dropdown">
            <button 
              className={`Licencias-action-button ${theme}`} 
              onClick={() => toggleActionDropdown(documento.id)}
              style={{
                background: 'var(--create-button-bg)', 
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>
              ...
            </button>
            {actionDropdownOpen[documento.id] && (
              <div className={`Licencias-action-content ${theme}`} style={{ padding: '10px', background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <button 
                  className="Licencias-action-item"
                  onClick={() => handleDownload(documento.archivoURL, documento.nombre)}
                  style={{
                    background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                    color: 'var(--button-text-dark)',
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Descargar
                </button>
                <button 
                  className="Licencias-action-item"
                  style={{
                    background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--button-bg-light)',
                    color: 'var(--button-text-dark)',
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Borrar
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      <div className="Licencias-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="Licencias-pagination-button"
          style={{
            background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}>
          Anterior
        </button>
        <span className="Licencias-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Licencias-pagination-button"
          style={{
            background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}>
          Siguiente
        </button>
      </div>

      {showAddDocumentoModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${theme}`}>
            <h3>Añadir Nuevo Documento</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre"
                  value={newDocumento.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  placeholder="Descripción"
                  value={newDocumento.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="archivo">Subir Archivo</label>
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit"
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Añadir Documento</button>
              <button type="button" onClick={handleCloseModal}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetDocumentosOtros;
