// src/variables.js
const variables = {
    cliente: {
      Edad: {
        type: 'numérica',
        value: 30,
        description: 'La edad del cliente en años.',
      },
      Género: {
        type: 'categórica',
        value: 'Masculino',
        options: ['Masculino', 'Femenino', 'Otro'],
        description: 'El género del cliente.',
      },
      'Peso Corporal': {
        type: 'numérica',
        value: 80,
        description: 'El peso actual del cliente en kilogramos.',
      },
      Altura: {
        type: 'numérica',
        value: 180,
        description: 'La altura del cliente en centímetros.',
      },
      'Nivel de Experiencia': {
        type: 'categórica',
        value: 'Intermedio',
        options: ['Principiante', 'Intermedio', 'Avanzado'],
        description: 'El nivel de experiencia del cliente en entrenamiento físico.',
      },
      'Nivel de Actividad Diaria': {
        type: 'categórica',
        value: 'Moderadamente Activo',
        options: ['Sedentario', 'Moderadamente Activo', 'Activo', 'Muy Activo'],
        description: 'El nivel general de actividad física del cliente fuera de las sesiones de entrenamiento.',
      },
      'Lesiones o Condiciones Médicas Previas': {
        type: 'texto',
        value: '',
        description: 'Detalles sobre cualquier lesión o condición médica que pueda afectar el entrenamiento.',
      },
      'Disponibilidad Horaria': {
        type: 'numérica',
        value: 10,
        description: 'Número de horas disponibles para entrenamiento por semana.',
      },
      'Preferencias de Entrenamiento': {
        type: 'categórica',
        value: 'Gimnasio',
        options: ['Gimnasio', 'En Casa', 'Al Aire Libre', 'Clase Grupal'],
        description: 'Lugar o tipo de entorno preferido para realizar el entrenamiento.',
      },
    },
    entrenamiento: {
      'Objetivo del Entrenamiento': {
        type: 'categórica',
        value: 'Fuerza',
        options: ['Fuerza', 'Hipertrofia', 'Resistencia', 'Reducción de Grasa'],
        description: 'El objetivo principal del programa de entrenamiento.',
      },
      'Duración de la Sesión': {
        type: 'numérica',
        value: 60,
        description: 'Duración estimada de la sesión en minutos.',
      },
      'Número de Sesiones por Semana': {
        type: 'numérica',
        value: 3,
        description: 'Cantidad de sesiones de entrenamiento por semana.',
      },
      'Intensidad Percibida': {
        type: 'numérica',
        value: 7,
        description: 'Escala de intensidad percibida (por ejemplo, del 1 al 10).',
      },
      'Modalidad de Entrenamiento Preferida': {
        type: 'categórica',
        value: 'HIIT',
        options: ['HIIT', 'Entrenamiento de Circuito', 'Yoga', 'Pilates', 'CrossFit'],
        description: 'Tipo de entrenamiento que el cliente prefiere.',
      },
      'Disponibilidad de Equipamiento': {
        type: 'categórica',
        value: 'Completo',
        options: ['Completo', 'Básico', 'Limitado'],
        description: 'Nivel de equipamiento disponible para el entrenamiento.',
      },
    },
    ejercicio: {
      'Tipo de Ejercicio': {
        type: 'categórica',
        value: 'Sentadilla',
        description: 'Tipo de ejercicio a realizar.',
      },
      'Peso Máximo (1RM)': {
        type: 'numérica',
        value: 100,
        description: 'Peso máximo que el cliente puede levantar en una repetición para un ejercicio específico.',
      },
      'Repeticiones Objetivo': {
        type: 'numérica',
        value: 10,
        description: 'Número de repeticiones objetivo para un ejercicio determinado.',
      },
      'Series Objetivo': {
        type: 'numérica',
        value: 3,
        description: 'Número de series objetivo para un ejercicio determinado.',
      },
      'Tiempo de Descanso entre Series': {
        type: 'numérica',
        value: 60,
        description: 'Tiempo de descanso en segundos entre series de un ejercicio.',
      },
      'Nivel de Dificultad Deseado': {
        type: 'numérica',
        value: 8,
        description: 'Escala del 1 al 10 para determinar la dificultad de los ejercicios.',
      },
    },
    progreso: {
      'Incremento de Peso': {
        type: 'numérica',
        value: 2,
        description: 'Incremento de peso a añadir en cada sesión de entrenamiento (por ejemplo, 2 kg por semana).',
      },
      'Incremento de Repeticiones': {
        type: 'numérica',
        value: 1,
        description: 'Número de repeticiones a añadir por semana.',
      },
      'Fatiga Acumulada': {
        type: 'numérica',
        value: 3,
        description: 'Valor que indica la fatiga acumulada del cliente, basado en entrenamientos previos.',
      },
      'Medidas Corporales': {
        type: 'numérica',
        value: 90,
        description: 'Medidas como circunferencia de cintura, cadera, brazos, etc.',
      },
      'Metas a Corto Plazo': {
        type: 'texto',
        value: 'Perder 5 kg en 3 meses',
        description: 'Objetivos que el cliente desea alcanzar en el corto plazo.',
      },
    },
    estadoFisico: {
      'Frecuencia Cardíaca en Reposo': {
        type: 'numérica',
        value: 60,
        description: 'Frecuencia cardíaca del cliente en reposo en latidos por minuto.',
      },
      'Frecuencia Cardíaca Máxima': {
        type: 'numérica',
        value: 180,
        description: 'Frecuencia cardíaca máxima calculada o medida del cliente.',
      },
      'Porcentaje de Grasa Corporal': {
        type: 'numérica',
        value: 20,
        description: 'Porcentaje de grasa corporal del cliente.',
      },
      'Masa Muscular': {
        type: 'numérica',
        value: 70,
        description: 'Masa muscular del cliente en kilogramos.',
      },
      'Capacidad Aeróbica (VO2 Máx)': {
        type: 'numérica',
        value: 45,
        description: 'Medición de la capacidad aeróbica del cliente.',
      },
      'Flexibilidad': {
        type: 'numérica',
        value: 5,
        description: 'Nivel de flexibilidad evaluado mediante pruebas específicas.',
      },
      'Fuerza Máxima en Ejercicios Clave': {
        type: 'numérica',
        value: 120,
        description: 'Fuerza máxima en ejercicios como sentadilla, press de banca, peso muerto, etc.',
      },
    },
    personalizado: {
      'Día de la Semana': {
        type: 'categórica',
        value: 'Lunes',
        options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        description: 'Día de la semana para el que se está planificando la sesión.',
      },
      'Nivel de Estrés Percibido': {
        type: 'numérica',
        value: 4,
        description: 'Autoevaluación del nivel de estrés en una escala del 1 al 10.',
      },
      'Motivación Actual': {
        type: 'numérica',
        value: 8,
        description: 'Nivel de motivación para entrenar en una escala del 1 al 10.',
      },
    },
    checkin: {
      'Estado de Ánimo': {
        type: 'categórica',
        value: 'Positivo',
        options: ['Positivo', 'Neutral', 'Negativo'],
        description: 'Cómo se siente emocionalmente el cliente.',
      },
      'Nivel de Energía': {
        type: 'numérica',
        value: 7,
        description: 'Autoevaluación del nivel de energía en una escala del 1 al 10.',
      },
      'Dolor o Molestias': {
        type: 'categórica',
        value: 'Ninguno',
        options: ['Ninguno', 'Leve', 'Moderado', 'Severo'],
        description: 'Presencia de dolor o molestias físicas.',
      },
      'Cumplimiento del Plan de Entrenamiento': {
        type: 'categórica',
        value: 'Completo',
        options: ['Completo', 'Parcial', 'No Realizado'],
        description: 'Nivel de adherencia al plan de entrenamiento.',
      },
      'Cumplimiento del Plan Nutricional': {
        type: 'categórica',
        value: 'Completo',
        options: ['Completo', 'Parcial', 'No Realizado'],
        description: 'Nivel de adherencia al plan nutricional.',
      },
      'Peso Actual': {
        type: 'numérica',
        value: 80,
        description: 'Peso del cliente en el momento del check-in.',
      },
      'Estrés Percibido': {
        type: 'numérica',
        value: 3,
        description: 'Nivel de estrés percibido durante el día en una escala del 1 al 10.',
      },
      'Comentarios Adicionales': {
        type: 'texto',
        value: '',
        description: 'Espacio para que el cliente proporcione información adicional o feedback.',
      },
    },
  };
  
  export default variables;
  