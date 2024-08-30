// src/components/TextTools.js
import React, { useState } from 'react';

const ToolPanel = ({ activeTool, addTextToCanvas, addElementToCanvas }) => {
  const [textInput, setTextInput] = useState('');

  const handleAddText = () => {
    if (textInput.trim() !== '') {
      addTextToCanvas(textInput);
      setTextInput(''); // Limpiar el campo de entrada después de enviar el texto
    }
  };

  return (
    <div className="Canva-tool-panel">
      {activeTool === 'text' && (
        <>
          <h3>Herramientas de text</h3>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Escribe tu texto aquí"
            className="Canva-text-input"
          />
          <button onClick={handleAddText} className="Canva-add-text-button">
            Añadir texto
          </button>
          {/* Resto de las herramientas de texto */}
          <select>
            <option>Seleccionar fuente</option>
          </select>
          <input type="number" defaultValue={16} /> px
          <div>
            <button>B</button>
            <button>I</button>
            <button>U</button>
            <button>Left</button>
            <button>Center</button>
            <button>Right</button>
          </div>
          <div>
            <label>Espaciado entre líneas</label>
            <input type="range" min="0" max="50" />
          </div>
          <div>
            <label>Espaciado entre letras</label>
            <input type="range" min="0" max="50" />
          </div>
        </>
      )}
      {activeTool === 'elements' && (
        <>
          <h3>Herramientas de elements</h3>
          {/* Añadir elementos al canvas */}
          <button onClick={() => addElementToCanvas('square')}>Square</button>
          <button onClick={() => addElementToCanvas('circle')}>Circle</button>
          <button onClick={() => addElementToCanvas('triangle')}>Triangle</button>
          <div>
            <label>Grosor de línea</label>
            <input type="range" min="0" max="10" />
          </div>
        </>
      )}
      {activeTool === 'draw' && (
        <>
          <h3>Herramientas de draw</h3>
          {/* Aquí va el código para las herramientas de dibujo */}
          <button>Pencil</button>
          <button>Eraser</button>
          <div>
            <label>Grosor del trazo</label>
            <input type="range" min="1" max="10" />
          </div>
          <div>
            <label>Color del trazo</label>
            <input type="color" />
          </div>
        </>
      )}
      {activeTool === 'ia' && (
        <>
          <h3>Herramientas de IA</h3>
          {/* Aquí podrías añadir herramientas relacionadas con IA */}
          <p>Funcionalidades de IA próximamente</p>
        </>
      )}
      {activeTool === 'control' && (
        <>
          <h3>Herramientas de control</h3>
          {/* Aquí va el código para las herramientas de control */}
          <div>
            <label>Opacidad</label>
            <input type="range" min="0" max="100" />
          </div>
          <div>
            <label>Rotación</label>
            <input type="range" min="0" max="360" />
          </div>
          <button>Traer al frente</button>
          <button>Enviar atrás</button>
        </>
      )}
    </div>
  );
};

export default ToolPanel;
