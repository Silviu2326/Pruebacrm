import React, { useState } from 'react';
import './CrearPost.css';

const CrearPost = ({ showModal, handleCloseModal }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  if (!showModal) return null;

  const steps = [
    {
      title: "Generador de Ideas para Post",
      description: "Prompt para el Generador de Ideas:",
      content: `"Genera 5 ideas creativas y atractivas para posts de Instagram orientados a entrenadores personales..."`
    },
    {
      title: "Recomendaciones para el Display y Texto con GPT de Canva",
      description: "Prompt para Canva (GPT):",
      content: `"Basado en la siguiente idea generada: [inserta la idea generada en el paso 1]..."`
    },
    {
      title: "Generación de Imágenes con Image Generator",
      description: "Prompt para el Image Generator:",
      content: `"Contexto: Estamos en el proceso de crear una publicación de Instagram para un entrenador personal..."`
    },
    {
      title: "Generador de Caption",
      description: "Prompt para el Generador de Captions:",
      content: `"Genera un caption atractivo para un post de Instagram basado en la siguiente serie de imágenes y texto..."`
    },
    {
      title: "Creación de la Publicación en el Software de Edición de Fotos",
      description: "Instrucciones:",
      content: `"Utiliza las recomendaciones, el diseño conceptual, las imágenes generadas y el texto proporcionado..."`
    },
    {
      title: "Almacenar Post",
      description: "Instrucciones para Almacenar el Post:",
      content: `"Guarda la imagen final y el caption en una carpeta específica en tu dispositivo..."`
    },
    {
      title: "Programar Publicación en Metricool",
      description: "Instrucciones para Programar:",
      content: `"Sube la imagen final y el caption a Metricool..."`
    }
  ];

  return (
    <div className="crearpost-modal-overlay" onClick={handleCloseModal}>
      <div className="crearpost-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="crearpost-modal-close-button" onClick={handleCloseModal}>
          &times;
        </button>

        <div className="crearpost-modal-progress">
          Paso {step} de {steps.length}
        </div>

        <h2 className="crearpost-modal-title">{steps[step - 1].title}</h2>
        <p className="crearpost-modal-description">{steps[step - 1].description}</p>
        <pre className="crearpost-modal-content-text">{steps[step - 1].content}</pre>

        <div className="crearpost-modal-buttons">
          <button onClick={prevStep} disabled={step === 1}>
            Anterior
          </button>
          <button onClick={nextStep} disabled={step === steps.length}>
            {step === steps.length ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearPost;
