// Modal.js
import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children, theme }) {
  if (!isOpen) return null;

  return (
    <div className={`uniquePrefix-modal-overlay ${theme}`}>
      <div className={`uniquePrefix-modal-content ${theme}`}>
        <button className= {`uniquePrefix-modal-close-button ${theme}`}onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
