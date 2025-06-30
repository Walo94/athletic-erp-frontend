import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileClock, Loader2 } from 'lucide-react';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { CustomButton } from '../../../components/ui/CustomButton';
import { getReporteAvancesSemana } from '../../../services/inyeccion/api-reportes';

// --- Funciones de ayuda ---
const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const ReporteSemana: React.FC = () => {
    const currentYear = new Date().getFullYear();
    // --- Estados del componente ---
    const [year, setYear] = useState<number>(currentYear);
    const [week, setWeek] = useState<number>(() => getWeekNumber(new Date()));
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // --- Listas para los selectores ---
    const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);
    const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

    // --- Lógica para generar el reporte ---
    const handleGenerate = async () => {
        setLoading(true);
        setPdfUrl(null);
        const toastId = toast.loading('Generando reporte semanal...');

        try {
            const blobData = await getReporteAvancesSemana(year, week);
            const url = URL.createObjectURL(blobData);
            setPdfUrl(url);
            toast.success('Reporte generado exitosamente', { id: toastId });
        } catch (err: any) {
            console.error('Error al generar reporte:', err);
            const errorMessage = err.response?.status === 404
                ? 'No se encontraron datos para el año y semana seleccionados.'
                : 'Error al generar el reporte. Intente de nuevo.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // --- Efecto para limpiar la URL y liberar memoria ---
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <FileClock /> Reporte Semanal de Avances
      </h1>

      {/* Panel de Controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <CustomSelect
          label="Año"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </CustomSelect>
        
        <CustomSelect
          label="Semana"
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
        >
          {weeks.map((w) => <option key={w} value={w}>Semana {w}</option>)}
        </CustomSelect>

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

      {/* Visor de PDF */}
      {pdfUrl && (
        <div className="mt-4">
          <iframe
            src={pdfUrl}
            title="Reporte Semanal de Avances"
            width="100%"
            height="800px"
            className="border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ReporteSemana;
