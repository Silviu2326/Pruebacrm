// types.ts

// Definición de Pregunta
export interface Pregunta {
    id: number;
    texto: string;
  }
  
  // Definición de Cuestionario (este es el tipo que debe usarse en el popup)
  export interface Cuestionario {
    id: number;
    titulo: string;
    preguntas: Pregunta[];
  }
  
  // Definición de Revision (si sigue siendo necesario)
  export interface Revision {
    id: number;
    titulo: string;
    descripcion: string;
  }
  