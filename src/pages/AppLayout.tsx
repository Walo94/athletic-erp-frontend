import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/navegacion/Header';
import { User } from '../types';

const AppLayout: React.FC = () => {
  // 1. El estado para controlar el Sidebar ahora vive aquí
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Las funciones para controlar el estado también viven aquí
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Datos del usuario que se pasarán al Header
  const currentUser: User = { id: '1', name: 'Administrator', role: 'Admin', initials: 'AD' };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        user={currentUser}
        onMenuToggle={toggleSidebar} // 3. El Header recibe la función para abrir/cerrar
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* 4. Pasamos el estado y la función de cierre al Outlet para que los hijos (ModuleLayout) los reciban */}
        <Outlet context={{ isSidebarOpen, closeSidebar }} />
      </div>
    </div>
  );
};

export default AppLayout;