import React, { useState, useEffect } from 'react';
import './TablaplanesclienteDuplicado.css';
import Modalcreacionplanes from './ModalcreacionplanesDuplicado';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import AsociarClientesDropdown from './AsociarClientesDropdown';
import { Edit, Trash2, UserPlus } from 'lucide-react'; // Importamos los íconos necesarios

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const TablaPlanesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    clientes: true,
    precio: true,
    tipoPlan: true,
  });
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAsociarClientes, setShowAsociarClientes] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const [planesFijosResponse, planesVariablesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/plans/fixed/`),
          fetch(`${API_BASE_URL}/plans/variable/`)
        ]);

        if (!planesFijosResponse.ok || !planesVariablesResponse.ok) {
          throw new Error('Error al obtener los planes');
        }

        const [planesFijos, planesVariables] = await Promise.all([
          planesFijosResponse.json(),
          planesVariablesResponse.json()
        ]);

        const combinedData = [
          ...planesFijos.map(plan => ({
            id: plan._id,
            nombre: plan.name,
            clientes: plan.client ? 1 : 0,
            precio: `$${plan.rate}/mes`,
            tipoPlan: 'Fijo',
          })),
          ...planesVariables.map(plan => ({
            id: plan._id,
            nombre: plan.name,
            clientes: plan.client ? 1 : 0,
            precio: `$${plan.hourlyRate}/hora`,
            tipoPlan: 'Variable',
          }))
        ];

        setData(combinedData);
        setSelectedRows(new Array(combinedData.length).fill(false));
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      }
    };

    fetchPlanes();
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

  const handleOpenCreatePlanModal = () => {
    setShowCreatePlanModal(true);
  };

  const handleCloseCreatePlanModal = () => {
    setShowCreatePlanModal(false);
  };

  const handleAsociarClientes = (plan) => {
    setSelectedPlan(plan);
    setShowAsociarClientes(true);
  };

  const handleCloseAsociarClientes = () => {
    setShowAsociarClientes(false);
    setSelectedPlan(null);
  };

  const handleTradeClientes = (clientesAsociadosIds, clientesNoAsociadosIds) => {
    const updatedClientes = clientes.map(cliente => {
      if (clientesAsociadosIds.includes(cliente.id)) {
        return { ...cliente, plan: null };
      }
      if (clientesNoAsociadosIds.includes(cliente.id)) {
        return { ...cliente, plan: selectedPlan.nombre };
      }
      return cliente;
    });

    setClientes(updatedClientes);
  };

  const clientesAsociados = clientes.filter(cliente => cliente.plan === selectedPlan?.nombre);
  const clientesNoAsociados = clientes.filter(cliente => cliente.plan !== selectedPlan?.nombre);

  return (
    <div className={`TablaplanesclienteDup-container ${theme}`}>
      <h2 className={theme}>Planes</h2>
      <div className="Tablaplanescliente-controls">
        <input
          type="text"
          placeholder="Buscar plan..."
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
        <div className="Tablaplanescliente-button-group">
          <button className={`button-${theme}`} onClick={handleOpenCreatePlanModal}
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
            Crear Plan
          </button>
        </div>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>
      <table className={`WidgetPlanes-table ${theme}`} 
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
            {visibleColumns.nombre && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre del Plan</th>}
            {visibleColumns.clientes && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Clientes</th>}
            {visibleColumns.precio && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Precio</th>}
            {visibleColumns.tipoPlan && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tipo de Plan</th>}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={theme} style={{ 
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
              {visibleColumns.clientes && <td style={{ padding: '12px' }}>{item.clientes}</td>}
              {visibleColumns.precio && <td style={{ padding: '12px' }}>{item.precio}</td>}
              {visibleColumns.tipoPlan && <td style={{ padding: '12px' }}>{item.tipoPlan}</td>}
              <td style={{ padding: '12px' }}>
                <div className="actions-buttons">
                  <button onClick={() => handleAsociarClientes(item)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)' 
                  }}>
                    <UserPlus size={16} />
                  </button>

                  <button onClick={() => console.log('Edit plan', item)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)' 
                  }}>
                    <Edit size={16} />
                  </button>

                  <button onClick={() => console.log('Delete plan', item)} style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'red' 
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreatePlanModal && (
        <Modalcreacionplanes onClose={handleCloseCreatePlanModal} />
      )}
      {showAsociarClientes && (
        <div className="Tablaplanescliente-popup">
          <div className={`Tablaplanescliente-popup-content ${theme}`}>
            <AsociarClientesDropdown
              plan={selectedPlan}
              clientes={clientesAsociados}
              clientesNoAsociados={clientesNoAsociados}
              onTrade={handleTradeClientes}
            />
            <button onClick={handleCloseAsociarClientes}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPlanesDuplicado;
