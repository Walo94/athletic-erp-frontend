export interface PaqueteDetalle {
  suela: number;
  corrida: number;
  Cant1?: number;
  Cant2?: number;
  Cant3?: number;
  Cant4?: number;
  Cant5?: number;
  Cant6?: number;
  Cant7?: number;
  pares: number;
}

export interface PaqueteCreateData {
  paquete: number;
  periodo: number;
  detalleProductos: PaqueteDetalle[];
}

export interface PaqueteAgregado {
  estilo: number;
  combinacion: number;
  DescCombina: string;
  corrida: number;
  suela: number;
  DesSuela: string;
  Cant1: number;
  Cant2: number;
  Cant3: number;
  Cant4: number;
  Cant5: number;
  Cant6: number;
  Cant7: number;
  pares: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
}