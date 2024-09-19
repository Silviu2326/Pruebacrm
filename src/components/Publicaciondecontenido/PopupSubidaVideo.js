import React, { useState, useRef } from 'react';
import './PopupSubidaVideo.css';
import { X, Video, Image, Sliders } from 'lucide-react';

const PopupSubidaVideo = ({ onClose }) => {
  const [videoArchivo, setVideoArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [miniaturaPersonalizada, setMiniaturaPersonalizada] = useState(null);
  const [miniaturaPreview, setMiniaturaPreview] = useState(null);
  const [programado, setProgramado] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const videoRef = useRef(null);

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

  const manejarMiniaturaPersonalizada = (e) => {
    const file = e.target.files[0];
    setMiniaturaPersonalizada(file);

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setMiniaturaPreview(url);
    } else {
      setMiniaturaPreview(null);
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();

    const titulo = e.target.elements.titulo.value;
    const descripcion = e.target.elements.descripcion.value;
    const etiquetas = e.target.elements.etiquetas.value.split(',');
    const privacidad = e.target.elements.privacidad.value;
    const fechaProgramada = programado
      ? `${e.target.elements.fechaProgramada.value}T${e.target.elements.horaProgramada.value}:00Z`
      : null;

    const requestBody = {
      snippet: {
        title: titulo,
        description: descripcion,
        tags: etiquetas,
        categoryId: '22', // Ejemplo de categoría (People & Blogs)
      },
      status: {
        privacyStatus: privacidad,
        publishAt: programado ? fechaProgramada : undefined,
      },
    };

    console.log('Datos del video que se enviarán:');
    console.log(requestBody);
    console.log('Archivo de video:', videoArchivo);
    if (miniaturaPersonalizada) {
      console.log('Miniatura personalizada:', miniaturaPersonalizada);
    }
    console.log('Tiempo de inicio:', startTime);
    console.log('Tiempo de fin:', endTime);

    onClose();
  };

  const manejarCargaDeVideo = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setEndTime(duration);
    }
  };

  const manejarRecorteInicio = (e) => {
    const value = parseFloat(e.target.value);
    setStartTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const manejarRecorteFin = (e) => {
    const value = parseFloat(e.target.value);
    setEndTime(value);
  };

  return (
    <div className="PopupSubidaVideo-overlay">
      <div className="PopupSubidaVideo-content">
        <button className="PopupSubidaVideo-close" onClick={onClose}>
          <X />
        </button>
        <h2>Subir Video a YouTube</h2>
        <form onSubmit={manejarSubmit}>
          {/* Selección de archivo de video */}
          <div className="PopupSubidaVideo-form-group">
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

          {/* Vista previa del video */}
          {previewUrl && (
            <>
              <div className="PopupSubidaVideo-video-preview">
                <video
                  ref={videoRef}
                  controls
                  src={previewUrl}
                  onLoadedMetadata={manejarCargaDeVideo}
                />
              </div>

              {/* Línea de tiempo para recortar */}
              <div className="PopupSubidaVideo-timeline">
                <label>
                  <Sliders className="icono-label" /> Recortar Video:
                </label>
                <div className="PopupSubidaVideo-timeline-range">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    step="0.1"
                    value={startTime}
                    onChange={manejarRecorteInicio}
                  />
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    step="0.1"
                    value={endTime}
                    onChange={manejarRecorteFin}
                  />
                </div>
                <div className="PopupSubidaVideo-timeline-info">
                  <span>Inicio: {startTime.toFixed(1)}s</span>
                  <span>Fin: {endTime.toFixed(1)}s</span>
                </div>
              </div>
            </>
          )}

          {/* Título del video */}
          <div className="PopupSubidaVideo-form-group">
            <label htmlFor="titulo">Título del Video (max. 100 caracteres)</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              maxLength="100"
              required
            />
          </div>

          {/* Descripción del video */}
          <div className="PopupSubidaVideo-form-group">
            <label htmlFor="descripcion">Descripción del Video</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="4"
              placeholder="Describe el contenido del video..."
            />
          </div>

          {/* Etiquetas */}
          <div className="PopupSubidaVideo-form-group">
            <label htmlFor="etiquetas">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              id="etiquetas"
              name="etiquetas"
              placeholder="Ejemplo: React, Tutorial, JavaScript"
            />
          </div>

          {/* Configuración de privacidad */}
          <div className="PopupSubidaVideo-form-group">
            <label htmlFor="privacidad">Configuración de Privacidad</label>
            <select
              id="privacidad"
              name="privacidad"
              onChange={(e) => setProgramado(e.target.value === 'Programado')}
              required
            >
              <option value="Publico">Público</option>
              <option value="NoListado">No listado</option>
              <option value="Privado">Privado</option>
              <option value="Programado">Programado</option>
            </select>
          </div>

          {/* Selector de fecha y hora si es programado */}
          {programado && (
            <>
              <div className="PopupSubidaVideo-form-group">
                <label htmlFor="fechaProgramada">Fecha Programada</label>
                <input
                  type="date"
                  id="fechaProgramada"
                  name="fechaProgramada"
                  required
                />
              </div>
              <div className="PopupSubidaVideo-form-group">
                <label htmlFor="horaProgramada">Hora Programada</label>
                <input
                  type="time"
                  id="horaProgramada"
                  name="horaProgramada"
                  required
                />
              </div>
            </>
          )}

          {/* Selección de miniatura */}
          <div className="PopupSubidaVideo-form-group">
            <label htmlFor="miniaturaPersonalizada">
              <Image className="icono-label" /> Subir Miniatura Personalizada
            </label>
            <input
              type="file"
              id="miniaturaPersonalizada"
              name="miniaturaPersonalizada"
              accept="image/*"
              onChange={manejarMiniaturaPersonalizada}
            />
            {miniaturaPreview && (
              <div className="PopupSubidaVideo-miniatura-preview">
                <img src={miniaturaPreview} alt="Vista previa de la miniatura" />
              </div>
            )}
          </div>

          {/* Opciones Avanzadas */}
          <details className="PopupSubidaVideo-avanzadas">
            <summary>Opciones Avanzadas</summary>
            <div className="PopupSubidaVideo-form-group">
              <label htmlFor="audiencia">Audiencia</label>
              <select id="audiencia" name="audiencia" required>
                <option value="no-ninos">No es contenido para niños</option>
                <option value="ninos">Contenido para niños</option>
              </select>
            </div>
            <div className="PopupSubidaVideo-form-group">
              <label htmlFor="categoria">Categoría del Video</label>
              <select id="categoria" name="categoria" required>
                <option value="Educacion">Educación</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Musica">Música</option>
                {/* Puedes agregar más categorías según sea necesario */}
              </select>
            </div>
            <div className="PopupSubidaVideo-form-group">
              <label htmlFor="comentarios">Comentarios</label>
              <select id="comentarios" name="comentarios" required>
                <option value="permitidos">Permitir Comentarios</option>
                <option value="desactivados">Desactivar Comentarios</option>
              </select>
            </div>
            <div className="PopupSubidaVideo-form-group">
              <label htmlFor="valoraciones">Mostrar Valoraciones</label>
              <select id="valoraciones" name="valoraciones" required>
                <option value="mostrar">Mostrar valoraciones</option>
                <option value="ocultar">Ocultar valoraciones</option>
              </select>
            </div>
            <div className="PopupSubidaVideo-form-group">
              <label htmlFor="licencia">Licencia y Distribución</label>
              <select id="licencia" name="licencia" required>
                <option value="youtube">Licencia estándar de YouTube</option>
                <option value="creative-commons">Creative Commons</option>
              </select>
            </div>
          </details>

          {/* Botones de acción */}
          <div className="PopupSubidaVideo-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Subir Video</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupSubidaVideo;
