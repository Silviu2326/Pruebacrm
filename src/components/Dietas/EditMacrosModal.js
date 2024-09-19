import React, { useState } from 'react';
import styles from './EditMacrosModal.module.css';

const EditMacrosModal = ({ macros, onClose, onSave }) => {
  const [localMacros, setLocalMacros] = useState(macros);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalMacros({ ...localMacros, [name]: Number(value) });
  };

  const handleSave = () => {
    onSave(localMacros); // Guardar los cambios
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Editar Macros</h3>
        <div className={styles.formGroup}>
          <label>Carbohidratos (g)</label>
          <input type="number" name="carb" value={localMacros.carb} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Proteína (g)</label>
          <input type="number" name="protein" value={localMacros.protein} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Grasa (g)</label>
          <input type="number" name="fat" value={localMacros.fat} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Calorías (kcal)</label>
          <input type="number" name="kcal" value={localMacros.kcal} onChange={handleChange} />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.saveButton}>Guardar</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditMacrosModal;
