// Interfaz para un único código de barras con su talla
export interface CodigoInfo {
  codigo: string;
  punto: number;
  talla: string;
}

// Interfaz para la respuesta de la API que obtiene los códigos de barras
export interface CodigosBarrasResponse {
  codigos: CodigoInfo[];
}

// Interfaz para un registro individual que se enviará para guardar en el DBF
export interface RegistroDBF {
  estilo: string;
  combinacion: string;
  descripcionCombinacion: string;
  corrida: string;
  descripcionCorrida: string;
  punto: string; // Corresponde a la 'talla'
  codigoBarras: string;
}

// Puedes reutilizar la ApiResponse genérica si la tienes en un archivo central
export interface ApiResponse {
  success: boolean;
  message: string;
}