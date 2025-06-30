import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Search, Download, AlertCircle, Loader2, Check } from 'lucide-react';
import { getDatosDetaFact } from '../../services/inyeccion/api-inyeccion';
import { DetaFactRecord } from '../../types/inyeccion/Inyeccion';
import { CustomDialog } from '../ui/CustomDialog';
import { CustomInput } from '../ui/CustomInput';
import { CustomButton } from '../ui/CustomButton';
import { CustomCard } from '../ui/CustomCard';
import { CustomPagination } from '../ui/CustomPagination';

interface ListadoDetaFactProps {
    open: boolean;
    onClose: () => void;
}

const formatarFechaDisplay = (fecha: Date | string | null): string => {
    if (!fecha) return '';
    if (fecha instanceof Date) {
        return format(fecha, 'dd/MM/yyyy');
    }
    return fecha;
};

export const ListadoDetaFact: React.FC<ListadoDetaFactProps> = ({ open, onClose }) => {
    const [registros, setRegistros] = useState<DetaFactRecord[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState('');
    const [exportando, setExportando] = useState(false);
    const [exportado, setExportado] = useState(false);
    const [page, setPage] = useState(0);
    const rowsPerPage = 25;

    useEffect(() => {
        if (!open) return;
        const cargarDatos = async () => {
            setCargando(true);
            setError(null);
            try {
                const data = await getDatosDetaFact();
                setRegistros(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar datos de DETAFACT.');
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [open]);

    const registrosFiltrados = useMemo(() => {
        if (!filtro) return registros;
        const textoFiltro = filtro.toLowerCase();
        return registros.filter(r =>
            Object.values(r).some(val => String(val).toLowerCase().includes(textoFiltro))
        );
    }, [registros, filtro]);

    const registrosPaginados = useMemo(() => {
        return registrosFiltrados.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }, [registrosFiltrados, page, rowsPerPage]);

    const exportarPDF = async () => {
        setExportando(true);
        setExportado(false);

        await new Promise(resolve => setTimeout(resolve, 500));

        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(16);
        doc.text(`Registros de Facturas (DETAFACT)`, 14, 15);

        autoTable(doc, {
            head: [['Tipo', 'Factura', 'Mes', 'Lote', 'Estilo', 'Corrida', 'Combinación', 'Cant.', 'Precio', 'Importe', 'Fecha']],
            body: registrosFiltrados.map(r => [
                r.TIP_FACT,
                r.NUM_FACT,
                r.MES_FACT,
                r.LOT_FACT,
                r.EST_FACT,
                r.COR_FACT,
                r.COM_FACT,
                r.CAN_FACT,
                r.PRE_FACT.toFixed(2),
                r.IMP_FACT.toFixed(2),
                formatarFechaDisplay(r.FEC_FACT_FORMATEADA || r.FEC_FACT),
            ]),
            startY: 25,
            styles: { fontSize: 7 },
            headStyles: { fillColor: [49, 146, 204] },
        });

        doc.save(`Registros_DETAFACT_${new Date().toISOString().split('T')[0]}.pdf`);
        setExportado(true);
        setTimeout(() => setExportado(false), 2000);
        setExportando(false);
    };

    return (
        <CustomDialog open={open} onClose={onClose} title="Registros de Facturas (DETAFACT)">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <CustomInput
                        placeholder="Buscar en todos los campos..."
                        value={filtro}
                        onChange={(e) => { setFiltro(e.target.value); setPage(0); }}
                        icon={<Search size={18} className="text-gray-400" />}
                    />
                    <CustomButton
                        onClick={exportarPDF}
                        disabled={cargando || registrosFiltrados.length === 0 || exportando}
                        variant="primary"
                        icon={exportando ? <Loader2 className="animate-spin" /> : exportado ? <Check /> : <Download />}
                    >
                        {exportando ? 'Exportando...' : exportado ? '¡Éxito!' : 'Exportar'}
                    </CustomButton>
                </div>
                {cargando ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : error ? (
                    <div className="p-4 bg-red-100 text-red-800 rounded-md flex items-center gap-2"><AlertCircle /> {error}</div>
                ) : (
                    <>
                        <CustomCard padding="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3">Tipo</th>
                                            <th className="px-4 py-3">Factura</th>
                                            <th className="px-4 py-3">Lote</th>
                                            <th className="px-4 py-3">Estilo</th>
                                            <th className="px-4 py-3">Combinación</th>
                                            <th className="px-4 py-3">Cantidad</th>
                                            <th className="px-4 py-3">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrosPaginados.map((r, i) => (
                                            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
                                                <td className="px-4 py-2">{r.TIP_FACT}</td>
                                                <td className="px-4 py-2">{r.NUM_FACT}</td>
                                                <td className="px-4 py-2">{r.LOT_FACT}</td>
                                                <td className="px-4 py-2">{r.EST_FACT}</td>
                                                <td className="px-4 py-2 truncate max-w-xs">{r.COM_FACT}</td>
                                                <td className="px-4 py-2">{r.CAN_FACT}</td>
                                                <td className="px-4 py-2">{formatarFechaDisplay(r.FEC_FACT_FORMATEADA || r.FEC_FACT)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CustomCard>
                        {registrosFiltrados.length > 0 ? (
                            <CustomPagination
                                count={Math.ceil(registrosFiltrados.length / rowsPerPage)}
                                page={page}
                                onPageChange={setPage}
                            />
                        ) : (
                            <div className="text-center p-8 text-gray-500">No se encontraron registros con el filtro actual.</div>
                        )}
                    </>
                )}
            </div>
        </CustomDialog>
    );
};