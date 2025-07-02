import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Color, ColorFormData } from '../../../types/cpt/catalogos/Color';
import { PaginationInfo } from '../../../types/index';
import ColorForm from '../../../components/cpt/catalogos/ColorForm';
import { getColors, createColor, updateColor } from '../../../services/cpt/catalogos/api-catalogos';
import { CustomButton } from "../../../components/ui/CustomButton";

interface ColoresProps {
  empresa: string;
}

const Colores: React.FC<ColoresProps> = ({ empresa }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoading(true);
        const data = await getColors(empresa);
        setColors(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los colores. Por favor, intente más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [empresa]);

  const filteredColors = useMemo(() => {
    // Si el array de colores no está listo, devuelve un array vacío para evitar errores.
    if (!colors) return [];

    return colors.filter(color => {
      // Asegúrate de que el objeto 'color' exista antes de intentar acceder a sus propiedades
      if (!color) return false;

      // ---- LA CORRECCIÓN ESTÁ AQUÍ ----
      // Se usa (color.descripcion || '') para evitar el error si la descripción es null o undefined.
      const hasMatchingDescription = (color.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Se hace lo mismo para el campo 'color' por seguridad.
      const hasMatchingColor = (color.color || '').toString().includes(searchTerm);

      return hasMatchingDescription || hasMatchingColor;
    });
  }, [colors, searchTerm]);


  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredColors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { currentPage, totalPages, totalItems, itemsPerPage };
  }, [filteredColors.length, itemsPerPage, currentPage]);

  const paginatedColors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredColors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredColors, currentPage, itemsPerPage]);

  const handleSaveColor = async (colorData: ColorFormData) => {
    try {
      if (editingColor) {
        const updatedColor = await updateColor(empresa, editingColor.color, {
          descripcion: colorData.descripcion
        });
        setColors(prev => prev.map(c => (c.color === updatedColor.color ? updatedColor : c)));
        toast.success('Registro editado!')
      } else {
        const newColor = await createColor(empresa, colorData);
        setColors(prev => [...prev, newColor]);
        toast.success('Registro agregado!')
      }

      setIsFormOpen(false);
      setEditingColor(null);
    } catch (err) {
      toast.error("Error al guardar el color." + err)
      //setError('No se pudo guardar el color. Verifique los datos o contacte a soporte.');
    }
  };

  // El resto de los manejadores (handlers) y la lógica de paginación se mantienen igual...
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

  const handleAddColor = () => {
    setEditingColor(null);
    setIsFormOpen(true);
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingColor(null);
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
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">Gestiona los colores disponibles en el sistema</h2>
          </div>

          {/* Controles */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Buscador */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por color o descripción..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Botón Registrar */}
              <CustomButton onClick={handleAddColor} variant="primary" icon={<Plus size={16} />}>
                Registrar Color
              </CustomButton>
              
            </div>
          </div>

          {/* Tabla y Feedback */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Cargando datos...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">{error}</div>
            ) : (
              <>
              {paginatedColors.length === 0 && searchTerm ? (
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">
                            Color
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">
                            Descripción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-300 uppercase">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {paginatedColors.map((color) => (
                          <tr key={color.color} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                              {color.color}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">
                              {color.descripcion}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditColor(color)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Paginación */}
                <div className="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Selector de elementos por página */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        de {paginationInfo.totalItems} registros
                      </span>
                    </div>

                    {/* Controles de paginación */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === page
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          style={currentPage === page ? { backgroundColor: '#42b0ff' } : {}}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === paginationInfo.totalPages}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
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
        <ColorForm
          color={editingColor}
          onSave={handleSaveColor}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Colores;