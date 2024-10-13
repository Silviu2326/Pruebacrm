import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TablaplanesclienteDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import { UserPlus, Eye } from 'lucide-react'; // Importamos los íconos necesarios

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const TablaClientesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    email: true,
    telefono: true,
    plan: true,
  });

  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox del thead
  const [selectedRows, setSelectedRows] = useState([]); // Estado para checkboxes de cada fila

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes/`);
        const clientes = response.data;

        const mappedClientes = clientes.map(cliente => ({
          id: cliente._id, // Puedes mantener el ID en los datos si lo necesitas internamente
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          plan: cliente.plan || 'Sin plan',
        }));

        setData(mappedClientes);
        setSelectedRows(new Array(mappedClientes.length).fill(false)); // Inicializar estado de checkboxes
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedRows(new Array(data.length).fill(isChecked));
  };

  const handleRowCheckboxChange = (index) => {
    const updatedSelectedRows = [...selectedRows];
    updatedSelectedRows[index] = !updatedSelectedRows[index];
    setSelectedRows(updatedSelectedRows);

    if (!updatedSelectedRows[index]) {
      setSelectAll(false);
    } else if (updatedSelectedRows.every(row => row)) {
      setSelectAll(true);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`TablaplanesclienteDup-container ${theme}`}>
      <h2 className={theme}>Clientes</h2>
      <div className="Tablaplanescliente-controls">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={filterText}
          onChange={handleFilterChange}
          className={`input-${theme}`}
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
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>
      <table className={`WidgetClientes-table ${theme}`} 
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
            {visibleColumns.nombre && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre</th>}
            {visibleColumns.email && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Email</th>}
            {visibleColumns.telefono && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Teléfono</th>}
            {visibleColumns.plan && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Plan</th>}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id} className={theme} style={{ 
              backgroundColor: theme === 'dark'
                ? (index % 2 === 0 ? '#333' : '#444')
                : (index % 2 === 0 ? '#f9f9f9' : '#ffffff')
            }}>
              <td style={{ padding: '12px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows[index]}
                  onChange={() => handleRowCheckboxChange(index)}
                />
              </td>
              {visibleColumns.nombre && <td style={{ padding: '12px' }}>{item.nombre}</td>}
              {visibleColumns.email && <td style={{ padding: '12px' }}>{item.email}</td>}
              {visibleColumns.telefono && <td style={{ padding: '12px' }}>{item.telefono}</td>}
              {visibleColumns.plan && <td style={{ padding: '12px' }}>{item.plan}</td>}
              <td style={{ padding: '12px' }}>
                <div className="actions-buttons">
                  <button onClick={() => console.log('Asociar/Cambiar Plan', item)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)' 
                  }}>
                    <UserPlus size={16} />
                  </button>

                  <button onClick={() => console.log('Ver Historial de Planes', item)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)' 
                  }}>
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaClientesDuplicado;
