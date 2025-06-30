
// Interfaz para la respuesta de la búsqueda de un producto
export interface ProductoInfo {
  producto: number | null;
}

// Interfaz para cada elemento en la lista de combinaciones
export interface CombinacionInfo {
  Combinacion: number;
  CombinacionDescripcion: string;
}

// Interfaz para la respuesta de la búsqueda de una corrida
export interface CorridaInfo {
  descripcionCorrida: string;
}

// Interfaz para la respuesta de la búsqueda de una suela
export interface SuelaInfo {
  descripcionSuela: string;
}

// Interfaz para los datos necesarios al crear una combinación de producto
export interface CombinacionProdCreateData {
  Producto: number;
  EstiloCliente: string;
  Suela: number;
  // El backend añade los campos de usuario y fecha, por lo que no son necesarios aquí.
}

// Podemos reutilizar la interfaz genérica para respuestas de éxito
export interface ApiResponse {
    success: boolean;
    message: string;
}