import React, { useState, useEffect } from 'react';
import './WidgetPrevisionesPopup.css';
import axios from 'axios';
import { Edit3, CheckCircle, CreditCard, Banknote, DollarSign } from 'lucide-react'; // Importar íconos de lucide-react

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const WidgetPrevisionesPopup = ({ theme, setTheme, setIngresosEsperados }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [activeModalRow, setActiveModalRow] = useState(null); // Control del dropdown de Confirmar
  const [newIngreso, setNewIngreso] = useState({
    numero: '',
    fecha: '',
    monto: '',
    pagadoPor: '',
    metodo: '',
    estatus: ''
  });

  // Hacer una solicitud para obtener los ingresos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/incomes/`);
        setData(response.data);
        setIngresosEsperados(response.data); // Actualiza el estado en el componente padre si es necesario
      } catch (error) {
        console.error('Error al cargar los ingresos:', error);
      }
    };
    fetchData();
  }, [setIngresosEsperados]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleStatusChange = (index, metodoPago = '') => {
    const newData = [...data];

    if (metodoPago) {
      // Si se selecciona un método de pago, se marca como completado
      newData[index].estadoPago = 'completado';
      newData[index].metodoPago = metodoPago;
    } else {
      // Si no se selecciona método de pago, alterna el estado
      newData[index].estadoPago = 'pendiente';
      newData[index].metodoPago = ''; // Limpiar método si se cambia a Pendiente
    }

    setData(newData);
    setIngresosEsperados(newData);
    setActiveModalRow(null); // Cierra el dropdown
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const toggleIngresoDropdown = () => {
    // Tu lógica existente para el dropdown de agregar ingresos
  };

  return (
    <div className={`popup-widget-previsiones ${theme}`}>
      <h3 className="popup-previsiones-title">Ingresos</h3>
      <div className="controls">
        <input
          type="text"
          placeholder="Buscar previsión..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className={`${theme}`}
        />
        <div className="ingreso-button-container">
          <div className="dropdown">
            <button
              className={`dropdown-toggle ${theme}`}
              onClick={toggleIngresoDropdown}
              style={{
                background: 'var(--create-button-bg)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Añadir Ingreso Especial
            </button>
          </div>
        </div>
      </div>
      <table className={`WidgetPagos-table ${theme}`} style={{
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
            {/* Eliminada la columna "Número" */}
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Importe</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Pagado por</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Método</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Estatus</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item._id} className={theme} style={{
              backgroundColor: theme === 'dark'
                ? (index % 2 === 0 ? '#333' : '#444')
                : (index % 2 === 0 ? '#f9f9f9' : '#ffffff')
            }}>
              <td style={{ padding: '12px' }}>
                <input type="checkbox" />
              </td>
              {/* Eliminada la celda "Número" */}
              <td style={{ padding: '12px' }}>{new Date(item.fecha).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>{item.cantidad}</td>
              <td style={{ padding: '12px' }}>{item.cliente?.nombre}</td>
              <td style={{ padding: '12px' }}>{item.metodoPago || '---'}</td>
              <td style={{ padding: '12px' }}>{item.estadoPago}</td>
              <td style={{ padding: '12px', position: 'relative' }}>
                {item.estadoPago === 'completado' ? (
                  <button
                    onClick={() => handleStatusChange(index)}
                    className="edit-btn"
                    style={{
                      background: 'var(--button-bg)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={16} /> Editar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveModalRow(index)}
                      className="confirm-btn"
                      style={{
                        backgroundColor: 'var(--button-bg)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      <CheckCircle size={16} /> Confirmar
                    </button>

                    {activeModalRow === index && (
                      <div className="modal-overlay" onClick={() => setActiveModalRow(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                          <h3>Seleccione el Método de Pago</h3>
                          <button
                            onClick={() => handleStatusChange(index, 'stripe')}
                            className="modal-option"
                          >
                            <CreditCard size={16} /> Stripe
                          </button>
                          <button
                            onClick={() => handleStatusChange(index, 'banco')}
                            className="modal-option"
                          >
                            <Banknote size={16} /> Banco
                          </button>
                          <button
                            onClick={() => handleStatusChange(index, 'efectivo')}
                            className="modal-option"
                          >
                            <DollarSign size={16} /> Efectivo
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WidgetPrevisionesPopup;
