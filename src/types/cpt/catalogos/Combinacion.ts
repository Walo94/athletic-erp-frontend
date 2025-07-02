export interface Combinacion {
  combinacion: number;
  material1: number;
  color1: number;
  material2: number | null;
  color2: number | null;
  material3: number | null;
  color3: number | null;
  material4: number | null;
  color4: number | null;
  material5: number | null;
  color5: number | null;
  material6: number | null;
  color6: number | null;
}

export interface CombinacionConDescripcion extends Combinacion {
  material1Descripcion: string;
  color1Descripcion: string;
  material2Descripcion: string;
  color2Descripcion: string;
  material3Descripcion: string;
  color3Descripcion: string;
  material4Descripcion: string;
  color4Descripcion: string;
  material5Descripcion: string;
  color5Descripcion: string;
  material6Descripcion: string;
  color6Descripcion: string;
}

export type CombinacionFormData = Combinacion;