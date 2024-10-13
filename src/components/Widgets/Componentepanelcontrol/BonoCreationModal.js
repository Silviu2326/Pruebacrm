import React from 'react';

const BonoCreationModal = ({ 
  visibleColumns, 
  newBono, 
  handleInputChange, 
  handleClosePopup, 
  handleCreateBono, 
  theme 
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-popup-btn" onClick={handleClosePopup}
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
          X
        </button>
        <form className="create-bono-form">
          {visibleColumns.nombre && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre de Bono</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                placeholder="Nombre de Bono"
                value={newBono.nombre}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}

          {visibleColumns.fechaComienzo && (
            <div className="form-group">
              <label htmlFor="fechaComienzo">Fecha de Comienzo</label>
              <input
                type="date"
                name="fechaComienzo"
                id="fechaComienzo"
                value={newBono.fechaComienzo}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}

          {visibleColumns.fechaExpiracion && (
            <div className="form-group">
              <label htmlFor="fechaExpiracion">Fecha de Expiración</label>
              <input
                type="date"
                name="fechaExpiracion"
                id="fechaExpiracion"
                value={newBono.fechaExpiracion}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}

          {visibleColumns.estado && (
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                name="estado"
                id="estado"
                value={newBono.estado}
                onChange={handleInputChange}
                className={`input-${theme}`}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Activo">Activo</option>
                <option value="No Activo">No Activo</option>
              </select>
            </div>
          )}

          {visibleColumns.beneficiario && (
            <div className="form-group">
              <label htmlFor="beneficiario">Beneficiario</label>
              <input
                type="text"
                name="beneficiario"
                id="beneficiario"
                placeholder="Beneficiario"
                value={newBono.beneficiario}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}

          {visibleColumns.monto && (
            <div className="form-group">
              <label htmlFor="monto">Importe</label>
              <input
                type="number"
                name="monto"
                id="monto"
                placeholder="Monto"
                value={newBono.monto}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}

          {visibleColumns.tipo && (
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Bono</label>
              <input
                type="text"
                name="tipo"
                id="tipo"
                placeholder="Tipo de Bono"
                value={newBono.tipo}
                onChange={handleInputChange}
                className={`input-${theme}`}
              />
            </div>
          )}
        </form>
        <button className={`create-btn ${theme}`} onClick={handleCreateBono}
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
          Crear Bono
        </button>
      </div>
    </div>
  );
};

export default BonoCreationModal;
