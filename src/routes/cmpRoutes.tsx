import { RouteObject } from 'react-router-dom';
import ModuleHomePage from '../pages/ModuleHomePage';
import Suelas from '../pages/cmp/Suelas';
import Paquetes from '../pages/cmp/Paquetes';

export const cmpRoutes: RouteObject = {
  path: 'cmp',
  children: [
    {
      index: true,
      element: <ModuleHomePage moduleName="CMP" />,
    },
    {
      path: 'paquetes',
      element: <Paquetes />,
    },
    {
      path: 'suelas',
      element: <Suelas />,
    },
  ],
};