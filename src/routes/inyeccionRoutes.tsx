import { RouteObject } from 'react-router-dom';
import ModuleHomePage from '../pages/ModuleHomePage';
import Captura from '../pages/inyeccion/Captura';
import ReporteDiario from '../pages/inyeccion/reportes/ReporteDiario';
import ReporteSemana from '../pages/inyeccion/reportes/ReporteSemana';
import ReporteInventario from '../pages/inyeccion/reportes/ReporteInventario';
import VerificacionLotes from '../pages/inyeccion/VerificacionLotes';

export const inyeccionRoutes: RouteObject = {
  path: 'inyeccion',
  children: [
    {
      index: true,
      element: <ModuleHomePage moduleName="Inyeccion" />,
    },
    {
      path: 'captura',
      element: <Captura />,
    },
    {
      path: 'reportes/diario',
      element: <ReporteDiario />,
    },
    {
      path: 'reportes/semanal',
      element: <ReporteSemana />,
    },
    {
      path: 'reportes/inventario-proceso',
      element: <ReporteInventario />,
    },
    {
      path: 'verificar-lotes',
      element: <VerificacionLotes />,
    },
  ],
};