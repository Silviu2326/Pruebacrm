import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widget-LicenciasDuplicado.css';
import { Download, Trash2 } from 'lucide-react'; // Importamos los iconos necesarios

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

function WidgetLicenciasDuplicado({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    titulo: true,
    fecha: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [licencias, setLicencias] = useState([]); 
  const [selectedLicenses, setSelectedLicenses] = useState([]); // Estado para las licencias seleccionadas
  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox del thead
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false); 
  const [newLicense, setNewLicense] = useState({
    name: '',
    type: '',
    organization: '',
    issueDate: '',
    expirationDate: '',
    attachment: '',
    renewalState: '',
    notes: '',
    reminderDate: '',
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/licenses/`);
        const licensesData = response.data;

        const mappedLicencias = licensesData.map((license) => ({
          id: license._id,
          titulo: license.name,
          fecha: new Date(license.issueDate).toLocaleDateString(),
        }));

        setLicencias(mappedLicencias);
      } catch (error) {
        console.error('Error al obtener las licencias:', error);
      }
    };

    fetchLicenses();
  }, []);

  const filteredLicencias = licencias.filter(licencia =>
    licencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    licencia.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLicencias.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setSelectAll(selectedLicenses.length === currentItems.length && currentItems.length > 0);
  }, [selectedLicenses, currentItems]);

  const totalPages = Math.ceil(filteredLicencias.length / itemsPerPage);

  const handleAddLicense = () => {
    setShowAddLicenseModal(true);
  };

  const handleCloseModal = () => {
    setShowAddLicenseModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLicense({ ...newLicense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/licenses/`, newLicense);

      const createdLicense = response.data;

      setLicencias([
        ...licencias,
        {
          id: createdLicense._id,
          titulo: createdLicense.name,
          fecha: new Date(createdLicense.issueDate).toLocaleDateString(),
        },
      ]);

      setShowAddLicenseModal(false);
      setNewLicense({
        name: '',
        type: '',
        organization: '',
        issueDate: '',
        expirationDate: '',
        attachment: '',
        renewalState: '',
        notes: '',
        reminderDate: '',
      });
    } catch (error) {
      console.error('Error al crear la licencia:', error);
    }
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedLicenses(isChecked ? currentItems.map(item => item.id) : []);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedLicenses.includes(id);
    if (isSelected) {
      setSelectedLicenses(selectedLicenses.filter(licenseId => licenseId !== id));
    } else {
      setSelectedLicenses([...selectedLicenses, id]);
    }
  };

  const handleDownloadLicense = (licenciaId) => {
    console.log(`Descargar licencia con ID: ${licenciaId}`);
    // Lógica para manejar la descarga de la licencia
  };
  
  const handleDeleteLicense = (licenciaId) => {
    console.log(`Borrar licencia con ID: ${licenciaId}`);
    // Lógica para manejar el borrado de la licencia
  };

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Licencias</h2>
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
        {/* 
          Si tienes un componente similar a ColumnDropdown para WidgetLicenciasDuplicado,
          puedes incluirlo aquí de manera correcta.
          
          Por ejemplo:
          {isEditMode && (
            <ColumnDropdown
              selectedColumns={selectedColumns}
              handleColumnToggle={handleColumnToggle}
            />
          )}
        */}
        <button 
          className={`Licencias-add-button ${theme}`} 
          onClick={handleAddLicense}
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
          Añadir Licencia
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
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={handleSelectAllChange} 
              />
            </th>
            {/* Eliminado: Columna de ID */}
            {selectedColumns.titulo && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Título</th>}
            {selectedColumns.fecha && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((licencia, index) => (
            <tr key={licencia.id} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
            }}>
              <td style={{ padding: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedLicenses.includes(licencia.id)} 
                  onChange={() => handleCheckboxChange(licencia.id)} 
                />
              </td>
              {/* Eliminado: Columna de ID */}
              {selectedColumns.titulo && <td style={{ padding: '12px' }}>{licencia.titulo}</td>}
              {selectedColumns.fecha && <td style={{ padding: '12px' }}>{licencia.fecha}</td>}
              <td style={{ padding: '12px' }}>
                <div className="actions-buttons">
                  <button 
                    onClick={() => handleDownloadLicense(licencia.id)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: '10px', 
                      color: theme === 'dark' ? '#fff' : '#000' 
                    }}
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteLicense(licencia.id)} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: '10px', 
                      color: theme === 'dark' ? '#ff4d4f' : '#f5222d' 
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
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
          }}
        >
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
          }}
        >
          Siguiente
        </button>
      </div>

      {showAddLicenseModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${theme}`}>
            <h3>Añadir Nueva Licencia</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nombre"
                  value={newLicense.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipo</label>
                <input
                  type="text"
                  name="type"
                  id="type"
                  placeholder="Tipo"
                  value={newLicense.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="organization">Organización</label>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  placeholder="Organización"
                  value={newLicense.organization}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="issueDate">Fecha de Emisión</label>
                <input
                  type="date"
                  name="issueDate"
                  id="issueDate"
                  placeholder="Fecha de Emisión"
                  value={newLicense.issueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Fecha de Expiración</label>
                <input
                  type="date"
                  name="expirationDate"
                  id="expirationDate"
                  placeholder="Fecha de Expiración"
                  value={newLicense.expirationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="attachment">Adjunto</label>
                <input
                  type="text"
                  name="attachment"
                  id="attachment"
                  placeholder="Adjunto"
                  value={newLicense.attachment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="renewalState">Estado de Renovación</label>
                <input
                  type="text"
                  name="renewalState"
                  id="renewalState"
                  placeholder="Estado de Renovación"
                  value={newLicense.renewalState}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reminderDate">Fecha de Recordatorio</label>
                <input
                  type="date"
                  name="reminderDate"
                  id="reminderDate"
                  placeholder="Fecha de Recordatorio"
                  value={newLicense.reminderDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notas</label>
                <textarea
                  name="notes"
                  id="notes"
                  placeholder="Notas"
                  value={newLicense.notes}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit"
                style={{
                  background:'var(--create-button-bg)', 
                  color:  'var(--button-text-dark)' ,
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '14px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'background 0.3s ease',
                  position: 'static',
                }}
              >
                Añadir Licencia
              </button>
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
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetLicenciasDuplicado;
