import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Search, Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import { getLotesDia } from '../../services/inyeccion/api-inyeccion';
import { LoteDiaInfo } from '../../types/inyeccion/Inyeccion';
import { CustomDialog } from '../ui/CustomDialog';
import { CustomInput } from '../ui/CustomInput';
import { CustomButton } from '../ui/CustomButton';
import { CustomCard } from '../ui/CustomCard';

interface ListadoLotesProps {
    open: boolean;
    onClose: () => void;
    fecha: Date;
    departamento: string;
}

export const ListadoLotes: React.FC<ListadoLotesProps> = ({ open, onClose, fecha, departamento }) => {
    const [lotes, setLotes] = useState<LoteDiaInfo[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState('');
    const [exportando, setExportando] = useState(false);
    const [exportado, setExportado] = useState(false);

    const formatearFechaParaAPI = (f: Date) => format(f, 'yyyy-MM-dd');
    const formatearFechaParaMostrar = (f: Date) => format(f, 'dd/MM/yyyy', { locale: es });

    useEffect(() => {
        const cargarLotes = async () => {
            if (!open || !fecha || !departamento) return;

            setCargando(true);
            setError(null);
            try {
                const fechaFormateada = formatearFechaParaAPI(fecha);
                const depLowerCase = departamento.toLowerCase();
                
                const data = await getLotesDia(fechaFormateada, depLowerCase);
                setLotes(data);
                if (data.length === 0) {
                    setError('No se encontraron lotes para esta fecha y departamento.');
                }
            } catch (err: any) {
                setError(err.message || 'Error al cargar los lotes.');
                setLotes([]);
            } finally {
                setCargando(false);
            }
        };
        cargarLotes();
    }, [open, fecha, departamento]);

    const lotesFiltrados = lotes.filter(lote => {
        const textoFiltro = filtro.toLowerCase();
        return Object.values(lote).some(val =>
            String(val).toLowerCase().includes(textoFiltro)
        );
    });

    const exportarPDF = async () => {
        setExportando(true);
        setExportado(false);

        await new Promise(resolve => setTimeout(resolve, 500));

        const doc = new jsPDF();
        const fechaFormateada = formatearFechaParaMostrar(fecha);
        doc.text(`Listado de Lotes - ${departamento} - ${fechaFormateada}`, 14, 15);

        autoTable(doc, {
            head: [['Pedido', 'Lote', 'Estilo', 'Combinación', 'Corrida', 'Pares']],
            body: lotesFiltrados.map(l => [
                (l as any).pedido || '',
                l.lote,
                l.estilo,
                (l as any).combinacion || '',
                (l as any).corridacpt || '',
                (l as any).npares || ''
            ]),
            startY: 25,
        });

        doc.save(`Lotes_${departamento}_${format(fecha, 'yyyy-MM-dd')}.pdf`);
        setExportado(true);
        setTimeout(() => setExportado(false), 2000);
        setExportando(false);
    };

    return (
    <CustomDialog open={open} onClose={onClose} title={`Listado de Lotes - ${departamento} - ${formatearFechaParaMostrar(fecha)}`}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <CustomInput
            placeholder="Buscar en el listado..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            icon={<Search size={18} className="text-gray-400" />}
          />
          <CustomButton
            onClick={exportarPDF}
            disabled={cargando || lotesFiltrados.length === 0 || exportando}
            variant="primary"
            icon={exportando ? <Loader2 className="animate-spin" /> : exportado ? <Check /> : <Download />}
          >
            {exportando ? 'Exportando...' : exportado ? '¡Éxito!' : 'Exportar'}
          </CustomButton>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : error && lotesFiltrados.length === 0 ? (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2">
            <AlertCircle /> {error}
          </div>
        ) : !error && lotesFiltrados.length === 0 ? (
           <div className="p-4 bg-blue-100 text-blue-800 rounded-md">
            No se encontraron lotes que coincidan con la búsqueda.
          </div>
        ) : (
          <CustomCard padding="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Pedido</th>
                    <th scope="col" className="px-4 py-3">Lote</th>
                    <th scope="col" className="px-4 py-3">Estilo</th>
                    <th scope="col" className="px-4 py-3">Combinación</th>
                    <th scope="col" className="px-4 py-3">Corrida</th>
                    <th scope="col" className="px-4 py-3 text-right">Pares</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesFiltrados.map((lote, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-2">{(lote as any).pedido}</td>
                      <td className="px-4 py-2">{lote.lote}</td>
                      <td className="px-4 py-2">{lote.estilo}</td>
                      <td className="px-4 py-2">{lote.combinacion}</td>
                      <td className="px-4 py-2">{(lote as any).corridacpt}</td>
                      <td className="px-4 py-2 text-right">{(lote as any).npares}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CustomCard>
        )}
         <p className="text-sm text-gray-500">Total: {lotesFiltrados.length} lote(s)</p>
      </div>
    </CustomDialog>
  );
};