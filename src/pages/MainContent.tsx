import React from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from '../data/menuItems';

const MainContent: React.FC = () => {
  const modules = menuItems;

  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Módulos del Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona un módulo para comenzar a trabajar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              to={module.href || `/${module.id}`}
              key={module.id}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                {/* --- ESTA ES LA SECCIÓN MODIFICADA --- */}
                <div 
                  // Usamos una plantilla de cadena para aplicar el color dinámicamente
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200 ${module.color || 'bg-gray-500'}`}
                >
                  {/* Clonamos el icono para asegurar que las clases se apliquen correctamente */}
                  {module.icon && React.cloneElement(module.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {module.label}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accede al módulo de {module.label}.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;