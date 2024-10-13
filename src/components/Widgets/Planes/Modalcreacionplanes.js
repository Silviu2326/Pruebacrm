import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modalcreacionplanes.css';
import { Checkbox } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const Modalcreacionplanes = ({ onClose, theme }) => {
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
    billingMethod: 'hours',
    billingDate: '',
  });

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes`);
        setClients(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAssociateClient = () => {
    setForm({ ...form, client: selectedClientId });
    alert('Cliente asociado correctamente');
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
          client: form.client || null,
          startDate: form.startDate,
          hourlyRate: form.hourlyRate,
          billingMethod: form.billingMethod,
          billingDate: form.billingMethod === 'date' ? form.billingDate : null,
        });
      }
      console.log('Plan creado:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al crear el plan:', error);
    }
  };

  return (
    <div className={`Modalcreacionplanes-popup ${theme}`}>
      <div className={`Modalcreacionplanes-popup-content ${theme}`}>
        <h3>Crear Nuevo Plan</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Cliente:
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </label>
          {selectedClientId && (
            <button
              type="button"
              onClick={handleAssociateClient}
              className="button"
            >
              Asociar Cliente
            </button>
          )}
          <label>
            Fecha de Inicio:
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tipo de Plan:
            <select
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
              <label>
                Frecuencia:
                <select
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
              <label>
                Duración:
                <input
                  type="number"
                  name="contractDuration"
                  value={form.contractDuration}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Plan Indefinido
                <Checkbox />
              </label>
              <label>
                Tarifa:
                <input
                  type="number"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Día de Pago:
                <input
                  type="number"
                  name="paymentDay"
                  value={form.paymentDay}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Sesiones por Semana:
                <input
                  type="number"
                  name="sessionsPerWeek"
                  value={form.sessionsPerWeek}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          {form.type === 'variable' && (
            <>
              <label>
                Tarifa por Hora:
                <input
                  type="number"
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Método de Facturación:
                <select
                  name="billingMethod"
                  value={form.billingMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="hours">Por Horas</option>
                  <option value="date">Fecha Determinada</option>
                </select>
              </label>
              {form.billingMethod === 'date' && (
                <label>
                  Fecha de Facturación:
                  <input
                    type="date"
                    name="billingDate"
                    value={form.billingDate}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}
              {form.billingMethod === 'hours' && (
                <label>
                  Día de Pago:
                  <input
                    type="number"
                    name="paymentDay"
                    value={form.paymentDay}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}
            </>
          )}
          <div className={`Modalcreacionplanes-buttons ${theme}`}>
            <button type="submit">Crear</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modalcreacionplanes;
