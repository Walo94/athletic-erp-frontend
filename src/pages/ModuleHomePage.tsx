import React from 'react';
import { Layers } from 'lucide-react';

interface ModuleHomePageProps {
  moduleName: string;
  description?: string;
}

const ModuleHomePage: React.FC<ModuleHomePageProps> = ({
  moduleName,
  description = "Utiliza la barra de navegación lateral para acceder a las diferentes opciones disponibles."
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-md mb-6">
        <Layers className="w-16 h-16 text-blue-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Bienvenido al Módulo {moduleName}
      </h1>
      <p className="max-w-md text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default ModuleHomePage;