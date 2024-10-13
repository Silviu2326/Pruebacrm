// src/components/Widgets/Componentepanelcontrol/ModalcreacionplanesDuplicado.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ModalcreacionplanesDuplicado.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const ModalcreacionplanesDuplicado = ({ onClose, theme = 'light' }) => {
  const [form, setForm] = useState({
    name: '',
    client: '',
    startDate: '',
    frequency: 'weekly',
    contractDuration: '',
    rate: '',
    paymentDay: '',
    type: 'fixed',
    sessionsPerWeek: 0,
    hourlyRate: '',
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes/`);
        setClients(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (form.type === 'fixed') {
        response = await axios.post(`${API_BASE_URL}/plans/fixed`, {
          name: form.name,
          client: form.client || null,
          startDate: form.startDate,
          frequency: form.frequency,
          contractDuration: form.contractDuration,
          rate: form.rate,
          paymentDay: form.paymentDay,
          sessionsPerWeek: form.sessionsPerWeek,
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/plans/variable`, {
          name: form.name,
          client: form.client,
          startDate: form.startDate,
          hourlyRate: form.hourlyRate,
          paymentDay: form.paymentDay,
        });
      }
      console.log('Plan creado:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al crear el plan:', error);
    }
  };

  return (
    <div className="ModalcreacionplanesDuplicado-popup">
      <div className={`ModalcreacionplanesDuplicado-content ${theme === 'dark' ? 'dark' : ''}`}>
        <h3 className="ModalcreacionplanesDuplicado-title">Crear Nuevo Plan</h3>
        <form className="ModalcreacionplanesDuplicado-form" onSubmit={handleSubmit}>
          <label className="ModalcreacionplanesDuplicado-label">
            Nombre:
            <input
              className="ModalcreacionplanesDuplicado-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="ModalcreacionplanesDuplicado-label">
            Cliente:
            <select
              className="ModalcreacionplanesDuplicado-select"
              name="client"
              value={form.client}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="ModalcreacionplanesDuplicado-label">
            Fecha de Inicio:
            <input
              className="ModalcreacionplanesDuplicado-input"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label className="ModalcreacionplanesDuplicado-label">
            Tipo de Plan:
            <select
              className="ModalcreacionplanesDuplicado-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="fixed">Plan Fijo</option>
              <option value="variable">Plan Variable</option>
            </select>
          </label>
          {form.type === 'fixed' && (
            <>
              <label className="ModalcreacionplanesDuplicado-label">
                Frecuencia:
                <select
                  className="ModalcreacionplanesDuplicado-select"
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </label>
              <label className="ModalcreacionplanesDuplicado-label">
                Duración (meses):
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="contractDuration"
                  value={form.contractDuration}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </label>
              <label className="ModalcreacionplanesDuplicado-label">
                Tarifa:
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </label>
              <label className="ModalcreacionplanesDuplicado-label">
                Día de Pago:
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="paymentDay"
                  value={form.paymentDay}
                  onChange={handleChange}
                  required
                  min="1"
                  max="31"
                />
              </label>
              <label className="ModalcreacionplanesDuplicado-label">
                Sesiones por Semana:
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="sessionsPerWeek"
                  value={form.sessionsPerWeek}
                  onChange={handleChange}
                  required
                  min="1"
                  max="7"
                />
              </label>
            </>
          )}
          {form.type === 'variable' && (
            <>
              <label className="ModalcreacionplanesDuplicado-label">
                Tarifa por Hora:
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </label>
              <label className="ModalcreacionplanesDuplicado-label">
                Día de Pago:
                <input
                  className="ModalcreacionplanesDuplicado-input"
                  type="number"
                  name="paymentDay"
                  value={form.paymentDay}
                  onChange={handleChange}
                  required
                  min="1"
                  max="31"
                />
              </label>
            </>
          )}
          <div className="ModalcreacionplanesDuplicado-buttons">
            <button className="ModalcreacionplanesDuplicado-button-submit" type="submit">
              Crear
            </button>
            <button className="ModalcreacionplanesDuplicado-button-cancel" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalcreacionplanesDuplicado;
