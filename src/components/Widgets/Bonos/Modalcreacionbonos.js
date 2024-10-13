import React, { useState } from 'react';
import './Modalcreacionbonos.css';

const Modalcreacionbonos = ({ onClose }) => {
    
    console.log('Modalcreacionbonos montado');
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    tipo: '',
    descripcion: '',
    fechaExpiracion: '',
    fechaComienzo: '',
    servicio: '',
    sesiones: '',
    fechaVenta: '',
    precio: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateBono = (e) => {
    e.preventDefault();
    // Lógica para crear el bono
    console.log('Bono creado con los siguientes datos:', formData);
    onClose();  // Cierra el modal después de crear el bono
  };


  return (
    <div className="BonosCr-modal-background">
      <div className="BonosCr-modal-content">
        <h3>Añadir Bono</h3>
        <form onSubmit={handleCreateBono}>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} required />
          <input type="text" name="cliente" placeholder="Cliente ID" value={formData.cliente} onChange={handleInputChange} />
          <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
            <option value="">Seleccionar tipo</option>
            <option value="Descuento">Descuento</option>
            <option value="Promoción">Promoción</option>
            <option value="Cashback">Cashback</option>
            <option value="Regalo">Regalo</option>
          </select>
          <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
          <input type="date" name="fechaComienzo" value={formData.fechaComienzo} onChange={handleInputChange} required />
          <input type="date" name="fechaExpiracion" value={formData.fechaExpiracion} onChange={handleInputChange} required />
          <input type="text" name="servicio" placeholder="Servicio" value={formData.servicio} onChange={handleInputChange} required />
          <input type="number" name="sesiones" placeholder="Sesiones" value={formData.sesiones} onChange={handleInputChange} required />
          <input type="date" name="fechaVenta" value={formData.fechaVenta} onChange={handleInputChange} required />
          <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleInputChange} required />
          <button type="submit" style={{
                  background: 'var(--button-bg)',
                  color: 'white',
                }}>Añadir</button>
        </form>
        <button onClick={onClose} style={{
                  background: 'var(--button-bg-filtro-dark)',
                  width: '100%',
                  color: 'white',
                }}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modalcreacionbonos;
