/**
 * Representa la estructura de un único material.
 */
export interface Material {
  material: number;
  descripcion: string;
}

export type MaterialFormData = Omit<Material, ''>;