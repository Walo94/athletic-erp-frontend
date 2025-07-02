
import { RouteObject } from 'react-router-dom';
import AppLayout from '../pages/AppLayout';
import ModuleLayout from '../pages/ModuleLayout';
import MainContent from '../pages/MainContent';
// Importar las rutas de cada módulo
import { cptRoutes } from './cptRoutes';
import { inyeccionRoutes } from './inyeccionRoutes';
import { cmpRoutes } from './cmpRoutes';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <MainContent />,
      },
      {
        element: <ModuleLayout />,
        // Aquí es donde se anidan las rutas de los módulos
        children: [
          cptRoutes,
          inyeccionRoutes,
          cmpRoutes,
        ],
      },
    ],
  },
];