// src/pages/cpt/catalogos/Lineas.tsx

import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Linea, LineaConDescripcion, LineaFormData } from '../../../types/cpt/catalogos/Linea';
import { Marca } from '../../../types/cpt/catalogos/Marca';
import { Sublinea } from '../../../types/cpt/catalogos/Sublinea';
import { PaginationInfo } from '../../../types/index';
import LineaForm from '../../../components/cpt/catalogos/LineaForm';
import { getLineas, createLinea, updateLinea, getMarcas, getSublineas } from '../../../services/cpt/catalogos/api-catalogos';
import { CustomButton } from "../../../components/ui/CustomButton";

interface LineasProps {
  empresa: string;
}

const Lineas: React.FC<LineasProps> = ({ empresa }) => {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [sublineas, setSublineas] = useState<Sublinea[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLinea, setEditingLinea] = useState<Linea | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lineasData, marcasData, sublineasData] = await Promise.all([
          getLineas(empresa),
          getMarcas(empresa),
          getSublineas(empresa)
        ]);
        setLineas(lineasData);
        setMarcas(marcasData);
        setSublineas(sublineasData);
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

  const lineasConDescripciones = useMemo((): LineaConDescripcion[] => {
    const marcaMap = new Map(marcas.map(m => [m.marca, m.descripcion]));
    const sublineaMap = new Map(sublineas.map(s => [s.sublinea, s.descripcion]));

    return lineas.map(linea => ({
      ...linea,
      marcaDescripcion: marcaMap.get(linea.marca) || 'Descripción no encontrada',
      sublineaDescripcion: sublineaMap.get(linea.sublinea) || 'Descripción no encontrada'
    }));
  }, [lineas, marcas, sublineas]);

  const filteredLineas = useMemo(() => {
    return lineasConDescripciones.filter(linea => {
      const search = searchTerm.toLowerCase();
      return (
        linea.descripcion.toLowerCase().includes(search) ||
        linea.linea.toString().includes(search) ||
        linea.marcaDescripcion.toLowerCase().includes(search) ||
        linea.sublineaDescripcion.toLowerCase().includes(search)
      );
    });
  }, [lineasConDescripciones, searchTerm]);

  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredLineas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { currentPage, totalPages, totalItems, itemsPerPage };
  }, [filteredLineas.length, itemsPerPage, currentPage]);

  const paginatedLineas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLineas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLineas, currentPage, itemsPerPage]);

  const handleSaveLinea = async (lineaData: LineaFormData) => {
    try {
      let savedLinea: Linea;
      if (editingLinea) {
        savedLinea = await updateLinea(empresa, editingLinea.linea, lineaData);
        setLineas(prev => prev.map(l => (l.linea === savedLinea.linea ? savedLinea : l)));
        toast.success('Registro editado!');
      } else {
        savedLinea = await createLinea(empresa, lineaData);
        setLineas(prev => [...prev, savedLinea]);
        toast.success('Registro agregado!');
      }
      handleCloseForm();
    } catch (err) {
      toast.error("Error al guardar la línea: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddLinea = () => {
    setEditingLinea(null);
    setIsFormOpen(true);
  };

  const handleEditLinea = (linea: Linea) => {
    setEditingLinea(linea);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLinea(null);
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
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">Gestiona las líneas disponibles en el sistema</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar por línea, descripción, marca..." value={searchTerm} onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <CustomButton onClick={handleAddLinea} variant="primary" icon={<Plus size={16} />}>
                Registrar Línea
              </CustomButton>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? <div className="p-10 text-center text-gray-500">Cargando datos...</div> :
              error ? <div className="p-10 text-center text-red-500">{error}</div> : (
                <>
                {paginatedLineas.length === 0 && searchTerm ? (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <img
                      src="/not-found.gif"
                      alt="Sin resultados"
                      className="mb-4 w-30 h-30"
                    />
                    <p className="text-gray-800 font-bold dark:text-gray-300">No se encotraron resultados</p>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Línea</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Descripción</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Marca</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Sublínea</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {paginatedLineas.map((linea) => (
                          <tr key={linea.linea} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{linea.linea}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-300">{linea.descripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-300">{linea.marcaDescripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-300">{linea.sublineaDescripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button onClick={() => handleEditLinea(linea)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                   )}
                  {paginatedLineas.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar</span>
                          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border border-gray-300 rounded px-2 py-1 text-sm">
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-700 dark:text-gray-300">de {paginationInfo.totalItems} registros</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                          {getPageNumbers().map((page) => (
                            <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-lg text-sm ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>{page}</button>
                          ))}
                          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === paginationInfo.totalPages} className="p-2 rounded-lg border disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
      {isFormOpen && (
        <LineaForm
          linea={editingLinea}
          marcas={marcas}
          sublineas={sublineas}
          onSave={handleSaveLinea}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Lineas;