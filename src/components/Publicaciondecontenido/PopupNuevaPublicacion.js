import React, { useState } from 'react';
import './PopupNuevaPublicacion.css';

const PopupNuevaPublicacion = ({ onClose }) => {
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    setArchivo(file);

    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    console.log('Título:', e.target.elements.titulo.value);
    console.log('Fecha:', e.target.elements.fecha.value);
    console.log('Plataforma:', e.target.elements.plataforma.value);
    console.log('Estado:', e.target.elements.estado.value);
    console.log('Archivo subido:', archivo);
    onClose();
  };

  return (
    <div className="PopupNuevaPublicacion-overlay">
      <div className="PopupNuevaPublicacion-content">
        <h2>Nueva Publicación</h2>
        <form onSubmit={manejarSubmit}>
          <div className="PopupNuevaPublicacion-form-group">
            <label htmlFor="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" placeholder="Título de la publicación" required />
          </div>
          <div className="PopupNuevaPublicacion-form-group">
            <label htmlFor="fecha">Fecha</label>
            <input type="datetime-local" id="fecha" name="fecha" required />
          </div>
          <div className="PopupNuevaPublicacion-form-group">
            <label htmlFor="plataforma">Plataforma</label>
            <select id="plataforma" name="plataforma" required>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div className="PopupNuevaPublicacion-form-group">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" required>
              <option value="Programada">Programada</option>
              <option value="En Cola">En Cola</option>
              <option value="Publicada">Publicada</option>
            </select>
          </div>
          <div className="PopupNuevaPublicacion-form-group">
            <label htmlFor="archivo">Subir Archivo</label>
            <input type="file" id="archivo" name="archivo" accept="image/*, video/*" onChange={manejarArchivo} required />
          </div>

          {/* Preview del video si se ha subido uno */}
          {previewUrl && (
            <div className="PopupNuevaPublicacion-video-preview">
              <video controls src={previewUrl} width="100%" />
            </div>
          )}

          <div className="PopupNuevaPublicacion-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupNuevaPublicacion;
