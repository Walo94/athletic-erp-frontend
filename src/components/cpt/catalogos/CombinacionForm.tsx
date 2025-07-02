import React, { useState, useEffect, useMemo } from 'react';
import { X, Save } from 'lucide-react';
import { Combinacion, CombinacionFormData } from '../../../types/cpt/catalogos/Combinacion';
import { Material } from '../../../types/cpt/catalogos/Material';
import { Color } from '../../../types/cpt/catalogos/Color';
import { CustomSelectWithOptions } from '../../ui/CustomSelectWithOptions';
import { CustomButton } from '../../ui/CustomButton';

interface Props {
  combinacion: Combinacion | null;
  materiales: Material[];
  colores: Color[];
  onSave: (data: CombinacionFormData, id: number | null) => void;
  onClose: () => void;
}

const CombinacionForm: React.FC<Props> = ({ combinacion, materiales, colores, onSave, onClose }) => {
  const initialFormData: CombinacionFormData = {
    combinacion: 0,
    material1: 0, color1: 0,
    material2: null, color2: null,
    material3: null, color3: null,
    material4: null, color4: null,
    material5: null, color5: null,
    material6: null, color6: null,
  };

  const [formData, setFormData] = useState<CombinacionFormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(combinacion ? { ...combinacion } : initialFormData);
  }, [combinacion]);

  const materialOptions = useMemo(() => materiales.map(m => ({ value: m.material, label: `${m.material} - ${m.descripcion}` })), [materiales]);
  const colorOptions = useMemo(() => colores.map(c => ({ value: c.color, label: `${c.color} - ${c.descripcion}` })), [colores]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.combinacion) newErrors.combinacion = 'El campo Combinación es requerido';
    if (!formData.material1) newErrors.material1 = 'El Material 1 es requerido';
    if (!formData.color1) newErrors.color1 = 'El Color 1 es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, combinacion ? combinacion.combinacion : null);
    }
  };

  const handleFieldChange = (name: keyof CombinacionFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [name]: value === 0 ? null : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{combinacion ? 'Editar Combinación' : 'Registrar Combinación'}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* --- Columna 1 --- */}
            <div className="flex flex-col gap-4">
              <div>
                <label>Combinación <span className="text-red-500">*</span></label>
                <input type="number" value={formData.combinacion || ''} onChange={(e) => handleFieldChange('combinacion', parseInt(e.target.value) || 0)} disabled={!!combinacion} 
                className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.combinacion
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  !!combinacion ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
                />
                {errors.combinacion && <p className="text-red-500 text-sm">{errors.combinacion}</p>}
              </div>
              <CustomSelectWithOptions label="Material 1" name="material1" value={formData.material1 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material1', v)} isRequired placeholder="Seleccione Material 1" error={errors.material1} />
              <CustomSelectWithOptions label="Color 1" name="color1" value={formData.color1 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color1', v)} isRequired placeholder="Seleccione Color 1" error={errors.color1} />
              <CustomSelectWithOptions label="Material 2" name="material2" value={formData.material2 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material2', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Color 2" name="color2" value={formData.color2 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color2', v)} placeholder="N/A" />
            </div>

            {/* --- Columna 2 --- */}
            <div className="flex flex-col gap-4">
              <CustomSelectWithOptions label="Material 3" name="material3" value={formData.material3 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material3', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Color 3" name="color3" value={formData.color3 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color3', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Material 4" name="material4" value={formData.material4 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material4', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Color 4" name="color4" value={formData.color4 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color4', v)} placeholder="N/A" />
            </div>
            
            {/* --- Columna 3 --- */}
            <div className="flex flex-col gap-4">
              <CustomSelectWithOptions label="Material 5" name="material5" value={formData.material5 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material5', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Color 5" name="color5" value={formData.color5 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color5', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Material 6" name="material6" value={formData.material6 || 0} options={materialOptions} onChange={(v) => handleFieldChange('material6', v)} placeholder="N/A" />
              <CustomSelectWithOptions label="Color 6" name="color6" value={formData.color6 || 0} options={colorOptions} onChange={(v) => handleFieldChange('color6', v)} placeholder="N/A" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
            <CustomButton type="button" onClick={onClose} variant="secondary">Cancelar</CustomButton>
            <CustomButton type="submit" variant="primary" icon={<Save />}>{combinacion ? 'Actualizar' : 'Guardar'}</CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CombinacionForm;