import React, { useState } from 'react';
import { Pregunta, Cuestionario } from './types';
import { PlusCircle, Save, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import './CrearCuestionario.css';

interface CrearCuestionarioProps {
  preguntasExistentes: Pregunta[];
  onGuardarCuestionario: (cuestionario: Cuestionario) => void;
}

const CrearCuestionario: React.FC<CrearCuestionarioProps> = ({
  preguntasExistentes,
  onGuardarCuestionario,
}) => {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [minimizado, setMinimizado] = useState(false);

  const agregarPreguntaExistente = (pregunta: Pregunta) => {
    setPreguntas([...preguntas, pregunta]);
  };

  const agregarNuevaPregunta = () => {
    if (nuevaPregunta.trim()) {
      const nuevaPreguntaObj: Pregunta = {
        id: Date.now(),
        texto: nuevaPregunta.trim(),
      };
      setPreguntas([...preguntas, nuevaPreguntaObj]);
      setNuevaPregunta('');
    }
  };

  const guardarCuestionario = () => {
    if (titulo && preguntas.length > 0) {
      const nuevoCuestionario: Cuestionario = {
        id: Date.now(),
        titulo,
        preguntas,
      };
      onGuardarCuestionario(nuevoCuestionario);
      setTitulo('');
      setPreguntas([]);
    }
  };

  return (
    <div className={`crear-cuestionario ${minimizado ? 'minimizado' : ''}`}>
      <div className="crear-header">
        <h2 className="crear-titulo">
          <PlusCircle className="crear-icono" />
          Crear Nuevo Cuestionario
        </h2>
        <button
          onClick={() => setMinimizado(!minimizado)}
          className="minimizar-btn"
        >
          {minimizado ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </button>
      </div>
      {!minimizado && (
        <>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del cuestionario"
            className="crear-input"
          />
          <div className="preguntas-existentes">
            <h3>Preguntas existentes:</h3>
            <ul className="preguntas-lista">
              {preguntasExistentes.map((pregunta) => (
                <li
                  key={pregunta.id}
                  onClick={() => agregarPreguntaExistente(pregunta)}
                  className="pregunta-item"
                >
                  {pregunta.texto}
                </li>
              ))}
            </ul>
          </div>
          <div className="nueva-pregunta">
            <h3>Agregar nueva pregunta:</h3>
            <div className="nueva-pregunta-input">
              <input
                type="text"
                value={nuevaPregunta}
                onChange={(e) => setNuevaPregunta(e.target.value)}
                placeholder="Nueva pregunta"
                className="crear-input"
              />
              <button
                onClick={agregarNuevaPregunta}
                className="agregar-btn"
              >
                <Plus className="agregar-icono" />
                Agregar
              </button>
            </div>
          </div>
          <div className="preguntas-cuestionario">
            <h3>Preguntas en el cuestionario:</h3>
            <ul className="preguntas-lista">
              {preguntas.map((pregunta, index) => (
                <li key={index} className="pregunta-item">
                  {pregunta.texto}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={guardarCuestionario}
            className="guardar-btn"
          >
            <Save className="guardar-icono" />
            Guardar Cuestionario
          </button>
        </>
      )}
    </div>
  );
};

export default CrearCuestionario;