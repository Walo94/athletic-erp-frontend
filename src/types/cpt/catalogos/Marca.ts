export interface Marca {
  marca: number;
  descripcion: string;
}

export type MarcaFormData = Omit<Marca, 'id'>;