import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FileText, Loader2 } from 'lucide-react';
import { CustomDatePicker } from '../../../components/ui/CustomDatePicker';
import { CustomButton } from '../../../components/ui/CustomButton';
import { getReporteAvancesDia } from '../../../services/inyeccion/api-reportes';


const ReporteDiario: React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);



    const handleGenerate = async () => {
        setLoading(true);
        setPdfUrl(null); // Limpia el reporte anterior
        const toastId = toast.loading('Generando reporte...');

        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const blobData = await getReporteAvancesDia(formattedDate);

            // Creamos una URL local para el blob que puede ser usada por el iframe
            const url = URL.createObjectURL(blobData);
            setPdfUrl(url);

            toast.success('Reporte generado exitosamente', { id: toastId });
        } catch (err: any) {
            console.error('Error al generar reporte:', err);
            const errorMessage = err.response?.status === 404
                ? 'No se encontraron datos para generar el reporte en esta fecha.'
                : 'Error al generar el reporte. Intente de nuevo.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // Limpiar la URL del objeto cuando el componente se desmonte para liberar memoria
    React.useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

     return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <FileText /> Reporte Diario de Avances
      </h1>

      {/* Panel de Controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="md:col-span-2">
          <CustomDatePicker
            label="Selecciona una fecha"
            value={date}
            onChange={(newDate) => setDate(newDate || new Date())}
          />
        </div>
        <div>
          <CustomButton
            variant="primary"
            onClick={handleGenerate}
            className="w-full h-[42px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Generando...
              </>
            ) : (
              'Generar Reporte'
            )}
          </CustomButton>
        </div>
      </div>

      {/* Visor de PDF */}
      {pdfUrl && (
        <div className="mt-4">
          <iframe
            src={pdfUrl}
            title="Reporte Diario de Avances"
            width="100%"
            height="800px"
            className="border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ReporteDiario;