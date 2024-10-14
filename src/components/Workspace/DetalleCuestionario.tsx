import React from 'react';
import { Cuestionario } from './types';
import { X, FileText } from 'lucide-react';
import './DetalleCuestionario.css';

interface DetalleCuestionarioProps {
  cuestionario: Cuestionario;
  onCerrar: () => void;
}

const DetalleCuestionario: React.FC<DetalleCuestionarioProps> = ({ cuestionario, onCerrar }) => {
  return (
    <div className="detalle-cuestionario">
      <div className="detalle-header">
        <h2 className="detalle-titulo">
          <FileText className="detalle-icono" />
          {cuestionario.titulo}
        </h2>
        <button
          onClick={onCerrar}
          className="cerrar-btn"
        >
          <X size={24} />
        </button>
      </div>
      <div className="detalle-preguntas">
        <h3>Preguntas:</h3>
        <ul className="preguntas-lista">
          {cuestionario.preguntas.map((pregunta, index) => (
            <li key={pregunta.id} className="pregunta-item">
              <span className="pregunta-numero">{index + 1}.</span>
              {pregunta.texto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetalleCuestionario;