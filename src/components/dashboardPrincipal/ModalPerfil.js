// ModalPerfil.jsx
import React, { useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';
import './ModalPerfil.css';
import PropTypes from 'prop-types';

function ModalPerfil({ theme, onClose }) {
  // Estado para los campos del formulario
  const [nombre, setNombre] = useState('Juan');
  const [apellido, setApellido] = useState('Pérez');
  const [email, setEmail] = useState('juan.perez@example.com');
  const [clientesTotales, setClientesTotales] = useState(150); // Número de clientes (auto)
  const [proximoPago, setProximoPago] = useState('2024-11-15'); // Próximo pago (auto)
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Maneja el cierre del modal al presionar Esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Cierra el modal al hacer clic fuera del contenido
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  // Maneja la selección de una nueva foto de perfil
  const handleFotoPerfilChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPerfil(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Maneja el envío del formulario
  const handleGuardar = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para guardar los cambios,
    // como enviar una solicitud al servidor.
    // Por ahora, simplemente mostramos una alerta y cerramos el modal.
    alert('Cambios guardados exitosamente.');
    console.log({
      nombre,
      apellido,
      email,
      clientesTotales,
      proximoPago,
      fotoPerfil,
    });
    onClose();
  };

  return (
    <div className="perf-modal-overlay" onClick={handleOverlayClick}>
      <div className={`perf-modal-content ${theme}`}>
        <form onSubmit={handleGuardar}>
          <div className="perf-modal-header">
            <h2 className="perf-modal-title">Mi Perfil</h2>
            <button
              type="button"
              className="perf-modal-close-button"
              onClick={onClose}
              aria-label="Cerrar modal"
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
              <X size={20} />
            </button>
          </div>
          <div className="perf-modal-body">
            {/* Sección de foto de perfil */}
            <div className="perf-perfil-foto-section">
              <img
                src={
                  fotoPerfil || 'https://via.placeholder.com/100?text=Perfil'
                }
                alt="Foto de Perfil"
                className="perf-perfil-foto"
              />
              <label htmlFor="fotoPerfil" className="perf-cambiar-foto-button">
                <Camera size={16} /> Cambiar Foto
              </label>
              <input
                type="file"
                id="fotoPerfil"
                accept="image/*"
                onChange={handleFotoPerfilChange}
                style={{ display: 'none' }}
              />
            </div>
  
            {/* Campos del formulario */}
            <div className="perf-form-group">
              <label htmlFor="nombre" className="perf-form-label">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="perf-form-input"
                style={{
                  background: 'transparent',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              />
            </div>
  
            <div className="perf-form-group">
              <label htmlFor="apellido" className="perf-form-label">Apellidos</label>
              <input
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                className="perf-form-input"
                style={{
                  background: 'transparent',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              />
            </div>
  
            <div className="perf-form-group">
              <label htmlFor="email" className="perf-form-label">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="perf-form-input"
                style={{
                  background: 'transparent',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              />
            </div>
  
            <div className="perf-form-group">
              <label htmlFor="clientesTotales" className="perf-form-label">Número de Clientes Totales</label>
              <input
                type="number"
                id="clientesTotales"
                value={clientesTotales}
                readOnly
                className="perf-form-input perf-readonly-input"
                style={{
                  background: 'transparent',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                }}
              />
            </div>
  
            <div className="perf-form-group">
              <label htmlFor="proximoPago" className="perf-form-label">Día de Próximo Pago</label>
              <input
                type="date"
                id="proximoPago"
                value={proximoPago}
                readOnly
                className="perf-form-input perf-readonly-input"
                style={{
                  background: 'transparent',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                  width: '230px',
                  height: '44px',
                }}
              />
            </div>
          </div>
          <div className="perf-modal-footer">
            <button type="submit" className={`perf-modal-button ${theme}`}
              style={{
                background: 'var(--create-button-bg)',
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '14px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalPerfil.propTypes = {
  theme: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalPerfil;
