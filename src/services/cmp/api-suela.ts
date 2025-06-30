import {
  ProductoInfo,
  CombinacionInfo,
  CorridaInfo,
  SuelaInfo,
  CombinacionProdCreateData,
  ApiResponse
} from '../../types/cmp/Suela';
import apiClient from '../apiClient';


/**
 * Obtiene el ID de un producto basado en su estilo, corrida y combinación.
 * @returns Una promesa que se resuelve con el ID del producto.
 */
export const getProducto = async (estilo: number, corrida: number, combinacion: number): Promise<ProductoInfo> => {
  const response = await apiClient.get<ProductoInfo>(`/suelas/productos/${estilo}/${corrida}/${combinacion}`);
  return response.data;
};

/**
 * Obtiene la lista de combinaciones disponibles para un estilo y corrida.
 * @returns Una promesa que se resuelve con un array de combinaciones.
 */
export const getCombinaciones = async (estilo: number, corrida: number): Promise<CombinacionInfo[]> => {
  const response = await apiClient.get<CombinacionInfo[]>(`/suelas/combinaciones/${estilo}/${corrida}`);
  return response.data;
};

/**
 * Obtiene la descripción de una corrida específica.
 * @returns Una promesa que se resuelve con la descripción de la corrida.
 */
export const getCorridaInfo = async (corrida: number): Promise<CorridaInfo> => {
  const response = await apiClient.get<CorridaInfo>(`/suelas/corridas/${corrida}`);
  return response.data;
};

/**
 * Obtiene la descripción de una suela específica.
 * @returns Una promesa que se resuelve con la descripción de la suela.
 */
export const getSuelaInfo = async (suela: number): Promise<SuelaInfo> => {
  const response = await apiClient.get<SuelaInfo>(`/suelas/${suela}`);
  return response.data;
};

/**
 * Inserta una nueva combinación de producto.
 * @param data - Los datos necesarios para crear el registro.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const createCombinacionProd = async (data: CombinacionProdCreateData): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/suelas/combinaciones-prod', data);
  return response.data;
};