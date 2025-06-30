import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Home } from 'lucide-react';
import { MenuItem as MenuItemType } from '../../types';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItemType[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, menu }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['catalogos']);
  const location = useLocation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const MenuItem: React.FC<{ item: MenuItemType; level: number }> = ({ item, level }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const paddingLeft = `${(level * 16) + 16}px`;

    const baseClasses = "w-full flex items-center justify-between p-3 text-left transition-colors duration-200 rounded-md";
    const isActive = location.pathname === item.href || (item.href && location.pathname.startsWith(item.href));
    const activeClasses = isActive ? 'bg-blue-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700';

    const defaultIcon = <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />;

    if (!hasChildren && item.href) {
      return (
        <Link
          to={item.href}
          onClick={onClose}
          className={`${baseClasses} ${activeClasses}`}
          style={{ paddingLeft, marginLeft: '4px', marginRight: '4px' }}
        >
          <div className="flex items-center space-x-3">
            {item.icon || defaultIcon}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
        </Link>
      );
    }

    return (
      <div>
        <button
          onClick={() => toggleMenu(item.id)}
          className={`${baseClasses} ${activeClasses}`}
          style={{ paddingLeft }}
        >
          <div className="flex items-center space-x-3">
            <img src="/folder2.png" alt="Folder Icon" className="w-6 h-6" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </button>

        {hasChildren && isExpanded && (
          <div className="border-l border-gray-200 dark:border-gray-600 ml-6">
            {item.children?.map((child) => (
              <MenuItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]`}>
        <div className="p-4">
          {/* Enlace para volver al menú principal de módulos */}
          <Link
            to="/"
            onClick={onClose} // Importante para que el menú se cierre en móviles al navegar
            className="flex items-center p-3 rounded-lg text-lg font-semibold text-gray-800 dark:text-white mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Home className="w-6 h-6 mr-3 text-blue-500" />
            <span>Menú Principal</span>
          </Link>

          <hr className="border-gray-200 dark:border-gray-700 mb-4" />
          
          <nav className="space-y-1">
            {menu.map((item) => <MenuItem key={item.id} item={item} level={0} />)}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;