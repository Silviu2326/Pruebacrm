import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import { ic_add_circle_outline } from 'react-icons-kit/md/ic_add_circle_outline';
import { ic_add } from 'react-icons-kit/md/ic_add';
import { ic_remove } from 'react-icons-kit/md/ic_remove';
import styles from './Comidacomponente.module.css';
import PopupDeComidas from './PopupDeComidas';  // Importamos el componente Popup

// Importamos el componente de Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';

// Importar la imagen por defecto y la imagen específica para macarrones con tomate
import defaultImage from './Image-not-found.png';
import macarronesConTomateImage from './macarrones-con-tomate.jpg';

const Comidacomponente = ({ comida, totalMacros, onAddOptions, onDelete }) => {
  const [gramos, setGramos] = useState(comida.gramos || 100); // Estado para los gramos
  const [scaledMacros, setScaledMacros] = useState({
    calorias: comida.calorias,
    carb: comida.carb,
    protein: comida.protein,
    fat: comida.fat,
  }); // Estado para los macros ajustados

  // Controlar el estado del modal de opciones (Popup)
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState('comida');  // Tab activo para alternar entre comida y opciones

  // Verificamos si hay más de una opción y añadimos un log para verificarlo
  const hasMoreThanOneOption = comida.opciones && comida.opciones.length > 1;
  console.log('Opciones:', comida.opciones);  // Para verificar si `comida.opciones` existe y tiene datos
  console.log('Tiene más de una opción:', hasMoreThanOneOption);  // Para ver si la condición se evalúa correctamente

  // Función para abrir el modal de opciones
  const handleAddOptions = () => {
    setIsPopupOpen(true);
  };

  // Función para cerrar el modal de opciones
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Función para escalar los macros proporcionalmente
  const ajustarMacros = (nuevosGramos) => {
    const factor = nuevosGramos / 100; // Proporción basada en 100 gramos
    setScaledMacros({
      calorias: (comida.calorias * factor).toFixed(1),  // Recalcula las calorías
      carb: (comida.carb * factor).toFixed(1),          // Recalcula carbohidratos
      protein: (comida.protein * factor).toFixed(1),    // Recalcula proteínas
      fat: (comida.fat * factor).toFixed(1),            // Recalcula grasas
    });
  };

  // Función para aumentar gramos y ajustar macros
  const aumentarGramos = () => {
    const nuevosGramos = gramos + 10;
    setGramos(nuevosGramos);
    ajustarMacros(nuevosGramos);
  };

  // Función para disminuir gramos y ajustar macros
  const disminuirGramos = () => {
    if (gramos > 10) {
      const nuevosGramos = gramos - 10;
      setGramos(nuevosGramos);
      ajustarMacros(nuevosGramos);
    }
  };

  // Seleccionar la imagen adecuada en función del nombre de la comida
  const getComidaImage = () => {
    if (comida.nombre && comida.nombre.toLowerCase() === 'macarrones con tomate') {
      return macarronesConTomateImage; // Usar la imagen específica
    }
    return comida.imagen ? comida.imagen : defaultImage; // Usar la imagen de la comida o la imagen por defecto
  };

  // Calcular el porcentaje de cada macro respecto a los macros totales del día
  const calcularPorcentaje = (macro, totalMacro) => {
    if (totalMacro === 0) return 0;
    return ((macro / totalMacro) * 100).toFixed(1); // Formatear con un decimal
  };

  return (
    <div className={styles.comidaItem}>
      {/* Solo mostrar los tabs si hay más de una opción */}
      {hasMoreThanOneOption && (
        <Tabs defaultValue="comida" className={styles.tabs}>
          <TabsList>
            <TabsTrigger value="comida">Comida</TabsTrigger>
            <TabsTrigger value="opciones">Opciones</TabsTrigger>
          </TabsList>

          <TabsContent value="comida">
            <div className={styles.actions}>
              <button className={styles.iconButton} onClick={onDelete} title="Eliminar">
                <Icon icon={ic_delete_outline} size={20} />
              </button>
            </div>

            <div className={styles.imageContainer}>
              <img 
                src={getComidaImage()} 
                alt={comida.nombre} 
                className={styles.foodImage} 
              />
            </div>

            <p className={styles.comidaName}><strong>{comida.nombre}</strong></p>

            <div className={styles.macroInfo}>
              {/* Barra de Carbohidratos */}
              <div className={styles.progressWrapper}>
                <span>Carbohidratos: {scaledMacros.carb}g</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{ width: `${calcularPorcentaje(scaledMacros.carb, totalMacros.carb)}%`, backgroundColor: '#42a5f5' }}
                  ></div>
                  <span 
                    className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.carb, totalMacros.carb) > 100 ? styles.highPercentage : ''}`}>
                    ({calcularPorcentaje(scaledMacros.carb, totalMacros.carb)}%)
                  </span>
                </div>
              </div>

              {/* Barra de Proteínas */}
              <div className={styles.progressWrapper}>
                <span>Proteínas: {scaledMacros.protein}g</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{ width: `${calcularPorcentaje(scaledMacros.protein, totalMacros.protein)}%`, backgroundColor: '#ef5350' }}
                  ></div>
                  <span 
                    className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.protein, totalMacros.protein) > 100 ? styles.highPercentage : ''}`}>
                    ({calcularPorcentaje(scaledMacros.protein, totalMacros.protein)}%)
                  </span>
                </div>
              </div>

              {/* Barra de Grasas */}
              <div className={styles.progressWrapper}>
                <span>Grasas: {scaledMacros.fat}g</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{ width: `${calcularPorcentaje(scaledMacros.fat, totalMacros.fat)}%`, backgroundColor: '#66bb6a' }}
                  ></div>
                  <span 
                    className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.fat, totalMacros.fat) > 100 ? styles.highPercentage : ''}`}>
                    ({calcularPorcentaje(scaledMacros.fat, totalMacros.fat)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.gramosSection}>
              <span><strong>{gramos}</strong> gramos</span>
              <span className={styles.caloriasInfo}><strong>{scaledMacros.calorias}</strong> calorías</span>
              <div className={styles.gramosButtons}>
                <button className={styles.gramosButton} onClick={disminuirGramos}>
                  <Icon icon={ic_remove} size={18} />
                </button>
                <button className={styles.gramosButton} onClick={aumentarGramos}>
                  <Icon icon={ic_add} size={18} />
                </button>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.addOptionsButton} onClick={handleAddOptions}>
                <Icon icon={ic_add_circle_outline} size={18} /> Añadir Opciones
              </button>
            </div>
          </TabsContent>

          <TabsContent value="opciones">
            {/* Aquí pasamos isOption para indicar que es una opción */}
            <PopupDeComidas
              isOpen={true}
              closeModal={handleClosePopup}
              comidaToEdit={comida}
              refreshComidas={() => {}}
              theme="light"
              isOption={true}  
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Si no hay más de una opción, renderizar la vista normal */}
      {!hasMoreThanOneOption && (
        <>
          <div className={styles.actions}>
            <button className={styles.iconButton} onClick={onDelete} title="Eliminar">
              <Icon icon={ic_delete_outline} size={20} />
            </button>
          </div>

          <div className={styles.imageContainer}>
            <img 
              src={getComidaImage()} 
              alt={comida.nombre} 
              className={styles.foodImage} 
            />
          </div>

          <p className={styles.comidaName}><strong>{comida.nombre}</strong></p>

          <div className={styles.macroInfo}>
            {/* Barra de Carbohidratos */}
            <div className={styles.progressWrapper}>
              <span>Carbohidratos: {scaledMacros.carb}g</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${calcularPorcentaje(scaledMacros.carb, totalMacros.carb)}%`, backgroundColor: '#42a5f5' }}
                ></div>
                <span 
                  className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.carb, totalMacros.carb) > 100 ? styles.highPercentage : ''}`}>
                  ({calcularPorcentaje(scaledMacros.carb, totalMacros.carb)}%)
                </span>
              </div>
            </div>

            {/* Barra de Proteínas */}
            <div className={styles.progressWrapper}>
              <span>Proteínas: {scaledMacros.protein}g</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${calcularPorcentaje(scaledMacros.protein, totalMacros.protein)}%`, backgroundColor: '#ef5350' }}
                ></div>
                <span 
                  className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.protein, totalMacros.protein) > 100 ? styles.highPercentage : ''}`}>
                  ({calcularPorcentaje(scaledMacros.protein, totalMacros.protein)}%)
                </span>
              </div>
            </div>

            {/* Barra de Grasas */}
            <div className={styles.progressWrapper}>
              <span>Grasas: {scaledMacros.fat}g</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${calcularPorcentaje(scaledMacros.fat, totalMacros.fat)}%`, backgroundColor: '#66bb6a' }}
                ></div>
                <span 
                  className={`${styles.percentage} ${calcularPorcentaje(scaledMacros.fat, totalMacros.fat) > 100 ? styles.highPercentage : ''}`}>
                  ({calcularPorcentaje(scaledMacros.fat, totalMacros.fat)}%)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.gramosSection}>
            <span><strong>{gramos}</strong> gramos</span>
            <span className={styles.caloriasInfo}><strong>{scaledMacros.calorias}</strong> calorías</span>
            <div className={styles.gramosButtons}>
              <button className={styles.gramosButton} onClick={disminuirGramos}>
                <Icon icon={ic_remove} size={18} />
              </button>
              <button className={styles.gramosButton} onClick={aumentarGramos}>
                <Icon icon={ic_add} size={18} />
              </button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.addOptionsButton} onClick={handleAddOptions}>
              <Icon icon={ic_add_circle_outline} size={18} /> Añadir Opciones
            </button>
          </div>

          {/* Modal de PopupDeComidas */}
          {isPopupOpen && (
            <PopupDeComidas
              isOpen={isPopupOpen}
              closeModal={handleClosePopup}
              comidaToEdit={comida}
              refreshComidas={() => {}}
              theme="light"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Comidacomponente;
