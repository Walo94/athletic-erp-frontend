import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Proveedor, ProveedorFormData } from '../../../types/cpt/catalogos/Proveedor';

interface ProveedorFormProps {
  proveedor: Proveedor | null;
  onSave: (proveedorData: ProveedorFormData) => void;
  onClose: () => void;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ proveedor, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProveedorFormData>({
    proveedor: 0,
    nombre: '',
    rfc: '',
    direccion: '',
    ciudad: '',
    cp: '',
    telefonos: '',
    fax: '',
    correoE: '',
    contacto: '',
    estatus: 'A'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (proveedor) {
      setFormData(proveedor);
    } else {
      setFormData({
        proveedor: 0, nombre: '', rfc: '', direccion: '', ciudad: '', cp: '',
        telefonos: '', fax: '', correoE: '', contacto: '', estatus: 'A'
      });
    }
  }, [proveedor]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.proveedor || formData.proveedor <= 0) newErrors.proveedor = 'El # de Proveedor es requerido.';
    if (!formData.nombre.trim()) newErrors.nombre = 'El Nombre es requerido.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valueToSet = name === 'proveedor' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: valueToSet }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">{proveedor ? 'Editar Proveedor' : 'Registrar Proveedor'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campos Principales */}
            <div>
              <label htmlFor="proveedor" className="block text-sm font-medium dark:text-gray-300 mb-2">Proveedor <span className="text-red-500">*</span></label>
              <input type="number" name="proveedor" value={formData.proveedor === 0 ? '' : formData.proveedor} onChange={handleInputChange} 
              className={`w-full px-3 p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.proveedor
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                  } ${
                  !!proveedor ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                  }`}
              />
              {errors.proveedor && <p className="text-sm text-red-500 mt-1">{errors.proveedor}</p>}
            </div>
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium dark:text-gray-300 mb-2">Nombre <span className="text-red-500">*</span></label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} maxLength={50} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.nombre
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
              {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label htmlFor="rfc" className="block text-sm font-medium dark:text-gray-300 mb-2">RFC</label>
              <input type="text" name="rfc" value={formData.rfc} onChange={handleInputChange} maxLength={15} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.rfc
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
            </div>
            <div>
              <label htmlFor="contacto" className="block text-sm font-medium dark:text-gray-300 mb-2">Contacto</label>
              <input type="text" name="contacto" value={formData.contacto} onChange={handleInputChange} maxLength={50} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.contacto
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
            </div>
            {/* Dirección */}
            <div className="md:col-span-2">
              <label htmlFor="direccion" className="block text-sm font-medium dark:text-gray-300 mb-2">Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} maxLength={50} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.direccion
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
            </div>
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium dark:text-gray-300 mb-2">Ciudad</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} maxLength={50} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.ciudad
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
            </div>
            <div>
              <label htmlFor="cp" className="block text-sm font-medium dark:text-gray-300 mb-2">Código Postal</label>
              <input type="text" name="cp" value={formData.cp} onChange={handleInputChange} maxLength={5} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.cp
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
            </div>
            {/* Contacto */}
            <div>
              <label htmlFor="telefonos" className="block text-sm font-medium dark:text-gray-300 mb-2">Teléfonos</label>
              <input type="text" name="telefonos" value={formData.telefonos} onChange={handleInputChange} maxLength={40} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.telefonos
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
            </div>
            <div>
              <label htmlFor="fax" className="block text-sm font-medium dark:text-gray-300 mb-2">Fax</label>
              <input type="text" name="fax" value={formData.fax} onChange={handleInputChange} maxLength={15} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.fax
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="correoE" className="block text-sm font-medium dark:text-gray-300 mb-2">Correo Electrónico</label>
              <input type="email" name="correoE" value={formData.correoE} onChange={handleInputChange} maxLength={30} 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.correoE
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
                  }`} 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white dark:text-gray-300 bg-gray-400 dark:bg-gray-700 rounded-lg hover:opacity-90 dark:hover:opacity-90 transition-colors duration-200">Cancelar</button>
            <button type="submit" className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#42b0ff] hover:opacity-90"><Save className="w-4 h-4" /><span>{proveedor ? 'Actualizar' : 'Guardar'}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorForm;