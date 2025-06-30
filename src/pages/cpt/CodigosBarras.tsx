import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus, Save, Barcode, Loader2 } from 'lucide-react';

// APIs de nuestro nuevo módulo
import { getCodigosBarras, guardarCodigosEnDBF } from '../../services/cpt/api-codigos-barras';
import { CodigoInfo, RegistroDBF } from '../../types/cpt/CodigosBarras';

// APIs de módulos relacionados (para obtener corridas, combinaciones, etc.)
import { getProducto, getCombinaciones, getCorridaInfo } from '../../services/cmp/api-suela';
import { CombinacionInfo } from '../../types/cmp/Suela';

// Componentes de UI personalizados
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomCard } from '../../components/ui/CustomCard';
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomSelect } from '../../components/ui/CustomSelect';

// Definición de la estructura de una fila en la UI
interface ProductoFila {
  estilo: string;
  corrida: string;
  descripcionCorrida: string;
  combinacion: string;
  combinacionDescripcion: string;
  producto: number | null;
  codigosBarras: CodigoInfo[];
  combinacionesDisponibles: CombinacionInfo[];
}

const CodigosBarras: React.FC = () => {
  const [productos, setProductos] = useState<ProductoFila[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const agregarFila = () => {
    const nuevaFila: ProductoFila = {
      estilo: '', corrida: '', descripcionCorrida: '', combinacion: '',
      combinacionDescripcion: '', producto: null, codigosBarras: [],
      combinacionesDisponibles: []
    };
    setProductos(prev => [...prev, nuevaFila]);
  };

  const limpiarFila = (index: number) => {
    setProductos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof ProductoFila, value: any) => {
    setProductos(prev => prev.map((prod, i) =>
      i === index ? { ...prod, [field]: value } : prod
    ));
  };

  const handleBlur = async (index: number) => {
    const { estilo, corrida } = productos[index];
    if (!estilo || !corrida) return;

    setLoading(prev => ({ ...prev, [index]: true }));
    try {
      const { descripcionCorrida } = await getCorridaInfo(Number(corrida));
      const combinaciones = await getCombinaciones(Number(estilo), Number(corrida));

      handleFieldChange(index, 'descripcionCorrida', descripcionCorrida || "No disponible");
      handleFieldChange(index, 'combinacionesDisponibles', combinaciones);
    } catch (error: any) {
      toast.error(error.message || 'Error al obtener datos de corrida/combinación.');
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleCombinacionChange = async (index: number, nuevaCombinacion: string) => {
    if (!nuevaCombinacion) return;

    const filaActual = productos[index];
    const descripcion = filaActual.combinacionesDisponibles.find(c => c.Combinacion === Number(nuevaCombinacion))?.CombinacionDescripcion || '';

    handleFieldChange(index, 'combinacion', nuevaCombinacion);
    handleFieldChange(index, 'combinacionDescripcion', descripcion);

    setLoading(prev => ({ ...prev, [index]: true }));
    try {
      const { producto } = await getProducto(Number(filaActual.estilo), Number(filaActual.corrida), Number(nuevaCombinacion));
      if (producto) {
        handleFieldChange(index, 'producto', producto);
        const { codigos } = await getCodigosBarras(producto);
        handleFieldChange(index, 'codigosBarras', codigos);
      } else {
        toast.error('Producto no encontrado.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al buscar el producto o sus códigos.');
      handleFieldChange(index, 'producto', null);
      handleFieldChange(index, 'codigosBarras', []);
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const guardarEnDBF = async () => {
    const registros: RegistroDBF[] = productos.flatMap(prod => {
      if (!prod.estilo || !prod.corrida || !prod.combinacion || !prod.codigosBarras) return [];
      return prod.codigosBarras.map(cb => ({
        estilo: prod.estilo,
        combinacion: prod.combinacion,
        descripcionCombinacion: prod.combinacionDescripcion,
        corrida: prod.corrida,
        descripcionCorrida: prod.descripcionCorrida,
        punto: cb.talla,
        codigoBarras: cb.codigo
      }));
    }).filter(reg => reg.codigoBarras);

    if (registros.length === 0) {
      toast.error('No hay registros válidos para guardar.');
      return;
    }

    const toastId = toast.loading('Guardando registros en DBF...');
    try {
      const response = await guardarCodigosEnDBF({ registros });
      toast.success(response.message, { id: toastId });
      setProductos([]); // Limpiar formulario
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar.', { id: toastId });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white">Generación de Códigos de Barras</h2>

      <div className="flex gap-2">
        <CustomButton onClick={agregarFila} variant="primary" icon={<Plus />}>Agregar Fila</CustomButton>
        <CustomButton onClick={guardarEnDBF} variant="success" icon={<Save />} disabled={productos.length === 0}>Guardar Todo</CustomButton>
      </div>

      <div className="space-y-4">
        {productos.map((prod, index) => (
          <CustomCard key={index}>
            <div className="flex items-start gap-4">

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CustomInput label="Estilo" type="number" value={prod.estilo} onChange={e => handleFieldChange(index, 'estilo', e.target.value)} onBlur={() => handleBlur(index)} />
                <CustomInput label="Corrida" type="number" value={prod.corrida} onChange={e => handleFieldChange(index, 'corrida', e.target.value)} onBlur={() => handleBlur(index)} />
                <div><label className="block text-sm font-medium dark:text-white">Desc. Corrida</label><p className="p-2 h-10 dark:text-gray-300">{prod.descripcionCorrida || '-'}</p></div>

                <CustomSelect label="Combinación" value={prod.combinacion} onChange={e => handleCombinacionChange(index, e.target.value)} disabled={prod.combinacionesDisponibles.length === 0}>
                  <option value="">Seleccione...</option>
                  {prod.combinacionesDisponibles.map(c => <option key={c.Combinacion} value={c.Combinacion}>{c.CombinacionDescripcion}</option>)}
                </CustomSelect>
              </div>

              <button onClick={() => limpiarFila(index)} className="text-red-500 hover:text-red-700 p-1 mt-7 flex-shrink-0">
                <Trash2 size={18} />
              </button>

            </div>
            <div className="mt-4 border-t pt-4 dark:border-gray-700">
              <h3 className="font-semibold mb-2 dark:text-white">Resultados</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div><label className="block text-sm font-medium dark:text-white">Producto ID</label><p className="p-2 h-10 font-bold text-[#42b0ff]">{prod.producto || '-'}</p></div>
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium mb-1 dark:text-white">Códigos de Barras Generados</label>
                  {loading[index] ? <Loader2 className="animate-spin text-[#42b0ff]" /> : (
                    prod.codigosBarras.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {prod.codigosBarras.map(cb => (
                          <div key={cb.codigo} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                            {/* --- LÍNEA CORREGIDA --- */}
                            <Barcode size={16} className="text-gray-700 dark:text-[#42b0ff]" />

                            {/* --- LÍNEA CORREGIDA --- */}
                            <span className="text-sm font-mono text-gray-700 dark:text-[#42b0ff]">{cb.talla} - {cb.codigo}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-sm text-gray-500 dark:text-gray-400">No hay códigos para mostrar.</p>
                  )}
                </div>
              </div>
            </div>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default CodigosBarras;