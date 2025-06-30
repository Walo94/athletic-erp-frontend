import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  color?: string;
  children?: MenuItem[];
  href?: string;
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}

export interface NavigationState {
  activeMenu: string | null;
  expandedMenus: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}