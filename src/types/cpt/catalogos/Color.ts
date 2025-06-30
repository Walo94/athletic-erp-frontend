export interface Color {
  color: number;
  descripcion: string;
}

export type ColorFormData = Omit<Color, 'id' | 'createdAt' | 'updatedAt'>;