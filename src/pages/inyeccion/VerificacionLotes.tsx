import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Download, RefreshCw, FileCheck, FileText, Loader2, Search } from 'lucide-react';
import { LoteInfo } from '../../types/inyeccion/Inyeccion';
import { getLotesNoVendidos, verificarLotesVendidos, updateLotesVendidos } from '../../services/inyeccion/api-inyeccion';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomPagination } from '../../components/ui/CustomPagination';
import { ListadoDetaFact } from '../../components/inyeccion/ListadoDetaFact';

const VerificacionLotes: React.FC = () => {
  const [lotes, setLotes] = useState<LoteInfo[]>([]);
  const [lotesChecked, setLotesChecked] = useState<LoteInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(50);
  const [openDetaFact, setOpenDetaFact] = useState(false);

  const filteredLotes = useMemo(() => {
    if (!searchTerm) return lotes;
    return lotes.filter(l => l.lote.toString().includes(searchTerm) || l.years.toString().includes(searchTerm));
  }, [lotes, searchTerm]);

  const paginatedLotes = useMemo(() => {
    return filteredLotes.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredLotes, page, rowsPerPage]);

  const stats = useMemo(() => ({
    total: lotes.length,
    verificados: lotesChecked.length,
    pendientes: lotes.length - lotesChecked.length,
  }), [lotes.length, lotesChecked.length]);

  const cargarLotesNoVendidos = async () => {
    setLoading(true);
    const toastId = toast.loading('Cargando lotes no vendidos...');
    try {
      const data = await getLotesNoVendidos();
      setLotes(data);
      setLotesChecked([]); // Resetear verificados
      setPage(0);
      toast.success(`${data.length} lotes cargados.`, { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar lotes.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarLotes = async () => {
    if (stats.pendientes === 0) {
      toast('No hay lotes pendientes de verificar.');
      return;
    }
    setVerificando(true);
    const toastId = toast.loading('Verificando lotes con facturas...');
    try {
      const lotesAVerificar = lotes.filter(lote => !lotesChecked.some(lc => lc.lote === lote.lote && lc.years === lote.years));
      const lotesVendidosEncontrados = await verificarLotesVendidos({ lotes: lotesAVerificar });

      if (lotesVendidosEncontrados.length > 0) {
        await updateLotesVendidos({ lotes: lotesVendidosEncontrados });

        setLotesChecked(prev => {
          const nuevosLotes = lotesVendidosEncontrados.filter(
            vendido => !prev.some(p => p.lote === vendido.lote && p.years === vendido.years)
          );
          return [...prev, ...nuevosLotes];
        });
        toast.success(`${lotesVendidosEncontrados.length} nuevos lotes vendidos encontrados y actualizados en la base de datos.`, { id: toastId, duration: 4000 });
      }else{
        toast.success('No se encontraron nuevos lotes vendidos.', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error durante la verificación.', { id: toastId });
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Verificación de Lotes Vendidos</h1>

      <div className="flex flex-col md:flex-row gap-2">
        <CustomButton onClick={cargarLotesNoVendidos} disabled={loading} variant="primary" icon={loading ? <Loader2 className="animate-spin" /> : <Download />}>
          {loading ? 'Cargando...' : 'Cargar Lotes'}
        </CustomButton>
        <CustomButton onClick={handleVerificarLotes} disabled={verificando || lotes.length === 0} variant="success" icon={verificando ? <Loader2 className="animate-spin" /> : <FileCheck />}>
          {verificando ? 'Verificando...' : 'Verificar Vendidos'}
        </CustomButton>
        <CustomButton onClick={() => setOpenDetaFact(true)} variant="secondary" icon={<FileText />}>
          Ver Facturas
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomCard><h3 className="font-medium">Total de Lotes</h3><p className="text-2xl font-bold">{stats.total}</p></CustomCard>
        <CustomCard><h3 className="font-medium">Lotes Verificados</h3><p className="text-2xl font-bold text-green-600">{stats.verificados}</p></CustomCard>
        <CustomCard><h3 className="font-medium">Lotes Pendientes</h3><p className="text-2xl font-bold text-orange-500">{stats.pendientes}</p></CustomCard>
      </div>

      {lotes.length > 0 && (
        <CustomInput
          placeholder="Buscar por lote o año..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          icon={<Search size={18} className="text-gray-400" />}
        />
      )}

      <CustomCard padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Lote</th>
                <th className="px-6 py-3">Año</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLotes.map((lote) => (
                <tr key={`${lote.lote}-${lote.years}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{lote.lote}</td>
                  <td className="px-6 py-4">{lote.years}</td>
                  <td className="px-6 py-4">
                    {lotesChecked.some(l => l.lote === lote.lote && l.years === lote.years) ? (
                      <span className="flex items-center text-green-600"><FileCheck className="mr-2" /> Vendido</span>
                    ) : (
                      <span className="flex items-center text-blue-600"><RefreshCw className="mr-2" /> Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedLotes.length === 0 && !loading && <div className="text-center p-8 text-gray-500">No se encontraron lotes.</div>}
        </div>
      </CustomCard>

      {filteredLotes.length > rowsPerPage && (
        <CustomPagination
          count={Math.ceil(filteredLotes.length / rowsPerPage)}
          page={page}
          onPageChange={setPage}
        />
      )}

      {openDetaFact && <ListadoDetaFact open={openDetaFact} onClose={() => setOpenDetaFact(false)} />}
    </div>
  );
};

export default VerificacionLotes;