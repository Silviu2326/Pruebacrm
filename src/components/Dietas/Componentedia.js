import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Comidacomponente from './Comidacomponente';
import Modaldevisiondecomida from './Modaldevisiondecomida';
import PopupDeComidas from './PopupDeComidas';
import axios from 'axios';
import 'chart.js/auto';
import styles from './Componentedia.module.css';

Chart.register(ArcElement, Tooltip, Legend);

const Componentedia = ({
  dia,
  weekday,
  date,
  macros = { carb: 0, protein: 0, fat: 0, kcal: 0 },
  onEditComida,
}) => {
  const [comidas, setComidas] = useState([]); // Estado de las comidas
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [viewComidaData, setViewComidaData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar el Popup de comidas
  const [isEditMacrosVisible, setIsEditMacrosVisible] = useState(false); // Controlar visibilidad del formulario
  const [editedMacros, setEditedMacros] = useState(macros); // Estado para los macros editados
  const [chartData, setChartData] = useState({
    labels: ['Carbohidratos', 'Proteína', 'Grasa'],
    datasets: [
      {
        data: [macros.carb, macros.protein, macros.fat],
        backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
      },
    ],
  });

  // Función para refrescar las comidas
  const refreshComidas = async () => {
    try {
      const response = await axios.get(`/api/comidas?dia=${dia}`); // Filtra comidas por día
      setComidas(response.data); // Actualiza el estado con la lista de comidas del día seleccionado
    } catch (error) {
      console.error('Error fetching comidas:', error);
    }
  };

  useEffect(() => {
    refreshComidas(); // Refresca las comidas cuando el componente se monta
  }, [dia]);

  useEffect(() => {
    const newChartData = {
      labels: ['Carbohidratos', 'Proteína', 'Grasa'],
      datasets: [
        {
          data: [editedMacros.carb, editedMacros.protein, editedMacros.fat],
          backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
        },
      ],
    };

    setChartData(newChartData);
  }, [editedMacros]);

  // Actualizar el gráfico de calorías en el Doughnut
  const getDoughnutData = () => ({
    labels: ['Carbohidratos', 'Proteína', 'Grasa'],
    datasets: [
      {
        data: [editedMacros.carb, editedMacros.protein, editedMacros.fat],
        backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
      },
    ],
  });

  // Plugin para mostrar las calorías en el centro del gráfico Doughnut
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = `${editedMacros.kcal} kcal`;
      const textX = width / 2;
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.restore();
    },
  };

  // Registrar el plugin en Chart.js
  Chart.register(centerTextPlugin);

  const handleViewComida = (index) => {
    setViewComidaData(comidas[index]);
    setIsModalViewOpen(true);
  };

  const handleDeleteComida = async (index) => {
    const comidaToDelete = comidas[index];
    try {
      await axios.delete(`/api/comidas/${comidaToDelete._id}`); // Elimina la comida de la base de datos
      const updatedComidas = comidas.filter((_, i) => i !== index); // Actualiza el estado local
      setComidas(updatedComidas); // Actualiza la lista de comidas localmente
    } catch (error) {
      console.error('Error deleting comida:', error);
    }
  };

  const totalMacros = editedMacros.carb + editedMacros.protein + editedMacros.fat;

  const getBarWidth = (value) => (value / totalMacros) * 100;

  // Función para manejar los cambios en el formulario de edición de macros
  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setEditedMacros({ ...editedMacros, [name]: Number(value) });
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' }) : '';
  const formattedTitle = weekday && formattedDate ? ` ${dia} (${weekday} ${formattedDate})` : `Día ${dia}`;

  // Definir las opciones para el gráfico de Doughnut
  const doughnutOptions = {
    plugins: {
      legend: {
        display: false, // Oculta la leyenda del gráfico
      },
      tooltip: {
        enabled: true, // Activa los tooltips al pasar sobre el gráfico
      },
      centerText: {
        display: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{formattedTitle}</h3>

      {/* Mostrar el botón para editar macros */}
      <button
        className={styles.editButton}
        onClick={() => setIsEditMacrosVisible(!isEditMacrosVisible)}
      >
        {isEditMacrosVisible ? 'Ocultar' : 'Editar Macros'}
      </button>

      {/* Mostrar el formulario solo si se presionó el botón */}
      {isEditMacrosVisible && (
        <div className={styles.editMacrosForm}>
          <h4>Editar Macros</h4>
          <div className={styles.formGroup}>
            <label>Carbohidratos (g)</label>
            <input
              type="number"
              name="carb"
              value={editedMacros.carb}
              onChange={handleMacroChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proteínas (g)</label>
            <input
              type="number"
              name="protein"
              value={editedMacros.protein}
              onChange={handleMacroChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Grasas (g)</label>
            <input
              type="number"
              name="fat"
              value={editedMacros.fat}
              onChange={handleMacroChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Calorías (kcal)</label>
            <input
              type="number"
              name="kcal"
              value={editedMacros.kcal}
              onChange={handleMacroChange}
            />
          </div>
        </div>
      )}

      <div className={styles.macrosContainer}>
        <div className={styles.barsContainer}>
          {/* Carbohidratos */}
          <div className={styles.barChart}>
            <div className={styles.barLabel}>
              Carbohidratos: {editedMacros.carb}g
            </div>
            <div className={styles.barValue}>
              ({getBarWidth(editedMacros.carb).toFixed(1)}%)
            </div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(editedMacros.carb)}%`, backgroundColor: '#36A2EB' }}
              ></div>
            </div>
          </div>

          {/* Proteína */}
          <div className={styles.barChart}>
            <div className={styles.barLabel}>
              Proteína: {editedMacros.protein}g
            </div>
            <div className={styles.barValue}>
              ({getBarWidth(editedMacros.protein).toFixed(1)}%)
            </div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(editedMacros.protein)}%`, backgroundColor: '#FF6384' }}
              ></div>
            </div>
          </div>

          {/* Grasa */}
          <div className={styles.barChart}>
            <div className={styles.barLabel}>
              Grasa: {editedMacros.fat}g
            </div>
            <div className={styles.barValue}>
              ({getBarWidth(editedMacros.fat).toFixed(1)}%)
            </div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(editedMacros.fat)}%`, backgroundColor: '#4CAF50' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Gráfico Doughnut */}
        <div className={styles.donutContainer}>
          <Doughnut data={getDoughnutData()} options={doughnutOptions} />
        </div>
      </div>

      <div className={styles.comidasContainer}>
        {comidas.map((comida, index) => (
          <Comidacomponente
            key={index}
            comida={comida}
            totalMacros={editedMacros} // Pasamos los macros totales del día al componente Comidacomponente
            onView={() => handleViewComida(index)}
            onEdit={() => onEditComida(index)}
            onDelete={() => handleDeleteComida(index)}
          />
        ))}
      </div>
      <button className={styles.addButton} onClick={() => setIsPopupOpen(true)}>
        +
      </button>

      {isPopupOpen && (
        <PopupDeComidas
          isOpen={isPopupOpen}
          closeModal={() => setIsPopupOpen(false)}
          refreshComidas={refreshComidas}
          dia={dia}
        />
      )}

      <Modaldevisiondecomida
        isOpen={isModalViewOpen}
        onClose={() => setIsModalViewOpen(false)}
        comida={viewComidaData}
      />
    </div>
  );
};

export default Componentedia;
