import React, { useState, useEffect } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSales.css';
import DetailedIngresoBeneficio from './DetailedIngresoBeneficio';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import {  Filter, User, Eye, Copy } from 'lucide-react'; // Importamos el ícono de lucide-react
import NavbarFiltrosRecentSales from './NavbarFiltrosRecentsales';

const columns = [
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
        fallido: 'Fallido',
      };
      return status[value] || 'Desconocido';
    },
  },
  {
    Header: 'Correo Electrónico',
    accessor: 'cliente.email',
  },
  {
    Header: 'Dinero',
    accessor: 'cantidad',
    Cell: ({ value }) => {
      if (typeof value === 'number') {
        const formatted = new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(value);
        return <div className="text-right font-medium">{formatted}</div>;
      }
      return <div className="text-right font-medium">N/A</div>;
    },
  },
  {
    Header: 'Acciones',
    accessor: 'actions',
    Cell: ({ row }) => (
      <div className="panelcontrol-dropdown">
        <div className="panelcontrol-action-btns" style={{ 
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',                 
                  }}>
          <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><Copy size={16}/></button>
          <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><User size={16}/></button>
          <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--text)', 
                    padding: '3px',
                  }}><Eye size={16}/></button>
        </div>
      </div>
    ),
  },
];

function RecentSales({ detailed, onTitleClick, isEditMode, theme }) {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilterState] = useState('');  // Este se usa para manejar el valor del input

  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dineroFilter, setDineroFilter] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false); // Control del estado del dropdown
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/incomes/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const filteredData = result.filter((item) => {
          const itemDate = new Date(item.fecha);
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();

          return (
            (itemYear === currentYear && (itemMonth === currentMonth || itemMonth === currentMonth - 1)) ||
            (itemMonth === 11 && itemYear === currentYear - 1 && currentMonth === 0)
          );
        });

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter,  // Usa setGlobalFilter del hook useGlobalFilter aquí
    setFilter,
    allColumns,
    state: { pageIndex, selectedRowIds, pageSize },
    pageOptions,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
  } = tableInstance;

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);  // Aplica el valor al filtro global
    setGlobalFilterState(e.target.value);  // Actualiza el estado del input
  };

  const handleEmailFilterChange = (e) => {
    setEmailFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDineroFilterChange = (e) => {
    setDineroFilter(e.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (emailFilter) count++;
    if (statusFilter) count++;
    if (dineroFilter) count++;
    return count;
  };

  useEffect(() => {
    if (isFilterApplied) {
      setPageSize(5);
    }
  }, [isFilterApplied, setPageSize]);

  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
  };

  const emptyRows = pageSize - page.length;

  const [filters, setFilters] = useState({
    email: '',
    estado: '',
    minMonto: '',
    maxMonto: '',
  });

  const handleFilterFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: '' });
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const emailCondition = filters.email ? item.cliente.email.includes(filters.email) : true;
      const estadoCondition = filters.estado ? item.estadoPago === filters.estado : true;
      const minMontoCondition = filters.minMonto ? item.cantidad >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? item.cantidad <= parseFloat(filters.maxMonto) : true;
      return emailCondition && estadoCondition && minMontoCondition && maxMontoCondition;
    });
  };

  // Aplicación de filtros al conjunto de datos
  const filteredData = applyFilters(data);

  return (
    <div className={`panelcontrol-recent-sales ${detailed ? 'detailed' : ''} ${theme}`}>
      <h3 className="panelcontrol-letras" onClick={onTitleClick}>
        Ventas Recientes
      </h3>
      <div className="panelcontrol-pagination">
      <div style={{display: 'flex', gap:'20px'}}>
      <div className="panelcontrol-dropdown">
              <input
                style={{
                  background: 'var(--search-button-bg)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px',
                  height: '44px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                  textAlign: 'left',
                }}
                value={globalFilter}
                onChange={handleGlobalFilterChange}
                placeholder="Buscar..."
                className={`RS-panelcontrol-filter-input ${theme}`}
              />
            </div>
            <div className="panelcontrol-dropdown">
              <button 
                className="panelcontrol-dropdown-btn" 
                onClick={toggleFilterDropdown}
                style={{
                  background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                  color: 'var(--button-text-dark)',
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              >
                <Filter size={16} color="white" /> {/* Icono de filtro */}
              </button>
              {isFilterDropdownOpen && (
                <div className={`RS-panelcontrol-dropdown-content RS-filter-dropdown-content ${theme}`}>
                  {/* Filtro por correo electrónico */}
                  <div className={`RS-filter-field ${theme}`}>
                    <label>Correo:</label>
                    <input
                      name="email"
                      value={filters.email}
                      onChange={handleFilterFieldChange}
                      className={`RS-panelcontrol-filter-input ${theme}`}
                    />
                  </div>
  
                  {/* Filtro por estado */}
                  <div className={`RS-filter-field ${theme}`}>
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={filters.estado}
                      onChange={handleFilterFieldChange}
                      className={`RS-panelcontrol-filter-input ${theme}`}
                    >
                      <option value="">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="completado">Completado</option>
                      <option value="fallido">Fallido</option>
                    </select>
                  </div>
  
                  {/* Filtro por dinero */}
                  <div className={`RS-filter-field ${theme}`}>
                    <label>Mínimo:</label>
                    <input
                      type="number"
                      name="minMonto"
                      value={filters.minMonto}
                      onChange={handleFilterFieldChange}
                      className={`RS-panelcontrol-filter-input ${theme}`}
                    />
                  </div>
                  <div className={`RS-filter-field ${theme}`}>
                    <label>Máximo:</label>
                    <input
                      type="number"
                      name="maxMonto"
                      value={filters.maxMonto}
                      onChange={handleFilterFieldChange}
                      className={`RS-panelcontrol-filter-input ${theme}`}
                    />
                  </div>
  
                  <button onClick={() => applyFilters(filteredData)} className="RS-panelcontrol-filter-btn" style={{
                    background: 'var(--button-bg)',
                    border: '1px solid var(--button-border)',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '0px',
                    width: '100%',
                    height: '36px',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    Aplicar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        <div className="panelcontrol-pagination-info">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
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
    
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>

        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
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
      </div>
      <NavbarFiltrosRecentSales filters={filters} clearFilter={clearFilter} />
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={allColumns.reduce((acc, col) => {
            acc[col.id] = !col.isVisible;
            return acc;
          }, {})}
          handleColumnToggle={(column) => {
            const columnInstance = allColumns.find((col) => col.id === column);
            if (columnInstance) {
              columnInstance.toggleHidden();
            }
          }}
        />
      )}
      <table {...getTableProps()} className={`panelcontrol-sales-table ${theme}`}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
          {emptyRows > 0 &&
            Array(emptyRows)
              .fill()
              .map((_, idx) => (
                <tr key={`empty-row-${idx}`} style={{ height: '52px' }}>
                  <td colSpan={columns.length} />
                </tr>
              ))}
        </tbody>
      </table>
      <div className="panelcontrol-filasseleccionadas">
        Filas seleccionadas: {Object.keys(selectedRowIds).length}
      </div>
      {isDetailedModalOpen && (
        <DetailedIngresoBeneficio onClose={handleCloseDetailedModal} />
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
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Buscar en ${count} registros...`}
    />
  );
}

export default RecentSales;
