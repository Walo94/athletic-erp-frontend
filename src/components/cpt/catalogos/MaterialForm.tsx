import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Material, MaterialFormData } from '../../../types/cpt/catalogos/Material';

interface MaterialFormProps {
  material: Material | null;
  onSave: (materialData: MaterialFormData) => void;
  onClose: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onClose }) => {
  const [formData, setFormData] = useState<MaterialFormData>({
    material: 0,
    descripcion: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (material) {
      setFormData(material);
    } else {
      setFormData({ material: 0, descripcion: '' });
    }
  }, [material]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.material || formData.material <= 0) newErrors.material = 'El # de Material debe ser positivo.';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La Descripción es requerida.';
    else if (formData.descripcion.length > 20) newErrors.descripcion = 'La descripción no puede exceder los 20 caracteres.';

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
    const valueToSet = name === 'material' ? parseInt(value, 10) || 0 : value;

    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {material ? 'Editar Material' : 'Registrar Material'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Material <span className="text-red-500">*</span></label>
              <input type="number" 
              name="material" 
              value={formData.material === 0 ? '' : formData.material} onChange={handleInputChange} min="1"
                className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.material
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  // Añade clases para el estilo cuando está deshabilitado
                  !!material ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
                   disabled={!!material}
                />
              {errors.material && <p className="mt-1 text-sm text-red-500">{errors.material}</p>}
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción <span className="text-red-500">*</span></label>
              <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} maxLength={20}
                className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.descripcion
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#42b0ff] hover:opacity-90"><Save className="w-4 h-4" /><span>{material ? 'Actualizar' : 'Guardar'}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;