// types/Service.ts
export interface Service {
    _id: string;
    name: string;
    description: string;
    subtipo?: Subtipo[];
    type: string;
    maxParticipants: number; // Ya no es opcional
    paymentType?: 'fijo' | 'por_sesion' | 'paquete_sesiones'; // Cambio aquí
    frequency?: string;
    price?: number;
    durationMonths?: number;
  }
  
  export interface Subtipo {
    price: string;
  }
  