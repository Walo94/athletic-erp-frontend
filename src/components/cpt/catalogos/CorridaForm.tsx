import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Corrida, CorridaFormData } from '../../../types/cpt/catalogos/Corrida';

interface CorridaFormProps {
  corrida: Corrida | null;
  onSave: (corridaData: CorridaFormData) => void;
  onClose: () => void;
}

const CorridaForm: React.FC<CorridaFormProps> = ({ corrida, onSave, onClose }) => {
  const [formData, setFormData] = useState<CorridaFormData>({
    corrida: 0,
    puntoInicial: 0,
    puntoFinal: 0,
    descripcion: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (corrida) {
      setFormData(corrida);
    } else {
      setFormData({ corrida: 0, puntoInicial: 0, puntoFinal: 0, descripcion: '' });
    }
  }, [corrida]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.corrida || formData.corrida <= 0) newErrors.corrida = 'El # de Corrida debe ser positivo.';
    if (!formData.puntoInicial || formData.puntoInicial <= 0) newErrors.puntoInicial = 'El Punto Inicial debe ser positivo.';
    if (!formData.puntoFinal || formData.puntoFinal <= 0) newErrors.puntoFinal = 'El Punto Final debe ser positivo.';
    if (formData.puntoFinal < formData.puntoInicial) newErrors.puntoFinal = 'El Punto Final no puede ser menor al Inicial.';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La Descripción es requerida.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valueToSet = (name === 'corrida' || name === 'puntoInicial' || name === 'puntoFinal') 
      ? parseInt(value, 10) || 0 
      : value;
    
    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {corrida ? 'Editar Corrida' : 'Registrar Corrida'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="corrida" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corrida <span className="text-red-500">*</span></label>
              <input type="number" name="corrida" value={formData.corrida === 0 ? '' : formData.corrida} 
              onChange={handleInputChange} min="1" 
              disabled={!!corrida}
              className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.color
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  // Añade clases para el estilo cuando está deshabilitado
                  !!corrida ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
              />
              {errors.corrida && <p className="mt-1 text-sm text-red-500">{errors.corrida}</p>}
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción <span className="text-red-500">*</span></label>
              <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} 
               className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.descripcion
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
            </div>
            <div>
              <label htmlFor="puntoInicial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Punto Inicial <span className="text-red-500">*</span></label>
              <input type="number" name="puntoInicial" value={formData.puntoInicial === 0 ? '' : formData.puntoInicial} onChange={handleInputChange} min="0" step="0.5" 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.puntoInicial
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              {errors.puntoInicial && <p className="mt-1 text-sm text-red-500">{errors.puntoInicial}</p>}
            </div>
            <div>
              <label htmlFor="puntoFinal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Punto Final <span className="text-red-500">*</span></label>
              <input type="number" name="puntoFinal" value={formData.puntoFinal === 0 ? '' : formData.puntoFinal} onChange={handleInputChange} min="0" step="0.5" 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.puntoInicial
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              {errors.puntoFinal && <p className="mt-1 text-sm text-red-500">{errors.puntoFinal}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white dark:text-gray-300 bg-gray-400 dark:bg-gray-700 rounded-lg hover:opacity-90 dark:hover:opacity-90">Cancelar</button>
            <button type="submit" className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#42b0ff] hover:opacity-90"><Save className="w-4 h-4" /><span>{corrida ? 'Actualizar' : 'Guardar'}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorridaForm;