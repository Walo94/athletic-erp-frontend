import React from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import Sidebar from '../components/navegacion/Sidebar';
import { menuItems } from '../data/menuItems';

// Interfaz para definir el tipo de contexto que recibimos
interface OutletContextType {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const ModuleLayout: React.FC = () => {
  const location = useLocation();
  // 1. Recibimos el estado y la función del Outlet del componente padre (AppLayout)
  const { isSidebarOpen, closeSidebar } = useOutletContext<OutletContextType>();

  const currentModuleKey = location.pathname.split('/')[1];
  const currentModule = menuItems.find(item => item.id === currentModuleKey);
  const moduleMenu = currentModule?.children || [];

  return (
    <> {/* Usamos Fragment para no añadir un div innecesario */}
      <Sidebar
        isOpen={isSidebarOpen} // 2. Usamos el estado recibido
        onClose={closeSidebar}  // 3. Usamos la función de cierre recibida
        menu={moduleMenu}
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
};

export default ModuleLayout;