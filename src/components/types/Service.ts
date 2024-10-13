export interface Service {
  _id: string;
  name: string;
  description: string;
  subtipo?: Subtipo[];
  type: string;
  maxParticipants: number;
  paymentType?: 'fijo' | 'por_sesion' | 'paquete_sesiones';
  frequency?: string;
  price?: number;
  durationMonths?: number;
}

export interface Subtipo {
  price: string;
}
