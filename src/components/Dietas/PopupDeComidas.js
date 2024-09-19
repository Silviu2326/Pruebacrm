import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './popupdecomidas.module.css';

const PopupDeComidas = ({ theme, isOpen, closeModal, comidaToEdit, refreshComidas, isOption }) => {
  const [comida, setComida] = useState({
    nombre: '',
    descripcion: '',
    calorias: '',
    carb: '',
    protein: '',
    fat: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comidaToEdit) {
      setComida(comidaToEdit);
    } else {
      setComida({
        nombre: '',
        descripcion: '',
        calorias: '',
        carb: '',
        protein: '',
        fat: ''
      });
    }
  }, [comidaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComida({
      ...comida,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comidaToEdit) {
        await axios.put(`/api/${isOption ? 'opciones' : 'comidas'}/${comidaToEdit._id}`, comida);
      } else {
        await axios.post(`/api/${isOption ? 'opciones' : 'comidas'}`, comida);
      }
      refreshComidas(); 
      closeModal();
    } catch (error) {
      console.error('Error saving comida:', error);
    }
  };

  const generateComidaWithAI = async () => {
    setLoading(true);
    
    const predefinedComidas = {
      "macarrones con tomate": {
        descripcion: 'Deliciosos macarrones con salsa de tomate casera.',
        calorias: '350',
        carb: '50',
        protein: '12',
        fat: '10'
      },
      "ensalada cesar": {
        descripcion: 'Ensalada César con aderezo cremoso.',
        calorias: '250',
        carb: '20',
        protein: '8',
        fat: '15'
      },
      "pizza margarita": {
        descripcion: 'Pizza Margarita con queso y tomate fresco.',
        calorias: '400',
        carb: '60',
        protein: '15',
        fat: '18'
      }
    };

    try {
      const comidaNombre = comida.nombre.toLowerCase();
      console.log('Generando comida para:', comidaNombre);

      if (predefinedComidas[comidaNombre]) {
        const comidaGenerada = predefinedComidas[comidaNombre];
        setComida({
          ...comida,
          ...comidaGenerada
        });
        console.log('Comida predefinida aplicada:', comidaGenerada);
      } else {
        const response = await axios.post('/api/comidas/generate-comida', {
          nombre: comida.nombre,
          descripcion: comida.descripcion || '',
        });

        if (response.data) {
          setComida({
            ...comida,
            descripcion: response.data.descripcion || comida.descripcion,
            calorias: response.data.calorias || '',
            carb: response.data.carb || '',
            protein: response.data.protein || '',
            fat: response.data.fat || ''
          });
          console.log('Datos generados por IA:', response.data);
        }
      }
    } catch (error) {
      console.error('Error generando comida:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={`${styles.modalContent} ${theme === 'dark' ? styles.dark : ''}`}>
        <h2>{comidaToEdit ? (isOption ? 'Editar Opción' : 'Editar Comida') : (isOption ? 'Crear Opción' : 'Crear Comida')}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.flexContainer}>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={comida.nombre}
                onChange={handleChange}
                className={theme === 'dark' ? styles.dark : ''}
                required
              />
            </div>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.generateButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={generateComidaWithAI}
              disabled={loading || !comida.nombre}
            >
              {loading ? 'Generando...' : 'Generar Comida con IA'}
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={comida.descripcion}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Calorías</label>
            <input
              type="number"
              name="calorias"
              value={comida.calorias}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Carbohidratos</label>
            <input
              type="number"
              name="carb"
              value={comida.carb}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proteínas</label>
            <input
              type="number"
              name="protein"
              value={comida.protein}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Grasas</label>
            <input
              type="number"
              name="fat"
              value={comida.fat}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
            >
              {comidaToEdit ? (isOption ? 'Guardar Opción' : 'Guardar Cambios') : (isOption ? 'Crear Opción' : 'Crear Comida')}
            </button>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.cancelButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupDeComidas;
