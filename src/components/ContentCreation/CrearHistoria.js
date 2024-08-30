import React, { useState } from 'react';
import './CrearHistoria.css';

const CrearHistoria = ({ showModal, handleCloseModal }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={handleCloseModal}>
          &times;
        </button>
        <div className="modal-body">
          <div className="modal-header">
            <h2>Paso {step} de {totalSteps}</h2>
          </div>
          {step === 1 && (
            <>
              <h3>Generador de Ideas para Story</h3>
              <p>Prompt para el Generador de Ideas:</p>
              <pre>
                {`"Genera 5 ideas creativas y atractivas para stories de Instagram orientadas a entrenadores personales...`}
              </pre>
            </>
          )}
          {step === 2 && (
            <>
              <h3>Recomendaciones para el Display y Texto con GPT de Canva</h3>
              <p>Prompt para Canva (GPT):</p>
              <pre>
                {`"Basado en la siguiente idea generada: [inserta la idea generada en el paso 1]...`}
              </pre>
            </>
          )}
          {step === 3 && (
            <>
              <h3>Generación de Imágenes con Image Generator</h3>
              <p>Prompt para el Image Generator:</p>
              <pre>
                {`"Contexto: Estamos en el proceso de crear una story de Instagram para un entrenador personal...`}
              </pre>
            </>
          )}
          {step === 4 && (
            <>
              <h3>Generador de Caption</h3>
              <p>Prompt para el Generador de Captions:</p>
              <pre>
                {`"Genera un texto breve y llamativo para acompañar una story de Instagram basada en la siguiente imagen...`}
              </pre>
            </>
          )}
          {step === 5 && (
            <>
              <h3>Creación de la Story en el Software de Edición de Fotos</h3>
              <p>Instrucciones:</p>
              <pre>
                {`"Utiliza las recomendaciones, la imagen generada y el texto proporcionado en los pasos anteriores...`}
              </pre>
            </>
          )}
          {step === 6 && (
            <>
              <h3>Almacenar Story</h3>
              <p>Instrucciones para Almacenar la Story:</p>
              <pre>
                {`"Guarda la imagen final en una carpeta específica en tu dispositivo...`}
              </pre>
            </>
          )}
          {step === 7 && (
            <>
              <h3>Publicar Story en Instagram</h3>
              <p>Instrucciones para Publicar:</p>
              <pre>
                {`"Sube la imagen final a tu cuenta de Instagram y publica la story...`}
              </pre>
            </>
          )}
          <div className="modal-footer">
            <button onClick={prevStep} disabled={step === 1}>
              Anterior
            </button>
            {step < totalSteps ? (
              <button onClick={nextStep}>
                Siguiente
              </button>
            ) : (
              <button onClick={handleCloseModal}>
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearHistoria;
