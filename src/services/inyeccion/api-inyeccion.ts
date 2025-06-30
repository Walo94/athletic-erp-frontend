import {
  ApiResponse,
  InfoLote,
  InfoPrograma,
  PuedeAvanzarResponse,
  OrdenDepartamentoResponse,
  LoteDiaInfo,
  LoteInfo,
  RegistrarAvanceData,
  LotesData,
  DetaFactRecord
} from '../../types/inyeccion/Inyeccion'; 
import apiClient from '../apiClient';

/**
 * Obtiene la información detallada de un lote específico por año.
 * @returns Una promesa que se resuelve con la información del lote.
 */
export const getInfoLote = async (lote: number, anio: number): Promise<InfoLote[]> => {
  const response = await apiClient.get<InfoLote[]>(`/inyeccion/lote/${lote}/${anio}`);
  return response.data;
};

/**
 * Obtiene la información del programa de un lote específico por año.
 * @returns Una promesa que se resuelve con la información del programa.
 */
export const getInfoPrograma = async (lote: number, year: number): Promise<InfoPrograma[]> => {
  const response = await apiClient.get<InfoPrograma[]>(`/inyeccion/programa/${lote}/${year}`);
  return response.data;
};

/**
 * Verifica si un lote puede avanzar en el proceso de producción.
 * @returns Una promesa que se resuelve con el estado de avance.
 */
export const puedeAvanzar = async (lote: string, programa: number, ordenActual: number): Promise<PuedeAvanzarResponse> => {
  const response = await apiClient.get<PuedeAvanzarResponse>(`/inyeccion/puede-avanzar/${lote}/${programa}/${ordenActual}`);
  return response.data;
};

/**
 * Obtiene el número de orden de un departamento de producción.
 * @returns Una promesa que se resuelve con la orden del departamento.
 */
export const getOrdenDepartamento = async (departamento: string): Promise<OrdenDepartamentoResponse> => {
  const response = await apiClient.get<OrdenDepartamentoResponse>(`/inyeccion/orden-departamento/${departamento}`);
  return response.data;
};

/**
 * Obtiene los lotes programados para un día y módulo específicos.
 * @returns Una promesa que se resuelve con la lista de lotes.
 */
export const getLotesDia = async (dia: string, modulo: string): Promise<LoteDiaInfo[]> => {
    const response = await apiClient.get<LoteDiaInfo[]>(`/inyeccion/lotes-dia/${dia}/${modulo}`);
    return response.data;
};

/**
 * Obtiene una lista de lotes que aún no han sido marcados como vendidos.
 * @returns Una promesa que se resuelve con una lista de lotes no vendidos.
 */
export const getLotesNoVendidos = async (): Promise<LoteInfo[]> => {
    const response = await apiClient.get<LoteInfo[]>(`/inyeccion/lotes-no-vendidos`);
    return response.data;
};

/**
 * Obtiene todos los datos del archivo DETAFACT.DBF para consulta.
 * @returns Una promesa que se resuelve con todos los registros del archivo.
 */
export const getDatosDetaFact = async (): Promise<DetaFactRecord[]> => {
    const response = await apiClient.get<DetaFactRecord[]>(`/inyeccion/detafact`);
    return response.data;
};

/**
 * Registra un nuevo avance de producción para un lote.
 * @param data - Los datos necesarios para registrar el avance.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const registrarAvance = async (data: RegistrarAvanceData): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/inyeccion/registrar-avance', data);
  return response.data;
};

/**
 * Verifica en el archivo DBF cuáles de los lotes proporcionados han sido vendidos.
 * @param data - Un objeto que contiene una lista de lotes a verificar.
 * @returns Una promesa que se resuelve con la lista de lotes que sí fueron vendidos.
 */
export const verificarLotesVendidos = async (data: LotesData): Promise<LoteInfo[]> => {
    const response = await apiClient.post<LoteInfo[]>('/inyeccion/verificar-lotes-vendidos', data);
    return response.data;
};

/**
 * Actualiza el estado de una lista de lotes a 'vendido' en la base de datos.
 * @param data - Un objeto que contiene una lista de lotes a actualizar.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const updateLotesVendidos = async (data: LotesData): Promise<ApiResponse> => {
    const response = await apiClient.put<ApiResponse>('/inyeccion/lotes-vendidos', data);
    return response.data;
};