import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Corrida, CorridaFormData } from '../../../types/cpt/catalogos/Corrida';
import { PaginationInfo } from '../../../types/index';
import CorridaForm from '../../../components/cpt/catalogos/CorridaForm';
import { getCorridas, createCorrida, updateCorrida } from '../../../services/cpt/catalogos/api-catalogos';
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomCard } from '../../../components/ui/CustomCard'; // Asumiendo que existe un CustomCard

interface CorridasProps {
  empresa: string;
}

const Corridas: React.FC<CorridasProps> = ({ empresa }) => {
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCorrida, setEditingCorrida] = useState<Corrida | null>(null);

  useEffect(() => {
    const fetchCorridas = async () => {
      try {
        setLoading(true);
        const data = await getCorridas(empresa);
        setCorridas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las corridas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCorridas();
  }, [empresa]);

  const filteredCorridas = useMemo(() => {
    if (!corridas) return [];
    return corridas.filter(c =>
      (c.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.corrida.toString().includes(searchTerm)
    );
  }, [corridas, searchTerm]);

  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredCorridas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { currentPage, totalPages, totalItems, itemsPerPage };
  }, [filteredCorridas.length, itemsPerPage, currentPage]);
  
  const paginatedCorridas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCorridas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCorridas, currentPage, itemsPerPage]);

  const handleSaveCorrida = async (corridaData: CorridaFormData) => {
    const toastId = toast.loading(editingCorrida ? 'Actualizando...' : 'Guardando...');
    try {
      if (editingCorrida) {
        const updated = await updateCorrida(empresa, editingCorrida.corrida, corridaData);
        setCorridas(prev => prev.map(c => (c.corrida === updated.corrida ? updated : c)));
        toast.success('Registro editado!', { id: toastId });
      } else {
        const created = await createCorrida(empresa, corridaData);
        setCorridas(prev => [...prev, created]);
        toast.success('Registro agregado!', { id: toastId });
      }
      setIsFormOpen(false);
      setEditingCorrida(null);
    } catch (err) {
      toast.error("Error al guardar la corrida.", { id: toastId });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(paginationInfo.totalPages, currentPage + halfRange);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(paginationInfo.totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">Gestiona las corridas del sistema</h2>
          
          <CustomCard className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por # o descripción..."
                  value={searchTerm}
                  onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <CustomButton onClick={() => { setEditingCorrida(null); setIsFormOpen(true); }} variant="primary" icon={<Plus size={16} />}>
                Registrar Corrida
              </CustomButton>
            </div>
          </CustomCard>

          <CustomCard padding="p-0" className="overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Cargando datos...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">{error}</div>
            ) : (
              <>
                <div className="overflow-auto max-h-[calc(100vh-400px)]">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Corrida</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pto. Inicial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pto. Final</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedCorridas.map((corrida) => (
                        <tr key={corrida.corrida} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{corrida.corrida}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{corrida.descripcion}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{corrida.puntoInicial}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{corrida.puntoFinal}</td>
                          <td className="px-6 py-4">
                            <button onClick={() => { setEditingCorrida(corrida); setIsFormOpen(true); }} className="text-blue-600 dark:text-blue-400 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar</span>
                      <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-700 dark:text-gray-300">de {paginationInfo.totalItems} registros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {getPageNumbers().map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-[#42b0ff] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          {page}
                        </button>
                      ))}
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= paginationInfo.totalPages} className="p-2 rounded-lg border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CustomCard>
        </div>
      </div>
      {isFormOpen && <CorridaForm corrida={editingCorrida} onSave={handleSaveCorrida} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Corridas;