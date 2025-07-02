import reportesApiClient from '../reportesApiClient';

/**
 * Obtiene el reporte de avances del día en formato PDF.
 * @param dia - La fecha para el reporte en formato 'yyyy-MM-dd'.
 * @returns Una promesa que se resuelve con los datos del PDF como un Blob.
 */
export const getReporteAvancesDia = async (dia: string): Promise<Blob> => {
  const response = await reportesApiClient.get('/inyeccion/avance-dia', {
    params: { dia },
    responseType: 'blob',
  });

   return response.data;
};


/**
 * Obtiene el reporte de avances de la semana en formato PDF desde el módulo de inyeyección.
 * @param anio - El año para el reporte.
 * @param semana - El número de semana para el reporte.
 * @returns Una promesa que se resuelve con los datos del PDF como un Blob.
 */
export const getReporteAvancesSemana = async (anio: number, semana: number): Promise<Blob> => {
  const response = await reportesApiClient.get('/inyeccion/avance-semana', {
    params: { anio, semana },
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Obtiene el reporte de inventario en proceso en pdf.
 * @returns Una promesa que se resuelve con los datos del PDF como un Blob.
 */
export const getReporteInventarioProceso = async (): Promise<Blob> => {
  const response = await reportesApiClient.get('/inyeccion/inventario-proceso', {
    responseType: 'blob',
  });
  return response.data;
};
