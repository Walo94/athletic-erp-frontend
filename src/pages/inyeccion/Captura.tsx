// src/pages/inyeccion/Captura.tsx
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Barcode, Save, Shuffle, XCircle, ClipboardList } from 'lucide-react';

// Importando servicios y tipos de Inyección
import {
  getInfoLote,
  getInfoPrograma,
  getOrdenDepartamento,
  puedeAvanzar,
  registrarAvance,
} from '../../services/inyeccion/api-inyeccion';
import { InfoLote } from '../../types/inyeccion/Inyeccion';

// Importando componentes personalizados
import { CustomInput } from '../../components/ui/CustomInput';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomDatePicker } from '../../components/ui/CustomDatePicker';
import { CustomButton } from '../../components/ui/CustomButton';
import { ListadoLotes } from '../../components/inyeccion/ListadoLotes'; // Ruta actualizada

// Definiendo tipos locales
type Departamento = { id: number; nombre: string; value: string };

const DEPARTAMENTOS: Departamento[] = [
  { id: 1, nombre: 'RECEPCION', value: 'recepcion' },
  { id: 2, nombre: 'INYECCION', value: 'inyeccion' },
  { id: 3, nombre: 'ADORNO', value: 'adorno' },
];

const Captura: React.FC = () => {
  // Estados del formulario
  const [codigo, setCodigo] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [depto, setDepto] = useState<Departamento | null>(null);

  // Estados para mostrar detalles del lote
  const [ultimoLote, setUltimoLote] = useState<Partial<InfoLote & { [key: string]: any }>>({});

  // Estados de la UI
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [deptoResaltado, setDeptoResaltado] = useState<string | null>(null);
  const codigoInputRef = useRef<HTMLInputElement>(null);

  const limpiarCampos = () => {
    setCodigo('');
    setUltimoLote({});
    setDepto(null);
    setDeptoResaltado(null);
    codigoInputRef.current?.focus();
  };

  const handleRegistrarAvance = async () => {
    if (!codigo) {
      toast.error('Ingrese un código de barras');
      return;
    }
    if (!depto) {
      toast.error('Seleccione un proceso');
      return;
    }

    const loadingToast = toast.loading('Procesando...');
    const loteNum = parseInt(codigo);
    const anioActual = fecha.getFullYear();

    try {
      // 1. Obtener ID del programa
      let programaInfo = await getInfoPrograma(loteNum, anioActual).catch(() => getInfoPrograma(loteNum, anioActual - 1));
      if (!programaInfo || programaInfo.length === 0) {
        throw new Error('No se encontró información del programa para este lote.');
      }
      const progId = programaInfo[0].id_prog;
      const anioUsado = programaInfo[0].years;

      // 2. Obtener orden del depto y verificar si puede avanzar
      const { Orden } = await getOrdenDepartamento(depto.value);

      const puede = await puedeAvanzar(codigo, progId, Orden);

      if (!puede.PuedeAvanzar) {
        throw new Error(puede.mensaje || 'Este lote no puede avanzar o ya fue registrado en este proceso.');
      }

      // 3. Registrar el avance
      const { value, nombre } = depto;

      let maquilaValue = '';

      if (value === 'inyeccion') {
            maquilaValue = 'lninyec';
        } else if (value === 'adorno') {
            maquilaValue = 'lnadn';
        } else if (value === 'recepcion') {
            maquilaValue = 'lnrecp';
        }

      const deptoSiguiente = value === 'recepcion' ? 'INYECCION' : value === 'inyeccion' ? 'ADORNO' : 'PT';

      await registrarAvance({
        programa: progId,
        lote: codigo,
        avance: `fecha_${value}`,
        departamentoActual: value,
        departamentoSiguiente: deptoSiguiente,
        maquila: maquilaValue,
        fechaActual: fecha,
      });

      // 4. Si todo OK, actualizar UI
      toast.success('Avance registrado correctamente', { id: loadingToast });
      setCodigo('');
      codigoInputRef.current?.focus();

      const infoLote = await getInfoLote(loteNum, anioUsado);
      setUltimoLote(infoLote[0] || {});
      setDeptoResaltado(nombre);
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar el avance.', { id: loadingToast });
      // Aún si hay error, intentamos cargar los datos del lote para que el usuario vea su estado actual
      try {
        const infoLote = await getInfoLote(loteNum, anioActual).catch(() => getInfoLote(loteNum, anioActual - 1));
        if (infoLote && infoLote.length > 0) {
          setUltimoLote(infoLote[0]);
          setDeptoResaltado(depto.nombre);
        }
      } catch (fetchError) {
        // No hacer nada si falla la carga de datos tras un error
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRegistrarAvance();
    }
  };

  const handleMostrarListado = () => {
    if (!depto) {
      toast.error('Debe seleccionar un proceso para ver el listado.');
      return;
    }
    setDialogoAbierto(true);
  };

  const getCellClass = (departamento: string) => {
    return deptoResaltado === departamento
      ? 'font-bold text-green-600 dark:text-green-400'
      : '';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white flex items-center gap-2">
        <Shuffle /> Avances de Producción
      </h1>

      {/* Panel de captura */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        <CustomInput
          label="Código de Lote"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyPress={handleKeyPress}
          icon={<Barcode size={18} className="text-gray-400" />}
          ref={codigoInputRef}
          autoFocus
        />
        <CustomSelect
          label="Proceso"
          value={depto?.value || ''}
          onChange={(e) => setDepto(DEPARTAMENTOS.find(d => d.value === e.target.value) || null)}
        >
          <option value="">Seleccione un proceso...</option>
          {DEPARTAMENTOS.map(d => <option key={d.id} value={d.value}>{d.nombre}</option>)}
        </CustomSelect>
        <CustomDatePicker
          label="Fecha"
          value={fecha}
          onChange={setFecha}
        />
        <div className="flex gap-2">
          <CustomButton onClick={handleRegistrarAvance} variant="primary" icon={<Save size={16} />} className="w-full">
            Aceptar
          </CustomButton>
          <CustomButton onClick={handleMostrarListado} variant="secondary" icon={<ClipboardList size={16} />} aria-label="Ver listado" />
          <CustomButton onClick={limpiarCampos} variant="danger" icon={<XCircle size={16} />} aria-label="Limpiar campos" />
        </div>
      </div>

      {/* Tabla de Avances del último lote */}
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm text-gray-600 dark:text-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Recepción</th>
              <th className="px-4 py-3">Inyección</th>
              <th className="px-4 py-3">Adorno</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            <tr>
              <td className={`p-3 border dark:border-gray-700 ${getCellClass('RECEPCION')}`}>{ultimoLote.recepcion || '---'}</td>
              <td className={`p-3 border dark:border-gray-700 ${getCellClass('INYECCION')}`}>{ultimoLote.inyeccion || '---'}</td>
              <td className={`p-3 border dark:border-gray-700 ${getCellClass('ADORNO')}`}>{ultimoLote.adorno || '---'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detalles del último lote */}
      <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-700 dark:text-white">
          {ultimoLote.lote ? `Detalles del Lote: ${ultimoLote.lote}` : 'Detalles (esperando lote)'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CustomInput label="Programa" value={ultimoLote.programa || ''} readOnly disabled />
          <CustomInput label="Pedido" value={ultimoLote.pedido || ''} readOnly disabled />
          <CustomInput label="Estilo" value={ultimoLote.estilo || ''} readOnly disabled />
          <CustomInput label="Corrida" value={ultimoLote.corrida || ''} readOnly disabled />
          <CustomInput label="Pares" value={ultimoLote.pares || ''} readOnly disabled />
          <CustomInput label="Combinación" value={ultimoLote.combinacion || ''} readOnly disabled containerClassName="col-span-2 md:col-span-3" />
        </div>
      </div>

      {/* Diálogo de listado */}
      {dialogoAbierto && (
        <ListadoLotes
          open={dialogoAbierto}
          onClose={() => setDialogoAbierto(false)}
          fecha={fecha}
          departamento={depto?.nombre || ''}
        />
      )}
    </div>
  );
};

export default Captura;
