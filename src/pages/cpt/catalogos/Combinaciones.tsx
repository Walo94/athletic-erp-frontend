import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Combinacion, CombinacionConDescripcion, CombinacionFormData } from '../../../types/cpt/catalogos/Combinacion';
import { Material } from '../../../types/cpt/catalogos/Material';
import { Color } from '../../../types/cpt/catalogos/Color';
import { PaginationInfo } from '../../../types/index';
import { getCombinaciones, createCombinacion, updateCombinacion, getMateriales, getColors } from '../../../services/cpt/catalogos/api-catalogos';
import CombinacionForm from '../../../components/cpt/catalogos/CombinacionForm';
import { CustomButton } from "../../../components/ui/CustomButton";

const Combinaciones: React.FC<{ empresa: string }> = ({ empresa }) => {
  const [combinaciones, setCombinaciones] = useState<Combinacion[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [colores, setColores] = useState<Color[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Combinacion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [data, materialesData, coloresData] = await Promise.all([
          getCombinaciones(empresa),
          getMateriales(empresa),
          getColors(empresa)
        ]);
        setCombinaciones(data);
        setMateriales(materialesData);
        setColores(coloresData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [empresa]);

  const combinacionesConDescripciones = useMemo((): CombinacionConDescripcion[] => {
    const materialMap = new Map(materiales.map(m => [m.material, m.descripcion]));
    const colorMap = new Map(colores.map(c => [c.color, c.descripcion]));
    const N_A = '-';

    return combinaciones.map(item => ({
      ...item,
      material1Descripcion: materialMap.get(item.material1) || N_A,
      color1Descripcion: colorMap.get(item.color1) || N_A,
      material2Descripcion: item.material2 ? materialMap.get(item.material2) || N_A : N_A,
      color2Descripcion: item.color2 ? colorMap.get(item.color2) || N_A : N_A,
      material3Descripcion: item.material3 ? materialMap.get(item.material3) || N_A : N_A,
      color3Descripcion: item.color3 ? colorMap.get(item.color3) || N_A : N_A,
      material4Descripcion: item.material4 ? materialMap.get(item.material4) || N_A : N_A,
      color4Descripcion: item.color4 ? colorMap.get(item.color4) || N_A : N_A,
      material5Descripcion: item.material5 ? materialMap.get(item.material5) || N_A : N_A,
      color5Descripcion: item.color5 ? colorMap.get(item.color5) || N_A : N_A,
      material6Descripcion: item.material6 ? materialMap.get(item.material6) || N_A : N_A,
      color6Descripcion: item.color6 ? colorMap.get(item.color6) || N_A : N_A,
    }));
  }, [combinaciones, materiales, colores]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return combinacionesConDescripciones;
    const lowercasedTerm = searchTerm.toLowerCase();
    return combinacionesConDescripciones.filter(item =>
      item.combinacion.toString().includes(lowercasedTerm) ||
      item.material1Descripcion.toLowerCase().includes(lowercasedTerm) ||
      item.color1Descripcion.toLowerCase().includes(lowercasedTerm)
    );
  }, [combinacionesConDescripciones, searchTerm]);

  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { currentPage, totalPages, totalItems, itemsPerPage };
  }, [filteredItems.length, itemsPerPage, currentPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleSave = async (data: CombinacionFormData) => {
    try {
      if (editingItem) {
        const updated = await updateCombinacion(empresa, editingItem.combinacion, data);
        setCombinaciones(prev => prev.map(c => c.combinacion === updated.combinacion ? updated : c));
        toast.success('Registro editado!');
      } else {
        const created = await createCombinacion(empresa, data);
        setCombinaciones(prev => [...prev, created]);
        toast.success('Registro agregado!');
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      toast.error("Error al guardar el registro.");
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
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">Gestionar Combinaciones</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar por combinación o descripción..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <CustomButton onClick={() => { setEditingItem(null); setIsFormOpen(true); }} variant="primary" icon={<Plus size={16} />}>
                Registrar Combinación
              </CustomButton>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Cargando datos...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">{error}</div>
            ) : (
              <>
                {paginatedItems.length === 0 && searchTerm ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <img
                      src="/not-found.gif"
                      alt="Sin resultados"
                      className="mb-4 w-30 h-30"
                    />
                    <p className="text-gray-800 font-bold dark:text-gray-300">No se encotraron resultados</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Comb.</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 1</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 1</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 2</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 2</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 3</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 3</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 4</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 4</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 5</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 5</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Material 6</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Color 6</th>
                          <th className="p-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {paginatedItems.map(item => (
                          <tr key={item.combinacion} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.combinacion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material1Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color1Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material2Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color2Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material3Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color3Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material4Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color4Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material5Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color5Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.material6Descripcion}</td>
                            <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{item.color6Descripcion}</td>
                            <td className="p-3 whitespace-nowrap">
                              <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar</span>
                      <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-700 dark:text-gray-300">de {paginationInfo.totalItems} registros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded border disabled:opacity-50">
                        <ChevronLeft size={16} />
                      </button>
                      {getPageNumbers().map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                          {page}
                        </button>
                      ))}
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === paginationInfo.totalPages} className="p-2 rounded border disabled:opacity-50">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isFormOpen && (
        <CombinacionForm
          combinacion={editingItem}
          materiales={materiales}
          colores={colores}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Combinaciones;