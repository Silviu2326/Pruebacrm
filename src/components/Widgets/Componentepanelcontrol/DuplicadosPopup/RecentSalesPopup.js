import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSalesPopup.css';
import { User, Eye, Copy } from 'lucide-react'; // Importar los íconos

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

function RecentSalesPopup({ detailed, theme, setTheme }) {
  const [filterInput, setFilterInput] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Función para formatear moneda en euros
  const formatCurrency = (value) => {
    if (isNaN(value)) return 'Cantidad Inválida';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const columns = React.useMemo(() => [
    {
      Header: 'Seleccionar',
      id: 'selection',
      Cell: ({ row }) => (
        <input type="checkbox" {...row.getToggleRowSelectedProps()} />
      ),
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
      ),
    },
    {
      Header: 'Estado',
      accessor: 'estadoPago',
      Cell: ({ value }) => {
        const status = {
          pendiente: 'Pendiente',
          completado: 'Completado',
          fallido: 'Fallido'
        };
        return status[value] || 'Desconocido';
      }
    },
    {
      Header: 'Correo Electrónico',
      accessor: 'cliente.email',
    },
    {
      Header: 'Cantidad',
      accessor: 'cantidad',
      Cell: ({ value }) => (
        <div className="text-center font-medium">{formatCurrency(value)}</div>
      ),
    },
    {
      Header: 'Acciones',
      Cell: ({ row }) => (
        <div className="RSD-action-btns">
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text)', 
              padding: '3px',
            }}
            onClick={() => handleCopyId(row.original.id)}
            title="Copiar ID de Pago"
          >
            <Copy size={16} />
          </button>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text)', 
              padding: '3px',
            }}
            onClick={() => handleViewClient(row.original.cliente)}
            title="Ver Cliente"
          >
            <User size={16} />
          </button>
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text)', 
              padding: '3px',
            }}
            onClick={() => handleViewPaymentDetails(row.original)}
            title="Ver Detalles del Pago"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/incomes/`);
        const result = response.data;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const filteredData = result.filter(item => {
          const itemDate = new Date(item.fecha);
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();

          return (
            (itemYear === currentYear && (itemMonth === currentMonth || itemMonth === currentMonth - 1)) ||
            (itemMonth === 11 && itemYear === currentYear - 1 && currentMonth === 0)
          );
        });

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setFilter,
    allColumns,
    state: { pageIndex, selectedRowIds },
    pageOptions,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = tableInstance;

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter('cliente.email', value);
    setFilterInput(value);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Funciones para manejar las acciones
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => {
        alert('ID de Pago copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar el ID: ', err);
      });
  };

  const handleViewClient = (cliente) => {
    // Implementa la lógica para ver el cliente
    console.log('Ver cliente:', cliente);
    // Por ejemplo, podrías redirigir a una página de detalles del cliente
  };

  const handleViewPaymentDetails = (pago) => {
    // Implementa la lógica para ver los detalles del pago
    console.log('Ver detalles del pago:', pago);
    // Por ejemplo, podrías abrir un modal con más información
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  return (
    <div className={`popup-recent-sales ${detailed ? 'detailed' : ''} ${isExpanded ? 'expanded' : 'collapsed'} ${theme}`}>
      <div className="popup-recent-sales-header">
        <h3 className="popup-letras">Ventas Recientes</h3>
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Filtrar correos electrónicos..."}
          className="popup-filter-input"
        />
      </div>
      <table {...getTableProps()} className="popup-sales-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="table-header"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!isExpanded && page.slice(0, 2).map(row => { // Limitar a 2 filas si está encogida
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className={cell.column.id === 'cantidad' ? 'text-center' : ''}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
          {isExpanded && page.map(row => { // Renderizar todas las filas si está expandida
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className={cell.column.id === 'cantidad' ? 'text-center' : ''}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isExpanded && (
        <div className="expand-pagination-container">
          <button className="expand-btn" onClick={handleToggleExpand}>⬇</button>
          <div className="popup-pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;--</button>
            <div className="popup-pagination-info">
              Página{' '}
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>
            </div>
            <button onClick={() => nextPage()} disabled={!canNextPage}>--&gt;</button>
          </div>
        </div>
      )}
      {isExpanded && (
        <>
          <div className='popup-filasseleccionadas'>
            Filas seleccionadas: {Object.keys(selectedRowIds).length}
          </div>
          <div className="expand-pagination-container">
            <button className="expand-btn" onClick={handleToggleExpand}>⬆</button>
            <div className="popup-pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;--</button>
              <div className="popup-pagination-info">
                Página{' '}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>
              </div>
              <button onClick={() => nextPage()} disabled={!canNextPage}>--&gt;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DefaultColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Buscar en ${count} registros...`}
    />
  );
}

export default RecentSalesPopup;
