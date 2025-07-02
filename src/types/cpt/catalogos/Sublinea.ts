export interface Sublinea {
  sublinea: number;
  descripcion: string;
}

export type SublineaFormData = Omit<Sublinea, 'id'>;