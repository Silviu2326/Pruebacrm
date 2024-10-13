// ModalGenerarReporteRecurrente.jsx
import React, { useState, useEffect } from 'react';
import './ModalGenerarReporteRecurrente.css';

function ModalGenerarReporteRecurrente({ isOpen, onClose, theme }) {
  const [nombreReporte, setNombreReporte] = useState('');
  const [frecuencia, setFrecuencia] = useState('semanalmente');
  const [camposSeleccionados, setCamposSeleccionados] = useState({
    clientes: false,
    ingresos: false,
    gastos: false,
    planes: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Deshabilita el scroll del body
    } else {
      document.body.style.overflow = 'auto'; // Habilita el scroll del body
    }

    // Limpia el estilo al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombreReporte, frecuencia, camposSeleccionados });
    alert('¡Reporte recurrente generado!');
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setCamposSeleccionados({
      ...camposSeleccionados,
      [e.target.name]: e.target.checked,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-recurrente-overlay ${theme}`}
      onClick={onClose}
    >
      <div
        className={`modal-recurrente-content ${theme}`}
        onClick={(e) => e.stopPropagation()} // Previene que el clic dentro del modal cierre el modal
      >
        <button
          className={`modal-recurrente-close ${theme}`}
          onClick={onClose}
          aria-label="Cerrar modal"
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
          &times;
        </button>
        <h2>Generar Reporte Recurrente</h2>
        <form onSubmit={handleSubmit} className="modal-recurrente-form">
          <div className="modal-recurrente-form-group">
            <label htmlFor="nombreReporte">Nombre del Reporte</label>
            <input
              id="nombreReporte"
              type="text"
              value={nombreReporte}
              onChange={(e) => setNombreReporte(e.target.value)}
              required
              className={`input-${theme}`}
            />
          </div>
          <div className="modal-recurrente-form-group">
            <label htmlFor="frecuencia">¿Cada cuánto quieres los reportes?</label>
            <select
              id="frecuencia"
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
              className={`select-${theme}`}
            >
              <option value="semanalmente">Semanalmente</option>
              <option value="bisemanalmente">Bisemanalmente</option>
              <option value="mensualmente">Mensualmente</option>
            </select>
          </div>
          <div className="modal-recurrente-form-group">
            <label>¿Qué campos quieres usar para el informe?</label>
            <div className="modal-recurrente-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="clientes"
                  checked={camposSeleccionados.clientes}
                  onChange={handleCheckboxChange}
                />
                Clientes
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ingresos"
                  checked={camposSeleccionados.ingresos}
                  onChange={handleCheckboxChange}
                />
                Ingresos
              </label>
              <label>
                <input
                  type="checkbox"
                  name="gastos"
                  checked={camposSeleccionados.gastos}
                  onChange={handleCheckboxChange}
                />
                Gastos
              </label>
              <label>
                <input
                  type="checkbox"
                  name="planes"
                  checked={camposSeleccionados.planes}
                  onChange={handleCheckboxChange}
                />
                Planes
              </label>
            </div>
          </div>
          <div className="modal-recurrente-footer">
            <button
              type="submit"
              className={`modal-recurrente-btn-generar ${theme}`}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '14px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
               }}
  
            >
              Generar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalGenerarReporteRecurrente;
