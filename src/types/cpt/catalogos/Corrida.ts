export interface Corrida {
  corrida: number;
  puntoInicial: number;
  puntoFinal: number;
  descripcion: string;
}

export type CorridaFormData = Omit<Corrida, 'id'>;