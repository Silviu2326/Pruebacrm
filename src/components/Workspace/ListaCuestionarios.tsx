import React from 'react';
import { Cuestionario } from './types';
import { List, ChevronRight } from 'lucide-react';
import './ListaCuestionarios.css';

interface ListaCuestionariosProps {
  cuestionarios: Cuestionario[];
  onSeleccionarCuestionario: (cuestionario: Cuestionario) => void;
}

const ListaCuestionarios: React.FC<ListaCuestionariosProps> = ({ cuestionarios, onSeleccionarCuestionario }) => {
  return (
    <div className="lista-cuestionarios">
      <h2 className="lista-titulo">
        <List className="lista-icono" />
        Cuestionarios Existentes
      </h2>
      {cuestionarios.length === 0 ? (
        <p className="no-cuestionarios">No hay cuestionarios creados aún.</p>
      ) : (
        <ul className="cuestionarios-lista">
          {cuestionarios.map((cuestionario) => (
            <li 
              key={cuestionario.id} 
              className="cuestionario-item"
              onClick={() => onSeleccionarCuestionario(cuestionario)}
            >
              <span className="cuestionario-titulo">{cuestionario.titulo}</span>
              <div className="cuestionario-info">
                <span className="cuestionario-preguntas">
                  {cuestionario.preguntas.length} preguntas
                </span>
                <ChevronRight className="cuestionario-icono" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaCuestionarios;