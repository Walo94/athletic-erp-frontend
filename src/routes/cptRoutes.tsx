import { RouteObject } from 'react-router-dom';
import ModuleHomePage from '../pages/ModuleHomePage';
import Colores from '../pages/cpt/catalogos/Colores';
import Corridas from '../pages/cpt/catalogos/Corridas';
import Materiales from '../pages/cpt/catalogos/Materiales';
import CodigosBarras from '../pages/cpt/CodigosBarras';
import Proveedores from '../pages/cpt/catalogos/Proveedores';
import Sublineas from '../pages/cpt/catalogos/Sublineas';
import Marcas from '../pages/cpt/catalogos/Marcas';
import Lineas from '../pages/cpt/catalogos/Lineas';
import Combinaciones from '../pages/cpt/catalogos/Combinaciones';

export const cptRoutes: RouteObject = {
  path: 'cpt',
  children: [
    {
      index: true,
      element: <ModuleHomePage moduleName="CPT" />,
    },
    {
      path: 'catalogos/colores',
      element: <Colores empresa="athletic" />,
    },
    {
      path: 'catalogos/corridas',
      element: <Corridas empresa="athletic" />,
    },
    {
      path: 'catalogos/materiales',
      element: <Materiales empresa="athletic" />,
    },
    {
      path: 'codigos-barras/generacion',
      element: <CodigosBarras />,
    },
    {
      path: 'catalogos/proveedores',
      element: <Proveedores empresa="athletic" />,
    },
    {
      path: 'catalogos/sublineas',
      element: <Sublineas empresa="athletic" />,
    },
    {
      path: 'catalogos/marcas',
      element: <Marcas empresa="athletic" />,
    },
    {
      path: 'catalogos/lineas',
      element: <Lineas empresa="athletic" />,
    },
    {
      path: 'catalogos/combinaciones',
      element: <Combinaciones empresa="athletic" />,
    },
  ],
};