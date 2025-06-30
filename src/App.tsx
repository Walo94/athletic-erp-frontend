import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './pages/AppLayout';
import MainContent from './pages/MainContent';
import ModuleLayout from './pages/ModuleLayout';
import ModuleHomePage from './pages/ModuleHomePage';
import Colores from './pages/cpt/catalogos/Colores';
import Corridas from './pages/cpt/catalogos/Corridas';
import Materiales from './pages/cpt/catalogos/Materiales';
import Paquetes from './pages/cmp/Paquetes';
import Suelas from './pages/cmp/Suelas';
import Captura from './pages/inyeccion/Captura';
import ReporteDiario from './pages/inyeccion/reportes/ReporteDiario';
import ReporteSemana from './pages/inyeccion/reportes/ReporteSemana';
import VerificacionLotes from './pages/inyeccion/VerificacionLotes';
import CodigosBarras from './pages/cpt/CodigosBarras';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          }}
        />

        <Routes>
          {/* Todas las rutas principales ahora están dentro de AppLayout */}
          <Route path="/" element={<AppLayout />}>
            {/* La página de inicio (Dashboard) */}
            <Route index element={<MainContent />} />

            {/* Rutas de los módulos que usan el layout secundario (con sidebar) */}
            <Route element={<ModuleLayout />}>
              <Route path="cpt" element={<ModuleHomePage moduleName="CPT" />} />
              <Route path="cpt/catalogos/colores" element={<Colores empresa="athletic" />} />
              <Route path="cpt/catalogos/corridas" element={<Corridas empresa="athletic" />} />
              <Route path="cpt/catalogos/materiales" element={<Materiales empresa="athletic" />} />
              <Route path="cpt/codigos-barras/generacion" element={<CodigosBarras />} />
              {/* ...otras rutas de CPT */}

              <Route path="cmp" element={<ModuleHomePage moduleName="CMP" />} />
              <Route path="cmp/paquetes" element={<Paquetes />} />
              <Route path="cmp/suelas" element={<Suelas />} />


              <Route path="inyeccion" element={<ModuleHomePage moduleName="Inyeccion" />} />
              <Route path="inyeccion/captura" element={<Captura />} />
              <Route path="inyeccion/reportes/diario" element={<ReporteDiario />} />
              <Route path="inyeccion/reportes/semanal" element={<ReporteSemana />} />
              <Route path="inyeccion/verificar-lotes" element={<VerificacionLotes />} />
            </Route>

            {/* Puedes añadir más rutas de primer nivel aquí si es necesario */}

          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;