import apiClient from '../apiClient';
import { CodigosBarrasResponse, RegistroDBF, ApiResponse } from '../../types/cpt/CodigosBarras';

/**
 * Obtiene los códigos de barras y tallas para un producto específico.
 * @param producto - El ID del producto.
 * @returns Una promesa que se resuelve con la lista de códigos de barras.
 */
export const getCodigosBarras = async (producto: number): Promise<CodigosBarrasResponse> => {
  const response = await apiClient.get<CodigosBarrasResponse>(`/codigos-barras/${producto}`);
  return response.data;
};

/**
 * Guarda una lista de registros de códigos de barras en el archivo DBF del servidor.
 * @param data - Un objeto que contiene un arreglo de registros a guardar.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const guardarCodigosEnDBF = async (data: { registros: RegistroDBF[] }): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/codigos-barras/guardar-dbf', data);
  return response.data;
};