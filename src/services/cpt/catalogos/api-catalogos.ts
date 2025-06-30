import { Color, ColorFormData } from '../../../types/cpt/catalogos/Color';
import { Corrida, CorridaFormData } from '../../../types/cpt/catalogos/Corrida';
import { Material, MaterialFormData } from '../../../types/cpt/catalogos/Material';
import apiClient from '../../apiClient';

// --- Endpoints de Colores ---
// Obtener todos los colores para una empresa
export const getColors = async (empresa: string): Promise<Color[]> => {
  const response = await apiClient.get<Color[]>(`/colores/${empresa}`);
  return response.data;
};

// Crear un nuevo color
export const createColor = async (empresa: string, colorData: ColorFormData): Promise<Color> => {
  const response = await apiClient.post<Color>(`/colores/${empresa}`, colorData);
  return response.data;
};

// Actualizar un color existente
export const updateColor = async (empresa: string, id: number, colorData: Partial<ColorFormData>): Promise<Color> => {
  const response = await apiClient.put<Color>(`/colores/${empresa}/${id}`, colorData);
  return response.data;
};


// --- Endpoints de Corridas ---
// Obtener todas las corridas para una empresa
export const getCorridas = async (empresa: string): Promise<Corrida[]> => {
  const response = await apiClient.get<Corrida[]>(`/corridas/${empresa}`);
  return response.data;
};

// Crear un nueva corrida
export const createCorrida = async (empresa: string, CorridaData: CorridaFormData): Promise<Corrida> => {
  const response = await apiClient.post<Corrida>(`/corridas/${empresa}`, CorridaData);
  return response.data;
};

// Actualizar una corrida existente
export const updateCorrida = async (empresa: string, id: number, corridaData: Partial<CorridaFormData>): Promise<Corrida> => {
  const response = await apiClient.put<Corrida>(`/corridas/${empresa}/${id}`, corridaData);
  return response.data;
};

// --- Endpoints de Materiales ---
/**
 * Obtiene todos los materiales para una empresa.
 * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * @returns Una promesa que se resuelve con un array de materiales.
 */
export const getMateriales = async (empresa: string): Promise<Material[]> => {
  const response = await apiClient.get<Material[]>(`/materiales/${empresa}`);
  return response.data;
};

/**
 * Crea un nuevo material.
 * @param empresa - El nombre de la empresa.
 * @param materialData - Los datos del material a crear.
 * @returns Una promesa que se resuelve con el material recién creado.
 */
export const createMaterial = async (empresa: string, materialData: MaterialFormData): Promise<Material> => {
  const response = await apiClient.post<Material>(`/materiales/${empresa}`, materialData);
  return response.data;
};

/**
 * Actualiza un material existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID del material a actualizar.
 * @param materialData - Los datos a actualizar (solo la descripción).
 * @returns Una promesa que se resuelve con el material actualizado.
 */
export const updateMaterial = async (empresa: string, id: number, materialData: Partial<MaterialFormData>): Promise<Material> => {
  const response = await apiClient.put<Material>(`/materiales/${empresa}/${id}`, materialData);
  return response.data;
};

export default apiClient;