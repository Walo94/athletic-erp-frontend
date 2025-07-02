import { Color, ColorFormData } from '../../../types/cpt/catalogos/Color';
import { Corrida, CorridaFormData } from '../../../types/cpt/catalogos/Corrida';
import { Material, MaterialFormData } from '../../../types/cpt/catalogos/Material';
import { Proveedor, ProveedorFormData } from '../../../types/cpt/catalogos/Proveedor';
import { Sublinea, SublineaFormData } from '../../../types/cpt/catalogos/Sublinea';
import { Marca, MarcaFormData } from '../../../types/cpt/catalogos/Marca';
import { Linea, LineaFormData } from '../../../types/cpt/catalogos/Linea';
import { Combinacion, CombinacionFormData } from '../../../types/cpt/catalogos/Combinacion';

import apiClient from '../../apiClient';

// --- Endpoints de Colores ---

/**
 * Obtiene todos los colores para una empresa.
 * * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * * @returns Una promesa que se resuelve con un array de colores.
 */
export const getColors = async (empresa: string): Promise<Color[]> => {
  const response = await apiClient.get<Color[]>(`/colores/${empresa}`);
  return response.data;
};

/**
 * Crea un nuevo color.
 * @param empresa - El nombre de la empresa.
 * @param corridaData - Los datos del color a crear.
 * @returns Una promesa que se resuelve con el color recién creado.
 */
export const createColor = async (empresa: string, colorData: ColorFormData): Promise<Color> => {
  const response = await apiClient.post<Color>(`/colores/${empresa}`, colorData);
  return response.data;
};

/**
 * Actualiza una color existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID del color a actualizar.
 * @param colorData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con el color actualizado.
 */
export const updateColor = async (empresa: string, id: number, colorData: Partial<ColorFormData>): Promise<Color> => {
  const response = await apiClient.put<Color>(`/colores/${empresa}/${id}`, colorData);
  return response.data;
};


// --- Endpoints de Corridas ---

/**
 * Obtiene todos las corridas para una empresa.
 * * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * * @returns Una promesa que se resuelve con un array de corridas.
 */
export const getCorridas = async (empresa: string): Promise<Corrida[]> => {
  const response = await apiClient.get<Corrida[]>(`/corridas/${empresa}`);
  return response.data;
};

/**
 * Crea un nueva corrida.
 * @param empresa - El nombre de la empresa.
 * @param corridaData - Los datos de la corrida a crear.
 * @returns Una promesa que se resuelve con la corrida recién creada.
 */
export const createCorrida = async (empresa: string, CorridaData: CorridaFormData): Promise<Corrida> => {
  const response = await apiClient.post<Corrida>(`/corridas/${empresa}`, CorridaData);
  return response.data;
};

/**
 * Actualiza una corrida existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID de la corrida a actualizar.
 * @param corridaData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con la corrida actualizada.
 */
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

/**
 * Obtiene todos los proveedores para una empresa.
 * * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * * @returns Una promesa que se resuelve con un array de proveedores.
 */
export const getProveedores = async (empresa: string): Promise<Proveedor[]> => {
  const response = await apiClient.get<Proveedor[]>(`/proveedores/${empresa}`);
  return response.data;
};

// --- Endpoints de Proveedores ---

/**
 * Crea un nuevo proveedor.
 * @param empresa - El nombre de la empresa.
 * @param proveedorData - Los datos del proveedor a crear.
 * @returns Una promesa que se resuelve con el proveedor recién creado.
 */
export const createProveedor = async (empresa: string, proveedorData: ProveedorFormData): Promise<Proveedor> => {
  const response = await apiClient.post<Proveedor>(`/proveedores/${empresa}`, proveedorData);
  return response.data;
};

/**
 * Actualiza un proveedor existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID del proveedor a actualizar.
 * @param proveedorData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con el proveedor actualizado.
 */
export const updateProveedor = async (empresa: string, id: number, proveedorData: Partial<ProveedorFormData>): Promise<Proveedor> => {
  const response = await apiClient.put<Proveedor>(`/proveedores/${empresa}/${id}`, proveedorData);
  return response.data;
};

// --- Endpoints de Sublíneas ---
/**
 * Obtiene todas las sublíneas para una empresa.
 * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * @returns Una promesa que se resuelve con un array de sublíneas.
 */
export const getSublineas = async (empresa: string): Promise<Sublinea[]> => {
  const response = await apiClient.get<Sublinea[]>(`/sublineas/${empresa}`);
  return response.data;
};


/**
 * Crea una nueva sublínea.
 * @param empresa - El nombre de la empresa.
 * @param sublineaData - Los datos de la sublínea a crear.
 * @returns Una promesa que se resuelve con la sublínea recién creada.
 */
export const createSublinea = async (empresa: string, sublineaData: SublineaFormData): Promise<Sublinea> => {
  const response = await apiClient.post<Sublinea>(`/sublineas/${empresa}`, sublineaData);
  return response.data;
};

/**
 * Actualiza una sublínea existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID de la sublínea a actualizar.
 * @param sublineaData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con la sublínea actualizada.
 */
export const updateSublinea = async (empresa: string, id: number, sublineaData: Partial<SublineaFormData>): Promise<Sublinea> => {
  const response = await apiClient.put<Sublinea>(`/sublineas/${empresa}/${id}`, sublineaData);
  return response.data;
};

// --- Endpoints de Marcas ---
/**
 * Obtiene todas las marcas para una empresa.
 * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * @returns Una promesa que se resuelve con un array de marcas.
 */
export const getMarcas = async (empresa: string): Promise<Marca[]> => {
  const response = await apiClient.get<Marca[]>(`/marcas/${empresa}`);
  return response.data;
};

/**
 * Crea una nueva marca.
 * @param empresa - El nombre de la empresa.
 * @param marcaData - Los datos de la marca a crear.
 * @returns Una promesa que se resuelve con la marca recién creada.
 */
export const createMarca = async (empresa: string, marcaData: MarcaFormData): Promise<Marca> => {
  const response = await apiClient.post<Marca>(`/marcas/${empresa}`, marcaData);
  return response.data;
};

/**
 * Actualiza una marca existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID de la marca a actualizar.
 * @param marcaData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con la marca actualizada.
 */
export const updateMarca = async (empresa: string, id: number, marcaData: Partial<MarcaFormData>): Promise<Marca> => {
  const response = await apiClient.put<Marca>(`/marcas/${empresa}/${id}`, marcaData);
  return response.data;
};

// --- Endpoints de Líneas ---
/**
 * Obtiene todas las líneas para una empresa.
 * @param empresa - El nombre de la empresa ('athletic' o 'uptown').
 * @returns Una promesa que se resuelve con un array de líneas.
 */
export const getLineas = async (empresa: string): Promise<Linea[]> => {
  const response = await apiClient.get<Linea[]>(`/lineas/${empresa}`);
  return response.data;
};

/**
 * Crea una nueva línea.
 * @param empresa - El nombre de la empresa.
 * @param lineaData - Los datos de la línea a crear.
 * @returns Una promesa que se resuelve con la línea recién creada.
 */
export const createLinea = async (empresa: string, lineaData: LineaFormData): Promise<Linea> => {
  const response = await apiClient.post<Linea>(`/lineas/${empresa}`, lineaData);
  return response.data;
};

/**
 * Actualiza una línea existente.
 * @param empresa - El nombre de la empresa.
 * @param id - El ID de la línea a actualizar.
 * @param lineaData - Los datos a actualizar.
 * @returns Una promesa que se resuelve con la línea actualizada.
 */
export const updateLinea = async (empresa: string, id: number, lineaData: Partial<LineaFormData>): Promise<Linea> => {
  const response = await apiClient.put<Linea>(`/lineas/${empresa}/${id}`, lineaData);
  return response.data;
};

/**
 * Obtiene todas las combinaciones para una empresa.
 */
export const getCombinaciones = async (empresa: string): Promise<Combinacion[]> => {
  const response = await apiClient.get<Combinacion[]>(`/combinaciones/${empresa}`);
  return response.data;
};

/**
 * Crea una nueva combinación.
 */
export const createCombinacion = async (empresa: string, data: CombinacionFormData): Promise<Combinacion> => {
  const response = await apiClient.post<Combinacion>(`/combinaciones/${empresa}`, data);
  return response.data;
};

/**
 * Actualiza una combinación existente.
 */
export const updateCombinacion = async (empresa: string, id: number, data: Partial<CombinacionFormData>): Promise<Combinacion> => {
  const response = await apiClient.put<Combinacion>(`/combinaciones/${empresa}/${id}`, data);
  return response.data;
};


export default apiClient;