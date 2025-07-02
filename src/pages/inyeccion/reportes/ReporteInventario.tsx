import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getReporteInventarioProceso } from '../../../services/inyeccion/api-reportes';

const ReporteInventario: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      const toastId = toast.loading('Generando reporte de inventario...');
      try {
        const blobData = await getReporteInventarioProceso();
        const url = URL.createObjectURL(blobData);
        setPdfUrl(url);
        toast.success('Reporte generado exitosamente', { id: toastId });
      } catch (err: any) {
        const errorMessage = 'No se pudo generar el reporte de inventario.';
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
        console.error('Error al generar reporte de inventario:', err);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, []);

  // Limpiar la URL del objeto cuando el componente se desmonte para liberar memoria
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p>Cargando reporte...</p>
        </div>
      );
    }

    if (error || !pdfUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-600 dark:text-red-500">
          <AlertTriangle className="mb-4" size={48} />
          <p>{error || 'No se pudo cargar el reporte.'}</p>
        </div>
      );
    }

    return (
      <iframe
        src={pdfUrl}
        title="Reporte de Inventario"
        width="100%"
        height="100%"
        className="border-none"
      />
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white flex items-center gap-2">
        Reporte de Inventario en Proceso
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-150px)]">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReporteInventario;