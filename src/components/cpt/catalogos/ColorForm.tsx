import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Color, ColorFormData } from '../../../types/cpt/catalogos/Color';

interface ColorFormProps {
  color: Color | null;
  onSave: (colorData: ColorFormData, id: number | null) => void;
  onClose: () => void;
}

const ColorForm: React.FC<ColorFormProps> = ({ color, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    color: 0,
    descripcion: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (color) {
      setFormData({
        color: color.color,
        descripcion: color.descripcion
      });
    } else {
      setFormData({
        color: 0,
        descripcion: ''
      });
    }
  }, [color]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.color || formData.color <= 0) {
      newErrors.color = 'El Color debe ser un número positivo';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'El campo Descripción es requerido';
    } else if (formData.descripcion.trim().length < 2) {
      newErrors.descripcion = 'La Descripción debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData, color ? color.color : null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Para el campo de color, siempre guardamos como número
    const valueToSet = name === 'color' ? parseInt(value, 10) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: valueToSet
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {color ? 'Editar Color' : 'Registrar Color'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Campo Color */}
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="color"
                name="color"
                value={formData.color === 0 ? '' : formData.color}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.color
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  // Añade clases para el estilo cuando está deshabilitado
                  !!color ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
               
                disabled={!!color}
              />
              {errors.color && (
                <p className="mt-1 text-sm text-red-500">{errors.color}</p>
              )}
            </div>

            {/* Campo Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
               className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.puntoInicial
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`}
               
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-500">{errors.descripcion}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white dark:text-gray-300 bg-gray-400 dark:bg-gray-700 rounded-lg hover:opacity-90 dark:hover:opacity-90 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#42b0ff] hover:opacity-90 transition-opacity duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{color ? 'Actualizar' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorForm;