import React, { useState } from "react";
import { Search, Eraser, Save } from 'lucide-react';
import Swal from "sweetalert2";
import toast from 'react-hot-toast';
import { Commet } from 'react-loading-indicators';

// 1. Importando nuestros nuevos componentes y hook personalizados
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomCard } from "../../components/ui/CustomCard";
import { useBreakpoint } from "../../hooks/useBreakpoint";

// 2. Importando tipos y servicios de API
import { PaqueteAgregado, PaqueteCreateData, PaqueteDetalle } from "../../types/cmp/Paquete";
import { getPaqueteDetalle, createPaquete, deletePaquete } from "../../services/cmp/api-paquete";

// Objeto de mapeo para las corridas y sus puntos
const corridasPuntos: { [key: number]: (number | string)[] } = {
    88: [22, 23, 24, 25, 26, 27],
    89: [12, 13, 14],
    90: [15, 16, 17],
    91: [18, 19, 20, 21],
    92: [22, 23, 24],
    93: [22, 23, 24, 25, 26],
    94: [25, 26, 27, "", 28, 29, 30],
    95: [21, 22, 23, 24, 25],
    96: [30, 31, 32, 33],
    97: [17, 18, 19, 20, 21],
    98: [23, 24, 25, 26, 27]
};

// Interfaz para las props del sub-componente de la tabla
interface ResultadosTableProps {
    resultados: PaqueteAgregado[];
    isMobile: boolean;
}

// ===================================================================
// SUB-COMPONENTE PARA LA TABLA DE RESULTADOS
// ===================================================================
const ResultadosTable: React.FC<ResultadosTableProps> = ({ resultados, isMobile }) => {
    // Agrupa los resultados por el número de corrida
    const agrupadoPorCorrida = resultados.reduce((acc, resultado) => {
        const corridaKey = resultado.corrida;
        if (!acc[corridaKey]) {
            acc[corridaKey] = [];
        }
        acc[corridaKey].push(resultado);
        return acc;
    }, {} as { [key: number]: PaqueteAgregado[] });

    const getCorridaHeaders = (corrida: number | string) => {
        const puntos = corridasPuntos[Number(corrida)] || [];
        const headers: (string | number)[] = [];

        if (corrida === '94' || corrida === 94) {
            headers.push(
                ...puntos.slice(0, 3).map((punto) => punto || '#'),
                '#',
                ...puntos.slice(4).map((punto) => punto || '#')
            );
        } else {
            headers.push(...puntos.map((punto) => punto || '#'));
            while (headers.length < 7) {
                headers.push('#');
            }
        }
        return headers;
    };

    // VISTA PARA MÓVILES
    if (isMobile) {
        return (
            <CustomCard padding="p-4" className="w-full">
                {Object.entries(agrupadoPorCorrida).map(([corrida, productos]) => (
                    <div key={corrida} className="mb-4 last:mb-0">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Corrida: {corrida}</h3>
                        {productos.map(producto => (
                            <div key={`${producto.estilo}-${producto.corrida}`} className="border dark:border-gray-700 rounded-lg p-3 mb-2 space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div><strong>Estilo:</strong> {producto.estilo}</div>
                                    <div><strong>Combinación:</strong> {producto.DescCombina}</div>
                                    <div><strong>Suela:</strong> {producto.suela}</div>
                                    <div className="col-span-2"><strong>Desc. Suela:</strong> {producto.DesSuela}</div>
                                    <div className="col-span-2 font-bold"><strong>Pares:</strong> {producto.pares}</div>
                                </div>
                                <div className="mt-2">
                                    <strong>Tallas:</strong>
                                    <div className="grid grid-cols-4 gap-1 mt-1">
                                        {getCorridaHeaders(corrida).map((punto, i) => (
                                            <div key={i} className="border dark:border-gray-600 p-1 text-center rounded">
                                                <div className="font-semibold text-xs">#{punto}</div>
                                                <div>{producto[`Cant${i + 1}` as keyof PaqueteAgregado] || 0}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </CustomCard>
        );
    }

    // VISTA PARA ESCRITORIO
    return (
        <CustomCard padding="p-0" className="w-full">
            {Object.entries(agrupadoPorCorrida).map(([corrida, productos]) => {
                const totalPares = productos.reduce((sum, producto) => sum + (producto.pares || 0), 0);
                const corridaHeaders = getCorridaHeaders(corrida);

                return (
                    <div key={corrida} className="mb-6 last:mb-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Estilo</th>
                                        <th scope="col" className="px-6 py-3">Corrida</th>
                                        <th scope="col" className="px-6 py-3">Combinación</th>
                                        <th scope="col" className="px-6 py-3">Suela</th>
                                        <th scope="col" className="px-6 py-3">Desc. Suela</th>
                                        <th scope="col" className="px-6 py-3">Pares</th>
                                        {corridaHeaders.map((punto, index) => (
                                            <th key={index} scope="col" className="px-4 py-3 text-center">#{punto}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto, index) => (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4">{producto.estilo}</td>
                                            <td className="px-6 py-4">{producto.corrida}</td>
                                            <td className="px-6 py-4">{producto.DescCombina}</td>
                                            <td className="px-6 py-4">{producto.suela}</td>
                                            <td className="px-6 py-4">{producto.DesSuela}</td>
                                            <td className="px-6 py-4 font-bold">{producto.pares}</td>
                                            {corridaHeaders.map((_, i) => (
                                                <td key={i} className="px-4 py-4 text-center">
                                                    {producto[`Cant${i + 1}` as keyof PaqueteAgregado] || 0}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                                        <td colSpan={5} className="px-6 py-3 text-right">Total Pares Corrida:</td>
                                        <td className="px-6 py-3">{totalPares}</td>
                                        <td colSpan={corridaHeaders.length}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
        </CustomCard>
    );
};


// ===================================================================
// COMPONENTE PRINCIPAL DE PAQUETES
// ===================================================================
const Paquetes: React.FC = () => {
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'mobile';

    const [paquete, setPaquete] = useState<string>('');
    const [periodo, setPeriodo] = useState<string>('');
    const [resultados, setResultados] = useState<PaqueteAgregado[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const buscarPaquetes = async () => {
        if (!paquete || !periodo) {
            toast.error('Por favor, complete ambos campos');
            return;
        }

        setLoading(true);
        setResultados([]);
        try {
            const data = await getPaqueteDetalle(Number(periodo), Number(paquete));

            if (data && data.length > 0) {
                setResultados(data);
            } else {
                toast.error('No se encontraron resultados para la búsqueda.');
            }

        } catch (error) {
            toast.error('Ocurrió un error al realizar la consulta.');
        } finally {
            setLoading(false);
        }
    };

    const guardarPaquete = async () => {
        if (!paquete || !periodo || resultados.length === 0) {
            toast.error('No hay datos para guardar.s');
            return;
        }

        // Agrupación de datos para enviar a la API
        const productosAgrupados: { [key: string]: PaqueteDetalle } = {};
        resultados.forEach((producto) => {
            const key = `${producto.suela}-${producto.corrida}`;
            if (!productosAgrupados[key]) {
                productosAgrupados[key] = { suela: producto.suela, corrida: producto.corrida, pares: 0, Cant1: 0, Cant2: 0, Cant3: 0, Cant4: 0, Cant5: 0, Cant6: 0, Cant7: 0 };
            }
            productosAgrupados[key].Cant1! += producto.Cant1 || 0;
            productosAgrupados[key].Cant2! += producto.Cant2 || 0;
            productosAgrupados[key].Cant3! += producto.Cant3 || 0;
            productosAgrupados[key].Cant4! += producto.Cant4 || 0;
            productosAgrupados[key].Cant5! += producto.Cant5 || 0;
            productosAgrupados[key].Cant6! += producto.Cant6 || 0;
            productosAgrupados[key].Cant7! += producto.Cant7 || 0;
            productosAgrupados[key].pares += producto.pares || 0;
        });

        const detalleProductos: PaqueteDetalle[] = Object.values(productosAgrupados);

        Swal.fire({
            title: '¿Estás seguro?',
            text: `Se sobreescribirá la información del paquete ${paquete}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'No, cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await deletePaquete(Number(paquete));

                    const body: PaqueteCreateData = {
                        paquete: Number(paquete),
                        periodo: Number(periodo),
                        detalleProductos,
                    };

                    await createPaquete(body);
                    toast.success('El paquete ha sido guardado exitosamente.');
                    limpiarTabla();

                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || "Ocurrió un error al procesar los datos.";
                    toast.success(errorMessage);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const limpiarTabla = () => {
        setResultados([]);
        setPaquete('');
        setPeriodo('');
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Consulta y Registro de Paquetes</h1>

            <CustomCard>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                        <label htmlFor="paquete" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Paquete</label>
                        <input
                            type="number" id="paquete" placeholder="Ej: 12345" value={paquete}
                            onChange={(e) => setPaquete(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo</label>
                        <input
                            type="number" id="periodo" placeholder="Ej: 2025" value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="flex items-end space-x-2 pt-5">
                        <CustomButton onClick={buscarPaquetes} variant="primary" icon={<Search size={16} />}>
                            {!isMobile && 'Buscar'}
                        </CustomButton>
                        <CustomButton onClick={guardarPaquete} variant="success" icon={<Save size={16} />} disabled={resultados.length === 0}>
                            {!isMobile && 'Guardar'}
                        </CustomButton>
                        <CustomButton onClick={limpiarTabla} variant="secondary" icon={<Eraser size={16} />}>
                            {!isMobile && 'Limpiar'}
                        </CustomButton>
                    </div>
                </div>
            </CustomCard>

            {loading && (
                <div className="flex justify-center py-10">
                    <Commet color="#3b82f6" size="large" text="Procesando..." />
                </div>
            )}

            {!loading && resultados.length > 0 && (
                <ResultadosTable resultados={resultados} isMobile={isMobile} />
            )}
        </div>
    );
};

export default Paquetes;