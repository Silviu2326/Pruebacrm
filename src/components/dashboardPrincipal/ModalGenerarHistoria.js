// /crm-frontend/src/components/dashboardPrincipal/ModalGenerarHistoria.jsx
import React, { useEffect, useState } from 'react';
import { X, Book } from 'lucide-react';
import PropTypes from 'prop-types';
import './ModalGenerarHistoria.css';

function ModalGenerarHistoria({ theme, onClose }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [multimedia, setMultimedia] = useState(null);

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

  const handleMultimediaChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMultimedia(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    // Lógica para guardar la historia
    alert('Historia generada exitosamente.');
    console.log({ titulo, descripcion, multimedia });
    onClose();
  };

  return (
    <div className="genhi-modal-overlay" onClick={handleOverlayClick}>
      <div className={`genhi-modal-content ${theme}`}>
        <form onSubmit={handleGuardar}>
          <div className="genhi-modal-header">
            <h2 className="genhi-modal-title">Generar Historia</h2>
            <button
              type="button"
              className="genhi-modal-close-button"
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
          <div className="genhi-modal-body">
            <div className="genhi-form-group">
              <label htmlFor="tituloHistoria" className="genhi-form-label">Título</label>
              <input
                type="text"
                id="tituloHistoria"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="genhi-form-input"
              />
            </div>
  
            <div className="genhi-form-group">
              <label htmlFor="descripcionHistoria" className="genhi-form-label">Descripción</label>
              <textarea
                id="descripcionHistoria"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="genhi-form-input"
                rows="5"
              />
            </div>
  
            <div className="genhi-form-group">
              <label htmlFor="multimedia" className="genhi-form-label">Agregar Multimedia (opcional)</label>
              <div className="genhi-multimedia-upload-section">
                {multimedia ? (
                  <img src={multimedia} alt="Multimedia de Historia" className="genhi-multimedia-preview" />
                ) : (
                  <div className="genhi-multimedia-placeholder">No se ha seleccionado ninguna multimedia.</div>
                )}
                <label htmlFor="multimedia" className="genhi-cambiar-multimedia-button">
                  <Book size={16} /> Cambiar Multimedia
                </label>
                <input
                  type="file"
                  id="multimedia"
                  accept="image/*,video/*"
                  onChange={handleMultimediaChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="genhi-modal-footer">
            <button
              type="submit"
              className={`genhi-modal-button ${theme}`}
              style={{
                background: 'var(--create-button-bg)', 
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

ModalGenerarHistoria.propTypes = {
  theme: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalGenerarHistoria;
