/**
 * Representa la estructura de una Línea como viene de la API.
 */
export interface Linea {
  linea: number;
  descripcion: string;
  marca: number;
  sublinea: number;
}

/**
 * Interfaz extendida para uso en el frontend, incluyendo las descripciones.
 */
export interface LineaConDescripcion extends Linea {
  marcaDescripcion: string;
  sublineaDescripcion: string;
}

/**
 * Define los datos que el formulario de Línea manejará.
 */
export type LineaFormData = Omit<Linea, 'id'>;