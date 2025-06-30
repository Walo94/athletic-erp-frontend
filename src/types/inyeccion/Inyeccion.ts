// Interfaz genérica para respuestas de éxito de la API
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Interfaz para la información básica de un lote
export interface LoteInfo {
  lote: number;
  years: number;
}

// Interfaz para la respuesta de la información de un lote
export interface InfoLote {
  Lote: number;
  Ano: number;
  Estilo: string;
  Linea: string;
  Color: string;
  Pares: number;
  FechaProgramacion: string;
  DepartamentoActual: string;
  Avance: string;
}

/**
 * Define los datos del programa de producción asociado a un lote.
 * La tabla 'programa' se menciona en las consultas del backend.
 * Nota: La estructura exacta depende de `sp_getinfo_programa`.
 */
export interface InfoPrograma {
  id_prog: number;
  lote: string;
  years: number;
  num_orden: string;
  cliente: string;
  fecha_entrega: string;
}

/**
 * Contiene la respuesta al verificar si un lote puede proceder al siguiente paso.
 * Devuelto por el Stored Procedure `sp_puede_avanzar`.
 */
export interface PuedeAvanzarResponse {
  PuedeAvanzar: boolean;
  mensaje: string;
}


/**
 * Estructura de la respuesta que contiene el orden numérico de un departamento.
 * Devuelto por `sp_ObtenerOrdenDepartamento`.
 */
export interface OrdenDepartamentoResponse {
  Orden: number;
}

/**
 * Define la información de los lotes programados para un día y módulo.
 * Nota: La estructura exacta depende de las columnas devueltas por `sp_get_lotes_dia`.
 */
export interface LoteDiaInfo {
    lote: string;
    modulo: string;
    estilo: string;
    linea: string;
    combinacion: string;
    npares: number;
    avance_actual: string;
}

/**
 * Define los datos necesarios para registrar un avance de producción en el sistema.
 * Estos son los parámetros que recibe el Stored Procedure `sp_registrar_avance`.
 */
export interface RegistrarAvanceData {
  programa: number;
  lote: string;
  avance: string;
  departamentoActual: string;
  departamentoSiguiente: string;
  maquila: string;
  fechaActual?: Date;
}

/**
 * Interfaz utilizada para enviar un arreglo de lotes en el cuerpo de una petición.
 * Se usa para actualizar o verificar múltiples lotes a la vez.
 */
export interface LotesData {
    lotes: LoteInfo[];
}

/**
 * Representa un registro del archivo de facturación `DETAFACT.DBF`.
 * Incluye campos mencionados en el backend y otros campos comunes en facturación.
 */
export interface DetaFactRecord {
    TIP_FACT: string;
    NUM_FACT: string;
    MES_FACT: string;
    LOT_FACT: number | string;
    EST_FACT: string;
    COR_FACT: string;
    COM_FACT: string;
    CAN_FACT: number;
    PRE_FACT: number;
    IMP_FACT: number;
    FEC_FACT: Date | string | null;
    FEC_FACT_FORMATEADA?: string;
}