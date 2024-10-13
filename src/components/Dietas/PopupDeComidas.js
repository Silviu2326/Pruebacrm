import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './popupdecomidas.module.css';
import { Save, XCircle, RefreshCw } from 'lucide-react'; // Importar los íconos de Lucide

const PopupDeComidas = ({ theme, isOpen, closeModal, comidaToEdit, refreshComidas, isOption }) => {
  const [comida, setComida] = useState({
    nombre: '',
    descripcion: '',
    calorias: 0,
    carb: 0,
    protein: 0,
    fat: 0,
    ingredientes: [] // Añadimos un array de ingredientes
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comidaToEdit) {
      setComida(comidaToEdit);
    } else {
      setComida({
        nombre: '',
        descripcion: '',
        calorias: 0,
        carb: 0,
        protein: 0,
        fat: 0,
        ingredientes: [] // Reseteamos los ingredientes si no hay comida a editar
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

  const handleIngredientChange = (index, value) => {
    const newIngredientes = [...comida.ingredientes];
    const factor = value / newIngredientes[index].cantidad; // Ajustar factor de peso
    newIngredientes[index].cantidad = value;
    newIngredientes[index].calorias *= factor;
    newIngredientes[index].carb *= factor;
    newIngredientes[index].protein *= factor;
    newIngredientes[index].fat *= factor;

    setComida({
      ...comida,
      ingredientes: newIngredientes
    });

    // Recalcular totales
    const totalCalories = newIngredientes.reduce((acc, ing) => acc + ing.calorias, 0);
    const totalCarb = newIngredientes.reduce((acc, ing) => acc + ing.carb, 0);
    const totalProtein = newIngredientes.reduce((acc, ing) => acc + ing.protein, 0);
    const totalFat = newIngredientes.reduce((acc, ing) => acc + ing.fat, 0);

    setComida({
      ...comida,
      calorias: totalCalories,
      carb: totalCarb,
      protein: totalProtein,
      fat: totalFat
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
        ingredientes: [
          { nombre: 'Macarrones', cantidad: 100, calorias: 150, carb: 30, protein: 5, fat: 1 },
          { nombre: 'Tomate', cantidad: 50, calorias: 20, carb: 4, protein: 1, fat: 0 }
        ]
      },
      "ensalada cesar": {
        descripcion: 'Ensalada César con aderezo cremoso.',
        ingredientes: [
          { nombre: 'Lechuga', cantidad: 100, calorias: 20, carb: 4, protein: 1, fat: 0 },
          { nombre: 'Aderezo César', cantidad: 30, calorias: 200, carb: 2, protein: 1, fat: 20 }
        ]
      }
    };

    try {
      const comidaNombre = comida.nombre.toLowerCase();
      if (predefinedComidas[comidaNombre]) {
        const comidaGenerada = predefinedComidas[comidaNombre];
        const totalCalories = comidaGenerada.ingredientes.reduce((acc, ing) => acc + ing.calorias, 0);
        const totalCarb = comidaGenerada.ingredientes.reduce((acc, ing) => acc + ing.carb, 0);
        const totalProtein = comidaGenerada.ingredientes.reduce((acc, ing) => acc + ing.protein, 0);
        const totalFat = comidaGenerada.ingredientes.reduce((acc, ing) => acc + ing.fat, 0);

        setComida({
          ...comida,
          descripcion: comidaGenerada.descripcion,
          ingredientes: comidaGenerada.ingredientes,
          calorias: totalCalories,
          carb: totalCarb,
          protein: totalProtein,
          fat: totalFat
        });
      } else {
        const response = await axios.post('/api/comidas/generate-comida', {
          nombre: comida.nombre,
          descripcion: comida.descripcion || ''
        });
        if (response.data) {
          // Si la IA genera ingredientes, puedes manejarlos aquí
          setComida({
            ...comida,
            descripcion: response.data.descripcion || comida.descripcion,
            ingredientes: response.data.ingredientes || [],
            calorias: response.data.calorias || 0,
            carb: response.data.carb || 0,
            protein: response.data.protein || 0,
            fat: response.data.fat || 0
          });
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
        <h2 className={styles.modalTitle}>
          {comidaToEdit ? (isOption ? 'Editar Opción' : 'Editar Comida') : (isOption ? 'Crear Opción' : 'Crear Comida')}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
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
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={comida.descripcion}
                onChange={handleChange}
                className={theme === 'dark' ? styles.dark : ''}
              />
            </div>
          </div>

          {/* Mostrar lista de ingredientes */}
          <div className={styles.ingredientsSection}>
            {comida.ingredientes.map((ingrediente, index) => (
              <div key={index} className={styles.ingredientCard}>
                <div className={styles.ingredientHeader}>
                  <h4>{ingrediente.nombre}</h4>
                </div>
                <div className={styles.ingredientBody}>
                  <label>Cantidad: {ingrediente.cantidad}g</label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={ingrediente.cantidad}
                    onChange={(e) => handleIngredientChange(index, Number(e.target.value))}
                    className={styles.customSlider} // Añadimos una clase para el slider personalizado
                  />
                  <div className={styles.nutritionInfo}>
                    <span>Calorías: {ingrediente.calorias.toFixed(2)}</span>
                    <span>Carb: {ingrediente.carb.toFixed(2)}g</span>
                    <span>Proteínas: {ingrediente.protein.toFixed(2)}g</span>
                    <span>Grasas: {ingrediente.fat.toFixed(2)}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Información Nutricional Total */}
          <div className={styles.totalNutrition}>
            <h3>Información Nutricional Total</h3>
            <div className={styles.nutritionDetails}>
              <div className={styles.nutritionItem}>
                <span>Calorías:</span>
                <span>{comida.calorias.toFixed(2)}</span>
              </div>
              <div className={styles.nutritionItem}>
                <span>Carbohidratos:</span>
                <span>{comida.carb.toFixed(2)}g</span>
              </div>
              <div className={styles.nutritionItem}>
                <span>Proteínas:</span>
                <span>{comida.protein.toFixed(2)}g</span>
              </div>
              <div className={styles.nutritionItem}>
                <span>Grasas:</span>
                <span>{comida.fat.toFixed(2)}g</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
     <div className={styles.actionButtons}>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.cancelButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={closeModal}
            >
              Cancelar
              <XCircle className={styles.icon} />
            </button>
            <button
              type="submit"
              className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
            >
              {comidaToEdit ? 'Guardar Cambios' : 'Crear Comida'}
              <Save className={styles.icon} />
            </button>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.generateButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={generateComidaWithAI}
              disabled={loading || !comida.nombre}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '14px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background 0.3s ease',}}
            >
              {loading ? 'Generando...' : 'Generar Comida con IA'}
              <RefreshCw className={styles.icon} />
            </button>
            </div>

        </form>
        
      </div>
    </div>
  );
};

export default PopupDeComidas;
