import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonosDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import BonoCreationModal from './BonoCreationModal';
import { CirclePower, Edit, Eye, Trash2 } from 'lucide-react';
import Modal from 'react-modal';  // Asegúrate de importar Modal

// Establecemos el elemento raíz para Modal
Modal.setAppElement('#root');

// Función de formateo de fechas definida fuera del componente
const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const BonosDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    fechaComienzo: true,
    fechaExpiracion: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true,
  });

  const [newBono, setNewBono] = useState({
    nombre: '',
    fechaComienzo: '',
    fechaExpiracion: '',
    estado: 'Pendiente',
    beneficiario: '',
    monto: 0,
    tipo: '',
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedBono, setSelectedBono] = useState(null); // Bono seleccionado para ver, editar o borrar
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bonos/`)
      .then((response) => {
        setData(response.data);
        setSelectedRows(new Array(response.data.length).fill(false));
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    const estadosPosibles = ['Activo', 'No Activo', 'Pendiente'];
    let estadoActualIndex = estadosPosibles.indexOf(newData[index].estado);
    newData[index].estado = estadosPosibles[(estadoActualIndex + 1) % estadosPosibles.length];
    setData(newData);
  };

  const handleCreateBonoClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBono({ ...newBono, [name]: value });
  };

  const handleCreateBono = async () => {
    const createdBono = {
      ...newBono,
      nombre: newBono.nombre || `Bono ${(data.length + 1)}`,
      fechaComienzo: newBono.fechaComienzo || new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bonos/`, createdBono);
      setData([...data, response.data]);

      setNewBono({
        nombre: '',
        fechaComienzo: '',
        fechaExpiracion: '',
        estado: 'Pendiente',
        beneficiario: '',
        monto: 0,
        tipo: '',
      });

      handleClosePopup();
    } catch (error) {
      console.error('Error al crear el bono:', error);
    }
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

  // Funcionalidades de Modales
  const handleViewBono = (bono) => {
    setSelectedBono(bono);
    setIsViewModalOpen(true);
  };

  const handleEditBono = (bono) => {
    setSelectedBono(bono);
    setIsEditModalOpen(true);
  };

  const handleSaveBono = async (updatedBono) => {
    try {
      await axios.put(`${API_BASE_URL}/api/bonos/${updatedBono._id}`, updatedBono);
      setData(data.map(b => (b._id === updatedBono._id ? updatedBono : b)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el bono", error);
    }
  };

  const handleDeleteBono = (bono) => {
    setSelectedBono(bono);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBono = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/bonos/${selectedBono._id}`);
      setData(data.filter(b => b._id !== selectedBono._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el bono", error);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`widget-bonosDup ${theme}`}>
      <h2 className={theme}>Bonos</h2>
      <div className="controls" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Buscar bono..."
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
        <button
          className={`filter-btn ${theme}`}
          onClick={handleCreateBonoClick}
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
          Crear Bono
        </button>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>

      {isPopupOpen && (
        <BonoCreationModal
          visibleColumns={visibleColumns}
          newBono={newBono}
          handleInputChange={handleInputChange}
          handleClosePopup={handleClosePopup}
          handleCreateBono={handleCreateBono}
          theme={theme}
        />
      )}

      <table className={`WidgetBonos-table ${theme}`} style={{
        borderRadius: '10px',
        borderCollapse: 'separate',
        borderSpacing: '0',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
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
            {visibleColumns.nombre && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre de Bono</th>}
            {visibleColumns.fechaComienzo && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha de Comienzo</th>}
            {visibleColumns.fechaExpiracion && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha de Expiración</th>}
            {visibleColumns.estado && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Estado</th>}
            {visibleColumns.beneficiario && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Clientes asignados</th>}
            {visibleColumns.monto && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Importe</th>}
            {visibleColumns.tipo && <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Tipo de Bono</th>}
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
                <input
                  type="checkbox"
                  checked={selectedRows[index]}
                  onChange={() => handleRowCheckboxChange(index)}
                />
              </td>
              {visibleColumns.nombre && <td style={{ padding: '12px' }}>{item.nombre}</td>}
              {visibleColumns.fechaComienzo && <td style={{ padding: '12px' }}>{formatDate(item.fechaComienzo)}</td>}
              {visibleColumns.fechaExpiracion && <td style={{ padding: '12px' }}>{formatDate(item.fechaExpiracion)}</td>}
              {visibleColumns.estado && <td style={{ padding: '12px' }}>{item.estado}</td>}
              {visibleColumns.beneficiario && <td style={{ padding: '12px' }}>{item.beneficiario}</td>}
              {visibleColumns.monto && <td style={{ padding: '12px' }}>{item.monto}</td>}
              {visibleColumns.tipo && <td style={{ padding: '12px' }}>{item.tipo}</td>}
              <td style={{ padding: '12px' }}>
                <div className="bono-actionsBtns">
                  <button
                    className={`bono-CambioEstadoBtn ${theme}`}
                    onClick={() => handleChangeStatus(index)}
                    style={{
                      color: 'var(--text)',
                      padding: '10px 10px',
                      cursor: 'pointer',
                      background: 'none',
                    }}
                  >
                    <CirclePower size={16} />
                  </button>

                  <button
                    className={`bono-VerBtn ${theme}`}
                    onClick={() => handleViewBono(item)}
                    style={{
                      color: 'var(--text)',
                      padding: '10px 10px',
                      cursor: 'pointer',
                      background: 'none',
                    }}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className={`bono-editBtn ${theme}`}
                    onClick={() => handleEditBono(item)}
                    style={{
                      color: 'var(--text)',
                      padding: '10px 10px',
                      cursor: 'pointer',
                      background: 'none',
                    }}
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    className={`bono-borrarBtn ${theme}`}
                    onClick={() => handleDeleteBono(item)}
                    style={{
                      color: 'red',
                      padding: '10px 10px',
                      cursor: 'pointer',
                      background: 'none',
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

      {/* Modales */}
      <BonoDetailModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bono={selectedBono}
      />
      <BonoEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bono={selectedBono}
        onSave={handleSaveBono}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteBono}
      />
    </div>
  );
};

export default BonosDuplicado;

// Modales adicionales
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '100%',
    backgroundColor: '#fff',
  },
};

const BonoDetailModal = ({ isOpen, onClose, bono }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
    {bono ? (
      <>
        <h2>Detalles del Bono</h2>
        <p><strong>Nombre:</strong> {bono.nombre}</p>
        <p><strong>Descripción:</strong> {bono.descripcion}</p>
        <p><strong>Fecha de Comienzo:</strong> {formatDate(bono.fechaComienzo)}</p>
        <p><strong>Fecha de Expiración:</strong> {formatDate(bono.fechaExpiracion)}</p>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Cerrar</button>
      </>
    ) : null}
  </Modal>
);

const BonoEditModal = ({ isOpen, onClose, bono, onSave }) => {
  const [formData, setFormData] = useState(bono || {});

  useEffect(() => {
    if (bono) {
      setFormData({
        ...bono,
        fechaComienzo: formatDate(bono.fechaComienzo),
        fechaExpiracion: formatDate(bono.fechaExpiracion),
      });
    } else {
      setFormData({});
    }
  }, [bono]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      {bono ? (
        <>
          <h2>Editar Bono</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <label>
              Nombre:
              <input
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleInputChange}
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </label>
            <label>
              Descripción:
              <input
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleInputChange}
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </label>
            <label>
              Tipo:
              <input
                name="tipo"
                value={formData.tipo || ''}
                onChange={handleInputChange}
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </label>
            <label>
              Fecha de Comienzo:
              <input
                type="date"
                name="fechaComienzo"
                placeholder="Fecha de Comienzo"
                value={formData.fechaComienzo || ''}
                onChange={handleInputChange}
                required
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </label>
            <label>
              Fecha de Expiración:
              <input
                type="date"
                name="fechaExpiracion"
                placeholder="Fecha de Expiración"
                value={formData.fechaExpiracion || ''}
                onChange={handleInputChange}
                required
                style={{ width: '100%', marginBottom: '10px' }}
              />
            </label>
            <button type="submit" style={{ marginTop: '20px' }}>Guardar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
          </form>
        </>
      ) : null}
    </Modal>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
    <h2>¿Estás seguro de que quieres eliminar este bono?</h2>
    <button onClick={onConfirm} style={{ marginTop: '20px' }}>Confirmar</button>
    <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
  </Modal>
);
