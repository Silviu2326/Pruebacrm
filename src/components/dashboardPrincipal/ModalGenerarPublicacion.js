// /crm-frontend/src/components/dashboardPrincipal/ModalGenerarPublicacion.jsx
import React, { useEffect, useState } from 'react';
import { X, Image } from 'lucide-react';
import PropTypes from 'prop-types';
import './ModalGenerarPublicacion.css';

function ModalGenerarPublicacion({ theme, onClose }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);

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

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const handleImagenChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagen(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    // Lógica para guardar la publicación
    alert('Publicación generada exitosamente.');
    console.log({ titulo, contenido, imagen });
    onClose();
  };

  return (
    <div className="Genpu-modal-overlay" onClick={handleOverlayClick}>
      <div className={`Genpu-modal-content ${theme}`}>
        <form onSubmit={handleGuardar}>
          <div className="Genpu-modal-header">
            <h2 className="Genpu-modal-title">Generar Publicación</h2>
            <button
              type="button"
              className="Genpu-modal-close-button"
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
          <div className="Genpu-modal-body">
            <div className="Genpu-form-group">
              <label htmlFor="titulo" className="Genpu-form-label">Título</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="Genpu-form-input"
              />
            </div>
  
            <div className="Genpu-form-group">
              <label htmlFor="contenido" className="Genpu-form-label">Contenido</label>
              <textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                required
                className="Genpu-form-input"
                rows="5"
              />
            </div>
  
            <div className="Genpu-form-group">
              <label htmlFor="imagen" className="Genpu-form-label">Imagen (opcional)</label>
              <div className="Genpu-imagen-upload-section">
                {imagen ? (
                  <img src={imagen} alt="Imagen de Publicación" className="Genpu-imagen-preview" />
                ) : (
                  <div className="Genpu-imagen-placeholder">No se ha seleccionado ninguna imagen.</div>
                )}
                <label htmlFor="imagen" className="Genpu-cambiar-imagen-button">
                  <Image size={16} /> Cambiar Imagen
                </label>
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  onChange={handleImagenChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="Genpu-modal-footer">
            <button
              type="submit"
              className={`Genpu-modal-button ${theme}`}
              style={{
                background:'var(--create-button-bg)', 
                color: 'var(--button-text-dark)',
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '14px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
}

ModalGenerarPublicacion.propTypes = {
  theme: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalGenerarPublicacion;
