import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, LogOut, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { User } from '../../types';
import Tooltip from '../utils/Tooltip';
import NotificationDropdown from '../utils/NotificationDropdown';

interface HeaderProps {
  user: User;
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const Header: React.FC<HeaderProps> = ({ user, onMenuToggle }) => {
  const { isDark, toggle } = useTheme();

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nueva entrada de inventario',
      message: 'Se ha registrado una nueva entrada de 50 unidades de Material A',
      time: 'Hace 5 minutos',
      isRead: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Stock bajo',
      message: 'El material B tiene menos de 10 unidades en stock',
      time: 'Hace 15 minutos',
      isRead: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Pedido completado',
      message: 'El pedido #12345 ha sido completado exitosamente',
      time: 'Hace 1 hora',
      isRead: true,
      type: 'success'
    },
    {
      id: '4',
      title: 'Error en sincronización',
      message: 'Error al sincronizar datos con el servidor externo',
      time: 'Hace 2 horas',
      isRead: false,
      type: 'error'
    }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleViewAll = () => {
    console.log('Ver todas las notificaciones');
    // Aquí iría la navegación a la página de notificaciones
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/AF.png"
              alt="Athletic Footwear Logo"
              className="h-10 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Tooltip content="Notificaciones" position="bottom">
            <NotificationDropdown
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onViewAll={handleViewAll}
            />
          </Tooltip>

          <Tooltip content={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"} position="bottom">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </Tooltip>

          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: '#969696' }}
            >
              {user.initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </div>

          <Tooltip content="Cerrar sesión" position="bottom">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Header;