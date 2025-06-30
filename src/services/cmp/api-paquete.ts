import {
  PaqueteAgregado,
  PaqueteCreateData,
  ApiResponse
} from '../../types/cmp/Paquete';
import apiClient from '../apiClient';

/**
 * Obtiene el detalle de un paquete específico por periodo y número de paquete.
 * @param periodo - El año o periodo del paquete.
 * @param paquete - El número de paquete.
 * @returns Una promesa que se resuelve con un array de los detalles del paquete.
 */
export const getPaqueteDetalle = async (periodo: number, paquete: number): Promise<PaqueteAgregado[]> => {
  const response = await apiClient.get<PaqueteAgregado[]>(`/paquetes/${periodo}/${paquete}`);
  return response.data;
};

/**
 * Crea un nuevo paquete con su detalle de productos.
 * @param data - Los datos para crear el paquete, incluyendo número, periodo y detalle.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const createPaquete = async (data: PaqueteCreateData): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/paquetes', data);
  return response.data;
};

/**
 * Elimina un paquete completo basado en su número.
 * @param paquete - El número del paquete a eliminar.
 * @returns Una promesa que se resuelve con un mensaje de éxito.
 */
export const deletePaquete = async (paquete: number): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/paquetes/${paquete}`);
  return response.data;
};