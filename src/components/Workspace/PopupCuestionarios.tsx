import React, { useState } from 'react';
import ListaCuestionarios from './ListaCuestionarios.tsx';
import CrearCuestionario from './CrearCuestionario.tsx';
import DetalleCuestionario from './DetalleCuestionario.tsx';
import { ClipboardList } from 'lucide-react';
import './PopupCuestionarios.css';
import { Cuestionario, Pregunta } from './types';  // Asegúrate de usar Cuestionario

// Preguntas de ejemplo para usar al crear un nuevo cuestionario
const preguntasIniciales: Pregunta[] = [
  { id: 1, texto: "¿Cuál es tu color favorito?" },
  { id: 2, texto: "¿Cuál es tu comida favorita?" },
  { id: 3, texto: "¿Cuál es tu película favorita?" },
];

interface PopupCuestionariosProps {
  onClose: () => void;
}

const PopupCuestionarios: React.FC<PopupCuestionariosProps> = ({ onClose }) => {
  // Usa Cuestionario para manejar el estado de los cuestionarios
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([]);
  const [cuestionarioSeleccionado, setCuestionarioSeleccionado] = useState<Cuestionario | null>(null);

  // Función para guardar un nuevo cuestionario
  const guardarCuestionario = (nuevoCuestionario: Cuestionario) => {
    setCuestionarios([...cuestionarios, nuevoCuestionario]);
  };

  // Función para seleccionar un cuestionario
  const seleccionarCuestionario = (cuestionario: Cuestionario) => {
    setCuestionarioSeleccionado(cuestionario);
  };

  return (
    <div className="popup-cuestionarios">
      <div className="popup-contentt">
        <button className="close-popup" onClick={onClose}>×</button>
        <h2 className="title">
          <ClipboardList className="icon" />
          Cuestionarios
        </h2>
        <div className="popup-grid">
          <ListaCuestionarios 
            cuestionarios={cuestionarios} 
            onSeleccionarCuestionario={seleccionarCuestionario} 
          />
          {cuestionarioSeleccionado ? (
            <DetalleCuestionario 
              cuestionario={cuestionarioSeleccionado} 
              onCerrar={() => setCuestionarioSeleccionado(null)} 
            />
          ) : (
            <CrearCuestionario 
              preguntasExistentes={preguntasIniciales} 
              onGuardarCuestionario={guardarCuestionario} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupCuestionarios;
