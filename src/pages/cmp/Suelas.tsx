import React, { useState } from "react";
import { Trash2, Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomCard } from "../../components/ui/CustomCard";
import { useBreakpoint } from "../../hooks/useBreakpoint";

// 2. Importando tipos y servicios de API para Suelas
import {
  CombinacionInfo,
  CombinacionProdCreateData
} from "../../types/cmp/Suela";
import {
  getProducto,
  getCombinaciones,
  getCorridaInfo,
  getSuelaInfo,
  createCombinacionProd,
} from "../../services/cmp/api-suela";

// 3. Definiendo la interfaz para una fila de la tabla
interface SuelaFila {
  estilo: string;
  corrida: string;
  descripcionCorrida: string;
  combinacion: string; // Se mantiene como string, que es lo correcto para un <select>
  combinacionDescripcion: string;
  producto: number | null;
  suela: string;
  descripcionSuela: string;
  combinacionesDisponibles: CombinacionInfo[];
}

// ===================================================================
// COMPONENTE PRINCIPAL DE SUELAS
// ===================================================================
const Suelas: React.FC = () => {
  //const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  const [productos, setProductos] = useState<SuelaFila[]>([]);
  const formElementClasses = "w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600";
  //const nombreUsuario = JSON.parse(localStorage.getItem("userSession") || '{}')?.nombreUsuario || "Usuario";


  /*
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/");
    }
  }, [navigate]);*/

  const agregarFila = () => {
    const nuevaFila: SuelaFila = {
      estilo: '', corrida: '', descripcionCorrida: '', combinacion: '',
      combinacionDescripcion: '', producto: null, suela: '',
      descripcionSuela: '', combinacionesDisponibles: []
    };
    setProductos(prev => [...prev, nuevaFila]);
  };

  const limpiarFila = (index: number) => {
    setProductos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof SuelaFila, value: any) => {
    setProductos(prev => prev.map((prod, i) =>
      i === index ? { ...prod, [field]: value } : prod
    ));
  };

  const handleBlur = async (index: number) => {
    const { estilo, corrida } = productos[index];
    if (estilo && corrida) {
      try {
        const responseCorrida = await getCorridaInfo(Number(corrida));
        const descripcionCorrida = responseCorrida?.descripcionCorrida || "No disponible";
        const combinacionesDisponibles = await getCombinaciones(Number(estilo), Number(corrida));
        setProductos(prev => prev.map((prod, i) =>
          i === index ? { ...prod, combinacionesDisponibles, descripcionCorrida, combinacion: '', producto: null } : prod
        ));
      } catch (error: any) {
        toast.error(error.message || 'Error al obtener datos');
      }
    }
  };

  const handleCombinacionChange = async (index: number, nuevaCombinacion: string) => {
    // Actualizamos el estado de forma funcional para evitar problemas de "stale state"
    setProductos(prev => {
      const filaActual = prev[index];
      const combinacionNum = Number(nuevaCombinacion);
      const descripcion = filaActual.combinacionesDisponibles.find(c => c.Combinacion === combinacionNum)?.CombinacionDescripcion || '';

      // Buscamos el producto de forma asíncrona
      if (filaActual.estilo && filaActual.corrida && nuevaCombinacion) {
        getProducto(Number(filaActual.estilo), Number(filaActual.corrida), combinacionNum)
          .then(productoInfo => {
            handleFieldChange(index, 'producto', productoInfo.producto);
          })
          .catch(error => {
            toast.error(error.message || 'Producto no encontrado');
            handleFieldChange(index, 'producto', null);
          });
      }

      // Devolvemos el nuevo estado inmediatamente para la UI
      return prev.map((prod, i) =>
        i === index ? { ...prod, combinacion: nuevaCombinacion, combinacionDescripcion: descripcion } : prod
      );
    });
  };

  const handleBuscarSuela = async (index: number) => {
    const { suela } = productos[index];
    if (suela) {
      try {
        const response = await getSuelaInfo(Number(suela));
        handleFieldChange(index, 'descripcionSuela', response?.descripcionSuela || "No disponible");
      } catch (error: any) {
        toast.error('Suela no encontrada');
        handleFieldChange(index, 'descripcionSuela', 'No encontrada');
      }
    }
  };

  const guardarCombinaciones = async () => {
    const filasValidas = productos.filter(p => p.estilo && p.corrida && p.combinacion && p.suela && p.producto);
    if (filasValidas.length === 0) {
      toast.error('No hay filas completas para guardar');
      return;
    }

    const promesasDeGuardado = filasValidas.map(prod => {
      const body: CombinacionProdCreateData = {
        EstiloCliente: prod.estilo,
        Producto: prod.producto!,
        Suela: Number(prod.suela),
      };
      return createCombinacionProd(body);
    });

    try {
      await Promise.all(promesasDeGuardado);
      toast.success('Combinaciones guardadas exitosamente');
      setProductos([]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al guardar las combinaciones';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Asignación de Suelas por Producto</h1>

      <div className="flex space-x-2">
        <CustomButton onClick={agregarFila} variant="primary" icon={<Plus size={16} />}>
          Agregar Fila
        </CustomButton>
        <CustomButton onClick={guardarCombinaciones} variant="success" icon={<Save size={16} />} disabled={productos.length === 0}>
          Guardar Todo
        </CustomButton>
      </div>

      <CustomCard padding="p-0" className="w-full">
        {isMobile ? (
          <div className="p-4 space-y-4">
            {productos.map((prod, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg p-3 space-y-3 relative">
                <button onClick={() => limpiarFila(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Estilo / Corrida</label>
                  <div className="flex space-x-2">
                    <input type="number" placeholder="Estilo" value={prod.estilo} onChange={e => handleFieldChange(index, 'estilo', e.target.value)} onBlur={() => handleBlur(index)} className="w-full form-input" />
                    <input type="number" placeholder="Corrida" value={prod.corrida} onChange={e => handleFieldChange(index, 'corrida', e.target.value)} onBlur={() => handleBlur(index)} className="w-full form-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Combinación</label>
                  <select value={prod.combinacion} onChange={e => handleCombinacionChange(index, e.target.value)} className="w-full form-select">
                    <option value="">Seleccione...</option>
                    {prod.combinacionesDisponibles.map(c => (
                      <option key={c.Combinacion} value={c.Combinacion.toString()}>{c.CombinacionDescripcion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Suela</label>
                  <input type="number" placeholder="Suela" value={prod.suela} onChange={e => handleFieldChange(index, 'suela', e.target.value)} onBlur={() => handleBuscarSuela(index)} className="w-full form-input" />
                  <p className="text-xs text-gray-500 mt-1">{prod.descripcionSuela}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Estilo</th>
                  <th scope="col" className="px-4 py-3">Corrida</th>
                  <th scope="col" className="px-4 py-3">Desc. Corrida</th>
                  <th scope="col" className="px-4 py-3">Combinación</th>
                  <th scope="col" className="px-4 py-3">Producto</th>
                  <th scope="col" className="px-4 py-3">Suela</th>
                  <th scope="col" className="px-4 py-3">Desc. Suela</th>
                  <th scope="col" className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="p-2 w-24">
                      <input type="number" value={prod.estilo} onChange={e => handleFieldChange(index, 'estilo', e.target.value)} onBlur={() => handleBlur(index)} className={formElementClasses} />
                    </td>
                    <td className="p-2 w-24">
                      <input type="number" value={prod.corrida} onChange={e => handleFieldChange(index, 'corrida', e.target.value)} onBlur={() => handleBlur(index)} className={formElementClasses} />
                    </td>
                    <td className="p-2 w-48 text-gray-500 dark:text-gray-400">{prod.descripcionCorrida}</td>
                    <td className="p-2 w-56">
                      <select value={prod.combinacion} onChange={e => handleCombinacionChange(index, e.target.value)} className={formElementClasses}>
                        <option value="">Seleccione...</option>
                        {prod.combinacionesDisponibles.map(c => (
                          <option key={c.Combinacion} value={c.Combinacion.toString()}>
                            {c.CombinacionDescripcion}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 w-24 text-center font-medium dark:text-white">{prod.producto}</td>
                    <td className="p-2 w-24">
                      <input type="number" value={prod.suela} onChange={e => handleFieldChange(index, 'suela', e.target.value)} onBlur={() => handleBuscarSuela(index)} className={formElementClasses} />
                    </td>
                    <td className="p-2 w-48 text-gray-500 dark:text-gray-400">{prod.descripcionSuela}</td>
                    <td className="p-2 w-20 text-center">
                      <button onClick={() => limpiarFila(index)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CustomCard>
    </div>
  );
};

export default Suelas;