// src/components/SessionTypeModal.js
import React from 'react';

const SessionTypeModal = ({ show, onClose, onSelectSessionType }) => {
  if (!show) return null;

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <h2>Selecciona el tipo de sesión</h2>
        <button onClick={() => onSelectSessionType('Set Mode')}>Set Mode</button>
        <button onClick={() => onSelectSessionType('Circuit Mode')}>Circuit Mode</button>
        <button onClick={onClose} style={styles.closeButton}>Cerrar</button>
      </div>
    </div>
  );
};

const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: '10px',
    backgroundColor: '#ccc',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
  }
};

export default SessionTypeModal;
