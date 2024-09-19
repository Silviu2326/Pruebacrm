import React, { useState } from 'react';
import './PopupFormDieta.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const PopupFormDieta = ({ isOpen, onClose, clientes, addDieta, theme }) => {
  const [dieta, setDieta] = useState({
    nombre: '',
    cliente: '',
    fechaInicio: '',
    duracionSemanas: 1,
    objetivo: '',
    restricciones: '',
  });
  const [customObjetivo, setCustomObjetivo] = useState('');

  const objetivosPredefinidos = [
    'Pérdida de peso',
    'Ganancia muscular',
    'Mantenimiento de peso',
    'Mejora del rendimiento deportivo',
    'Mejora de la salud general',
    'Aumento de la energía',
    'Control de enfermedades',
    'Mejora de la digestión',
    'Reducción de la grasa corporal',
    'Detoxificación',
    'Aumento de la masa corporal',
    'Preparación para competencias',
    'Rehabilitación y recuperación',
    'Otro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDieta({
      ...dieta,
      [name]: value,
    });

    if (name === 'objetivo' && value !== 'Otro') {
      setCustomObjetivo('');
    }
  };

  const handleCustomObjetivoChange = (e) => {
    setCustomObjetivo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const objetivoFinal = dieta.objetivo === 'Otro' ? customObjetivo : dieta.objetivo;
      const response = await axios.post(`${API_BASE_URL}/api/dietas`, { ...dieta, objetivo: objetivoFinal });
      addDieta(response.data);
      onClose(); // Cierra el popup después de crear la dieta
    } catch (error) {
      console.error('Error creating dieta:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`PopupFormDieta-popupOverlay`}>
      <div className={`PopupFormDieta-popupContent ${theme === 'dark' ? 'dark' : ''}`}>
        <h2>Crear Dieta</h2>
        <form onSubmit={handleSubmit}>
          <div className={`PopupFormDieta-formGroup`}>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={dieta.nombre}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
              required
            />
          </div>
          <div className={`PopupFormDieta-formGroup`}>
            <label>Cliente</label>
            <select
              name="cliente"
              value={dieta.cliente}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre} {cliente.apellido}
                </option>
              ))}
            </select>
          </div>
          <div className={`PopupFormDieta-formGroup`}>
            <label>Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={dieta.fechaInicio}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
              required
            />
          </div>
          <div className={`PopupFormDieta-formGroup`}>
            <label>Duración (semanas)</label>
            <input
              type="number"
              name="duracionSemanas"
              value={dieta.duracionSemanas}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
              min="1"
              required
            />
          </div>
          <div className={`PopupFormDieta-formGroup`}>
            <label>Objetivo</label>
            <select
              name="objetivo"
              value={dieta.objetivo}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
              required
            >
              {objetivosPredefinidos.map((obj, index) => (
                <option key={index} value={obj}>
                  {obj}
                </option>
              ))}
            </select>
          </div>
          {dieta.objetivo === 'Otro' && (
            <div className={`PopupFormDieta-formGroup`}>
              <label>Objetivo Personalizado</label>
              <input
                type="text"
                name="customObjetivo"
                value={customObjetivo}
                onChange={handleCustomObjetivoChange}
                className={theme === 'dark' ? 'dark' : ''}
                required
              />
            </div>
          )}
          <div className={`PopupFormDieta-formGroup`}>
            <label>Restricciones Alimentarias</label>
            <textarea
              name="restricciones"
              value={dieta.restricciones}
              onChange={handleChange}
              className={theme === 'dark' ? 'dark' : ''}
            />
          </div>
          <div className={`PopupFormDieta-formActions`}>
            <button type="submit" className="PopupFormDieta-btnPrimary">
              Crear Dieta
            </button>
            <button type="button" className="PopupFormDieta-btnSecondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupFormDieta;
