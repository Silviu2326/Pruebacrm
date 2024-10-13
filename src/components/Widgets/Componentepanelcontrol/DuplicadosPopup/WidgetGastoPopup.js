import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WidgetGastoPopup.css';
import { Receipt } from 'lucide-react'; // Importar el ícono

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const WidgetGastoPopup = ({ theme, setTheme }) => {
  const [data, setData] = useState([]); 
  const [filterText, setFilterText] = useState('');
  const [isGastoDropdownOpen, setIsGastoDropdownOpen] = useState(false);
  const [newGasto, setNewGasto] = useState({
    concept: '',
    description: '',
    category: '',
    amount: '',
    status: '',
    date: '',
    frequency: '',
    duration: '',
    client: '',
    plan: '',
    planType: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/expenses/`);
        setData(response.data);
      } catch (error) {
        console.error('Error al cargar los gastos:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    newData[index].status = newData[index].status === 'Pagado' ? 'Pendiente' : 'Pagado';
    setData(newData);
  };

  const toggleGastoDropdown = () => {
    setIsGastoDropdownOpen(!isGastoDropdownOpen);
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNewGasto({ ...newGasto, [name]: value });
  };

  const handleAddGasto = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/expenses/`, newGasto);
      setData([...data, response.data]);
      setNewGasto({
        concept: '',
        description: '',
        category: '',
        amount: '',
        status: '',
        date: '',
        frequency: '',
        duration: '',
        client: '',
        plan: '',
        planType: ''
      });
      setIsGastoDropdownOpen(false);
    } catch (error) {
      console.error('Error al añadir el gasto:', error);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`popup-widget-gasto ${theme}`}>
      <h3 className="popup-gasto-title">Gastos</h3>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar gasto..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`${theme} popup-filter-input`}
        />
        <div className="gasto-button-container">
          <div className="dropdown">
            <button onClick={toggleGastoDropdown} className={`add-gasto-button ${theme}`}
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
              Añadir Gasto
            </button>
            {isGastoDropdownOpen && (
              <div className={`dropdown-content ${theme}`}>
                <h3>Añadir Gasto</h3>
                <form onSubmit={handleAddGasto}>
                  <input 
                    type="text" 
                    name="concept" 
                    placeholder="Concepto" 
                    value={newGasto.concept} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="description" 
                    placeholder="Descripción" 
                    value={newGasto.description} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="category" 
                    placeholder="Categoría" 
                    value={newGasto.category} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <input 
                    type="number" 
                    name="amount" 
                    placeholder="Importe" 
                    value={newGasto.amount} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="status" 
                    placeholder="Estado" 
                    value={newGasto.status} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <input 
                    type="date" 
                    name="date" 
                    placeholder="Fecha" 
                    value={newGasto.date} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                    required
                  />
                  <select 
                    name="frequency" 
                    value={newGasto.frequency} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                  >
                    <option value="">Frecuencia</option>
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                  <input 
                    type="number" 
                    name="duration" 
                    placeholder="Duración (meses)" 
                    value={newGasto.duration} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                  />
                  <input 
                    type="text" 
                    name="client" 
                    placeholder="ID Cliente" 
                    value={newGasto.client} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                  />
                  <input 
                    type="text" 
                    name="plan" 
                    placeholder="ID Plan" 
                    value={newGasto.plan} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                  />
                  <select 
                    name="planType" 
                    value={newGasto.planType} 
                    onChange={handleGastoChange} 
                    className={`input-field ${theme}`}
                  >
                    <option value="">Tipo de Plan</option>
                    <option value="FixedPlan">Plan Fijo</option>
                    <option value="VariablePlan">Plan Variable</option>
                  </select>
                  <button type="submit" className={`submit-button ${theme}`}>Añadir</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <table className={`WidgetConceptos-table ${theme}`} 
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
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}></th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Concepto</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Descripción</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Categoría</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Importe</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Frecuencia</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Duración</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>ID Cliente</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>ID Plan</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tipo de Plan</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Alternar colores en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Alternar colores en modo claro
            }}>
              <td style={{ padding: '12px' }}>
                <input type="checkbox" />
              </td>
              <td style={{ padding: '12px' }}>{item.concept}</td>
              <td style={{ padding: '12px' }}>{item.description}</td>
              <td style={{ padding: '12px' }}>{item.category}</td>
              <td style={{ padding: '12px' }}>{item.amount}</td>
              <td style={{ padding: '12px' }}>{item.status}</td>
              <td style={{ padding: '12px' }}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>{item.frequency}</td>
              <td style={{ padding: '12px' }}>{item.duration}</td>
              <td style={{ padding: '12px' }}>{item.client}</td>
              <td style={{ padding: '12px' }}>{item.plan}</td>
              <td style={{ padding: '12px' }}>{item.planType}</td>
              <td style={{ padding: '12px' }}>
                <div className="WGP-action-btn">
                  <button 
                    className={`action-button ${theme}`} 
                    onClick={() => handleChangeStatus(index)}
                    title="Cambiar Estado"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text)', 
                      padding: '3px',
                    }}
                  >
                    <Receipt size={16} />
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

export default WidgetGastoPopup;
