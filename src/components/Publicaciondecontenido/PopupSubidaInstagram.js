import React, { useState } from 'react';
import './PopupSubidaInstagram.css';
import {
  X,
  Image,
  Video,
  Layers,
  MapPin,
  UploadCloud,
  Smile,
} from 'lucide-react';

const PopupSubidaInstagram = ({ onClose }) => {
  const [tipoContenido, setTipoContenido] = useState('IMAGE');
  const [archivoMedios, setArchivoMedios] = useState(null);
  const [urlMedios, setUrlMedios] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [leyenda, setLeyenda] = useState('');
  const [miniatura, setMiniatura] = useState(null);
  const [ubicacion, setUbicacion] = useState('');
  const [mostrarEmojis, setMostrarEmojis] = useState(false);

  const manejarTipoContenido = (e) => {
    setTipoContenido(e.target.value);
    setArchivoMedios(null);
    setPreviewUrls([]);
  };

  const manejarArchivoMedios = (e) => {
    const files = e.target.files;
    setArchivoMedios(files);
    const urls = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return { url, type: file.type };
    });
    setPreviewUrls(urls);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const formData = {
      tipoContenido,
      archivoMedios,
      urlMedios,
      leyenda,
      miniatura,
      ubicacion,
    };

    console.log('Datos de la publicación para Instagram:', formData);
    onClose();
  };

  // Función para añadir emojis (simulada)
  const agregarEmoji = (emoji) => {
    setLeyenda(leyenda + emoji);
    setMostrarEmojis(false);
  };

  return (
    <div className="PopupSubidaInstagram-overlay">
      <div className="PopupSubidaInstagram-content">
        <button className="PopupSubidaInstagram-close" onClick={onClose}>
          <X />
        </button>
        <h2>Crear Publicación</h2>
        <form onSubmit={manejarSubmit}>
          {/* Tipo de Contenido */}
          <div className="PopupSubidaInstagram-form-group">
            <label htmlFor="tipoContenido">
              <Layers className="icono-label" /> Tipo de Contenido
            </label>
            <select
              id="tipoContenido"
              value={tipoContenido}
              onChange={manejarTipoContenido}
              required
            >
              <option value="IMAGE">Imagen</option>
              <option value="VIDEO">Video</option>
              <option value="CAROUSEL">Carrusel</option>
            </select>
          </div>

          {/* Carga de Archivo o URL de Medios */}
          <div className="PopupSubidaInstagram-form-group">
            <label htmlFor="archivoMedios">
              {tipoContenido === 'IMAGE' && <Image className="icono-label" />}
              {tipoContenido === 'VIDEO' && <Video className="icono-label" />}
              {tipoContenido === 'CAROUSEL' && <Layers className="icono-label" />}
              Subir Archivo(s)
            </label>
            <input
              type="file"
              id="archivoMedios"
              name="archivoMedios"
              accept={
                tipoContenido === 'IMAGE'
                  ? 'image/*'
                  : tipoContenido === 'VIDEO'
                  ? 'video/*'
                  : 'image/*,video/*'
              }
              multiple={tipoContenido === 'CAROUSEL'}
              onChange={manejarArchivoMedios}
              required={!urlMedios}
            />
          </div>

          <div className="PopupSubidaInstagram-form-group">
            <label htmlFor="urlMedios">
              <UploadCloud className="icono-label" /> O Ingresar URL
            </label>
            <input
              type="url"
              id="urlMedios"
              name="urlMedios"
              placeholder="https://ejemplo.com/media"
              value={urlMedios}
              onChange={(e) => setUrlMedios(e.target.value)}
              required={!archivoMedios}
            />
          </div>

          {/* Vista Previa del Contenido */}
          {previewUrls.length > 0 && (
            <div className="PopupSubidaInstagram-preview">
              {previewUrls.map((item, idx) => (
                <div key={idx} className="PopupSubidaInstagram-preview-item">
                  {item.type.includes('image') ? (
                    <img src={item.url} alt={`Vista previa ${idx + 1}`} />
                  ) : (
                    <video controls src={item.url} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Leyenda */}
          <div className="PopupSubidaInstagram-form-group">
            <label htmlFor="leyenda">
              <Smile className="icono-label" /> Leyenda
            </label>
            <div className="PopupSubidaInstagram-textarea-wrapper">
              <textarea
                id="leyenda"
                name="leyenda"
                rows="4"
                maxLength="2200"
                value={leyenda}
                onChange={(e) => setLeyenda(e.target.value)}
                placeholder="Escribe una leyenda..."
                required
              />
              <button
                type="button"
                className="PopupSubidaInstagram-emoji-button"
                onClick={() => setMostrarEmojis(!mostrarEmojis)}
              >
                <Smile />
              </button>
            </div>
            <small>{2200 - leyenda.length} caracteres restantes</small>
            {mostrarEmojis && (
              <div className="PopupSubidaInstagram-emoji-picker">
                {/* Simulación de un selector de emojis */}
                {['😊', '😂', '❤️', '👍', '🔥', '🎉'].map((emoji) => (
                  <span
                    key={emoji}
                    onClick={() => agregarEmoji(emoji)}
                    className="PopupSubidaInstagram-emoji"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Miniatura para Videos */}
          {tipoContenido === 'VIDEO' && (
            <div className="PopupSubidaInstagram-form-group">
              <label htmlFor="miniatura">
                <Image className="icono-label" /> Miniatura Personalizada
              </label>
              <input
                type="file"
                id="miniatura"
                name="miniatura"
                accept="image/*"
                onChange={(e) => setMiniatura(e.target.files[0])}
              />
            </div>
          )}

          {/* Ubicación (Opcional) */}
          <div className="PopupSubidaInstagram-form-group">
            <label htmlFor="ubicacion">
              <MapPin className="icono-label" /> Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              placeholder="Agregar ubicación"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>

          {/* Botones de Acción */}
          <div className="PopupSubidaInstagram-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Publicar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupSubidaInstagram;
