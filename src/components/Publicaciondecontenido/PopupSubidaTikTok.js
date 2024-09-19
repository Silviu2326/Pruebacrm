import React, { useState, useEffect } from 'react';
import './PopupSubidaTikTok.css';
import { X, Video, Edit3 } from 'lucide-react';

const PopupSubidaTikTok = ({ onClose }) => {
  const [videoArchivo, setVideoArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const manejarArchivoVideo = (e) => {
    const file = e.target.files[0];
    setVideoArchivo(file);

    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    console.log('Datos del video para TikTok:');
    console.log({ titulo, descripcion, videoArchivo });

    // Aquí puedes implementar la lógica para subir el video a TikTok

    onClose();
  };

  // Liberar el objeto URL cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="PopupSubidaTikTok-overlay">
      <div className="PopupSubidaTikTok-content">
        <button className="PopupSubidaTikTok-close" onClick={onClose}>
          <X />
        </button>
        <div className="PopupSubidaTikTok-header">
          <img
            src="https://sf-static.tiktokcdn.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png"
            alt="TikTok Logo"
            className="PopupSubidaTikTok-logo"
          />
          <h2>Subir Video a TikTok</h2>
        </div>
        <form onSubmit={manejarSubmit}>
          <div className="PopupSubidaTikTok-form-group">
            <label htmlFor="videoArchivo">
              <Video className="icono-label" /> Seleccionar Video
            </label>
            <input
              type="file"
              id="videoArchivo"
              name="videoArchivo"
              accept="video/*"
              onChange={manejarArchivoVideo}
              required
            />
          </div>

          {previewUrl && (
            <div className="PopupSubidaTikTok-video-preview">
              <video controls src={previewUrl} />
            </div>
          )}

          <div className="PopupSubidaTikTok-form-group">
            <label htmlFor="titulo">
              <Edit3 className="icono-label" /> Título
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              maxLength="100"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="PopupSubidaTikTok-form-group">
            <label htmlFor="descripcion">
              <Edit3 className="icono-label" /> Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="4"
              placeholder="Describe el contenido..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="PopupSubidaTikTok-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Subir</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupSubidaTikTok;
