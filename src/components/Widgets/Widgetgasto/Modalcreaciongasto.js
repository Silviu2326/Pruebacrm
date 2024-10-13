// Modalcreaciongasto.js
import React from 'react';
import './Modalcreaciongasto.css';

const Modalcreaciongasto = ({ isOpen, onClose, newGasto, handleGastoChange, handleAddGasto, theme }) => {
  if (!isOpen) return null;

  const getDurationLabel = () => {
    switch (newGasto.frequency) {
      case 'weekly':
        return 'Duración (en semanas)';
      case 'biweekly':
        return 'Duración (cada 15 días)';
      case 'monthly':
        return 'Duración (en meses)';
      default:
        return 'Duración';
    }
  };

  const getDurationPlaceholder = () => {
    switch (newGasto.frequency) {
      case 'weekly':
        return 'Duración (en semanas)';
      case 'biweekly':
        return 'Duración (cada 15 días)';
      case 'monthly':
        return 'Duración (en meses)';
      default:
        return 'Duración';
    }
  };

  return (
    <div className="Gasto-modal-background">
      <div className={`Gasto-modal-content ${theme}`}>
        <h3 className="Widgetgastoanadir-title">Añadir Gasto</h3>
        <form onSubmit={handleAddGasto} className="Widgetgastoanadir-form">
          <label htmlFor="concept" className="Widgetgastoanadir-label">Concepto</label>
          <input 
            type="text" 
            id="concept"
            name="concepto" 
            placeholder="Concepto" 
            value={newGasto.concepto} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="description" className="Widgetgastoanadir-label">Descripción</label>
          <input 
            type="text" 
            id="description"
            name="description" 
            placeholder="Descripción" 
            value={newGasto.description} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="category" className="Widgetgastoanadir-label">Categoría</label>
          <input 
            type="text" 
            id="category"
            name="category" 
            placeholder="Categoría" 
            value={newGasto.category} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="amount" className="Widgetgastoanadir-label">Importe</label>
          <input 
            type="number" 
            id="amount"
            name="monto" 
            placeholder="Importe" 
            value={newGasto.monto} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="status" className="Widgetgastoanadir-label">Estado</label>
          <input 
            type="text" 
            id="status"
            name="estado" 
            placeholder="Estado" 
            value={newGasto.estado} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="date" className="Widgetgastoanadir-label">Fecha</label>
          <input 
            type="date" 
            id="date"
            name="fecha" 
            placeholder="Fecha" 
            value={newGasto.fecha} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-input ${theme}`}
            required
          />
          <label htmlFor="isRecurrente" className="Widgetgastoanadir-label">¿Es recurrente?</label>
          <input 
            type="checkbox" 
            id="isRecurrente"
            name="isRecurrente" 
            checked={newGasto.isRecurrente} 
            onChange={handleGastoChange} 
            className={`Widgetgastoanadir-checkbox ${theme}`}
          />
          {newGasto.isRecurrente && (
            <>
              <label htmlFor="frequency" className="Widgetgastoanadir-label">Frecuencia</label>
              <select 
                id="frequency"
                name="frequency" 
                value={newGasto.frequency} 
                onChange={handleGastoChange} 
                className={`Widgetgastoanadir-select ${theme}`}
              >
                <option value="">Selecciona una opción</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quincenal</option>
                <option value="monthly">Mensual</option>
              </select>
              <label htmlFor="duration" className="Widgetgastoanadir-label">{getDurationLabel()}</label>
              <input 
                type="number" 
                id="duration"
                name="duration" 
                placeholder={getDurationPlaceholder()} 
                value={newGasto.duration} 
                onChange={handleGastoChange} 
                className={`Widgetgastoanadir-input ${theme}`}
              />
            </>
          )}
          <button type="submit" className={`Widgetgastoanadir-button ${theme}`}>Añadir</button>
        </form>
        <button onClick={onClose} className="close-modal-btn">Cerrar</button>
      </div>
    </div>
  );
};

export default Modalcreaciongasto;
