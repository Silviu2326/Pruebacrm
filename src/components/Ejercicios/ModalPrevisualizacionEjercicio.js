import React from 'react';
import './ModalPrevisualizacionEjercicio.css';

const ModalPrevisualizacionEjercicio = ({ isOpen, onClose, exercise, theme }) => {
  if (!isOpen || !exercise) return null;

  const youtubeUrlPattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  const match = exercise.videoTutorial.match(youtubeUrlPattern);
  const videoId = match ? match[1] : null;

  return (
    <div className="modal-previsualizacion-ejercicio-overlay">
      <div className={`modal-previsualizacion-ejercicio ${theme}`}>
        <h2 className={theme}>{exercise.nombre}</h2>
        <p className={theme}>{exercise.descripcion}</p>
        {exercise.grupoMuscular.length > 0 && (
          <div className={theme}>
            <strong>Grupo Muscular:</strong> {exercise.grupoMuscular.join(', ')}
          </div>
        )}
        {exercise.equipamiento.length > 0 && (
          <div className={theme}>
            <strong>Equipamiento Necesario:</strong> {exercise.equipamiento.join(', ')}
          </div>
        )}
        {videoId && (
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Video"
            ></iframe>
          </div>
        )}
        <button onClick={onClose} className={`red ${theme}`}
        style={{
          background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalPrevisualizacionEjercicio;
