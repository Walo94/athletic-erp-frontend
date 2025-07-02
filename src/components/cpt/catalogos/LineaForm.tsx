import React, { useState, useEffect, useMemo } from 'react';
import { X, Save } from 'lucide-react';
import { Linea, LineaFormData } from '../../../types/cpt/catalogos/Linea';
import { Marca } from '../../../types/cpt/catalogos/Marca';
import { Sublinea } from '../../../types/cpt/catalogos/Sublinea';
import { CustomSelectWithOptions } from '../../ui/CustomSelectWithOptions';
import { CustomButton } from '../../ui/CustomButton';

interface LineaFormProps {
  linea: Linea | null;
  marcas: Marca[];
  sublineas: Sublinea[];
  onSave: (lineaData: LineaFormData, id: number | null) => void;
  onClose: () => void;
}

const LineaForm: React.FC<LineaFormProps> = ({ linea, marcas, sublineas, onSave, onClose }) => {
  const [formData, setFormData] = useState<LineaFormData>({
    linea: 0,
    descripcion: '',
    marca: 0,
    sublinea: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (linea) {
      setFormData({
        linea: linea.linea,
        descripcion: linea.descripcion,
        marca: linea.marca,
        sublinea: linea.sublinea,
      });
    } else {
      setFormData({ linea: 0, descripcion: '', marca: 0, sublinea: 0 });
    }
  }, [linea]);
  
  const marcaOptions = useMemo(() => 
    marcas.map(m => ({ value: m.marca, label: m.descripcion })), [marcas]);
    
  const sublineaOptions = useMemo(() => 
    sublineas.map(s => ({ value: s.sublinea, label: s.descripcion })), [sublineas]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.linea || formData.linea <= 0) newErrors.linea = 'La Línea debe ser un número positivo';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'El campo Descripción es requerido';
    if (!formData.marca) newErrors.marca = 'Debe seleccionar una Marca';
    if (!formData.sublinea) newErrors.sublinea = 'Debe seleccionar una Sublínea';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, linea ? linea.linea : null);
    }
  };

  // Generic handler for all form fields
  const handleFieldChange = (name: keyof LineaFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {linea ? 'Editar Línea' : 'Registrar Línea'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="linea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Línea <span className="text-red-500">*</span></label>
              <input type="number" id="linea" name="linea" value={formData.linea === 0 ? '' : formData.linea} onChange={(e) => handleFieldChange('linea', parseInt(e.target.value) || 0)} min="1" disabled={!!linea} 
                className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.linea
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  // Añade clases para el estilo cuando está deshabilitado
                  !!linea ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
              />
              {errors.linea && <p className="mt-1 text-sm text-red-500">{errors.linea}</p>}
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción <span className="text-red-500">*</span></label>
              <input type="text" id="descripcion" name="descripcion" value={formData.descripcion} onChange={(e) => handleFieldChange('descripcion', e.target.value)} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.descripcion
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
              {errors.descripcion && <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>}
            </div>
            
            <CustomSelectWithOptions
              label="Marca"
              name="marca"
              value={formData.marca}
              options={marcaOptions}
              onChange={(value) => handleFieldChange('marca', value)}
              error={errors.marca}
              isRequired={true}
              placeholder="Seleccione una marca"
            />

            <CustomSelectWithOptions
              label="Sublínea"
              name="sublinea"
              value={formData.sublinea}
              options={sublineaOptions}
              onChange={(value) => handleFieldChange('sublinea', value)}
              error={errors.sublinea}
              isRequired={true}
              placeholder="Seleccione una sublínea"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <CustomButton type="button" onClick={onClose} variant="secondary">Cancelar</CustomButton>
            <CustomButton type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              {linea ? 'Actualizar' : 'Guardar'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LineaForm;