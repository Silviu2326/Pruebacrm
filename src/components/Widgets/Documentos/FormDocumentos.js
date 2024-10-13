import React, { useState } from 'react';
import Modal from './Modal'; // Asumiendo que ya tienes el componente Modal implementado
import './FormDocumentos.css';

const FormDocumentos = ({ isOpen, onClose, theme }) => {
  const [selectedTipo, setSelectedTipo] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    archivo: null,
    nombre: '',
    organizacion: '',
    fechaEmision: '',
    fechaExpiracion: '',
    fechaRecordatorio: '',
    notas: '',
    descripcion: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      archivo: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    // Aquí puedes implementar la lógica de envío de los datos
    console.log('Formulario enviado:', formData);
    // Lógica para cerrar el modal después de enviar el formulario
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} theme={theme}>
      <h3 className={`uniquePrefix-form-title ${theme}`}>Añadir Nuevo Documento</h3>
      <select
        value={selectedTipo}
        onChange={(e) => setSelectedTipo(e.target.value)}
        className={`uniquePrefix-form-select ${theme}`}
      >
        <option value="">Seleccione un tipo de documento</option>
        <option value="contrato">Contrato</option>
        <option value="licencia">Licencia</option>
        <option value="documento">Documento</option>
      </select>

      {selectedTipo === 'contrato' && (
        <div>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.titulo}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="fecha"
            placeholder="Fecha"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.fecha}
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="archivo"
            className={`uniquePrefix-form-input ${theme}`}
            onChange={handleFileChange}
          />
        </div>
      )}

      {selectedTipo === 'licencia' && (
        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="organizacion"
            placeholder="Organización"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.organizacion}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="fechaEmision"
            placeholder="Fecha de Emisión"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.fechaEmision}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="fechaExpiracion"
            placeholder="Fecha de Expiración"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.fechaExpiracion}
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="archivo"
            className={`uniquePrefix-form-input ${theme}`}
            onChange={handleFileChange}
          />
          <input
            type="date"
            name="fechaRecordatorio"
            placeholder="Fecha de Recordatorio"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.fechaRecordatorio}
            onChange={handleInputChange}
          />
          <textarea
            name="notas"
            placeholder="Notas"
            className={`uniquePrefix-form-textarea ${theme}`}
            value={formData.notas}
            onChange={handleInputChange}
          ></textarea>
        </div>
      )}

      {selectedTipo === 'documento' && (
        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className={`uniquePrefix-form-input ${theme}`}
            value={formData.nombre}
            onChange={handleInputChange}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            className={`uniquePrefix-form-textarea ${theme}`}
            value={formData.descripcion}
            onChange={handleInputChange}
          ></textarea>
          <input
            type="file"
            name="archivo"
            className={`uniquePrefix-form-input ${theme}`}
            onChange={handleFileChange}
          />
        </div>
      )}

      <button onClick={handleSubmit} className={`uniquePrefix-form-submit ${theme}`}>
        Añadir {selectedTipo}
      </button>
      <button onClick={onClose} className={`uniquePrefix-form-cancel ${theme}`}>
        Cancelar
      </button>
    </Modal>
  );
};

export default FormDocumentos;
