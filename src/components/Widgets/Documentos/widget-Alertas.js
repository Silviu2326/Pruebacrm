import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WidgetAlertas({ theme }) {
  const [alertas, setAlertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [editAlertId, setEditAlertId] = useState(null); // Para saber cuál alerta estamos editando
  const [newDisplayDate, setNewDisplayDate] = useState(''); // Nueva fecha de visualización
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await axios.get('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas');
        const alertasLicencia = response.data.filter(alerta => alerta.tipo === 'licencia');
        setAlertas(alertasLicencia);
      } catch (error) {
        console.error('Error al cargar las alertas:', error);
      }
    };

    fetchAlertas();
  }, []);

  const handleUpdateDisplayDate = async (id) => {
    try {
      await axios.put(`https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/${id}`, {
        displayDate: new Date(newDisplayDate).toISOString()
      });
      // Actualizar la lista de alertas con la nueva fecha
      setAlertas(alertas.map(alerta => 
        alerta._id === id ? { ...alerta, displayDate: newDisplayDate } : alerta
      ));
      setEditAlertId(null);
      setNewDisplayDate('');
    } catch (error) {
      console.error('Error al actualizar la fecha de visualización:', error);
    }
  };

  const handleDeleteAlerta = async (id) => {
    try {
      await axios.delete(`https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/${id}`);
      // Actualizar la lista de alertas eliminando la alerta borrada
      setAlertas(alertas.filter(alerta => alerta._id !== id));
    } catch (error) {
      console.error('Error al borrar la alerta:', error);
    }
  };

  const filteredAlertas = alertas.filter(alerta =>
    alerta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(alerta.alertDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlertas.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredAlertas.length / itemsPerPage);

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Alertas de Licencias</h2>
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
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Título</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha de Alerta</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha de Recordatorio</th>
      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {currentItems.map((alerta, index) => (
      <tr key={alerta._id} className={theme} style={{ 
          backgroundColor: theme === 'dark' 
            ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
            : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
      }}>
        <td style={{ padding: '12px' }}>
          <input type="checkbox" />
        </td>
        <td style={{ padding: '12px' }}>{alerta.title}</td>
        <td style={{ padding: '12px' }}>{new Date(alerta.alertDate).toLocaleDateString()}</td>
        <td style={{ padding: '12px' }}>
          {editAlertId === alerta._id ? (
            <input
              type="date"
              value={newDisplayDate}
              onChange={e => setNewDisplayDate(e.target.value)}
              onBlur={() => handleUpdateDisplayDate(alerta._id)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            new Date(alerta.displayDate).toLocaleDateString()
          )}
        </td>
        <td style={{ padding: '12px' }}>
          <div className="Licencias-action-dropdown">
            <button 
              className={`Licencias-action-button ${theme}`} 
              onClick={() => toggleActionDropdown(alerta._id)}
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
            {actionDropdownOpen[alerta._id] && (
              <div className={`Licencias-action-content ${theme}`} style={{ padding: '10px', background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <button 
                  className="Licencias-action-item"
                  onClick={() => setEditAlertId(alerta._id)}
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
                  Editar Fecha
                </button>
                <button 
                  className="Licencias-action-item"
                  onClick={() => handleDeleteAlerta(alerta._id)}
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
    </div>
  );
}

export default WidgetAlertas;
