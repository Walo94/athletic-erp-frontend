import React from 'react';
import { MenuItem } from '../types';
import {  Box, GitBranchPlus,
   Factory, Receipt, TrendingUp, Footprints, Cog } from 'lucide-react';

const iconClass = "w-5 h-5 text-gray-500 dark:text-gray-400";
const iconClass2 = "w-6 h-6 text-gray-500 dark:text-gray-400";

export const menuItems: MenuItem[] = [
  {
    id: 'cpt',
    label: 'CPT',
    icon: React.createElement(Footprints, { className: iconClass }), // Ícono para el módulo principal
    color: 'bg-blue-500',
    children: [
      {
        id: 'catalogos',
        label: 'Catálogos',
        children: [
          { id: 'colores', label: 'Colores', href: '/cpt/catalogos/colores', icon: React.createElement('img', { src: "/colores.png", className: iconClass }) },
          { id: 'corridas', label: 'Corridas', href: '/cpt/catalogos/corridas', icon: React.createElement('img', { src: "/corridas.png", className: iconClass })},
          { id: 'combinaciones', label: 'Combinaciones', href: '/cpt/catalogos/combinaciones', icon: React.createElement('img', { src: "/combinacion.png", className: iconClass }) },
          { id: 'materiales', label: 'Materiales', href: '/cpt/catalogos/materiales', icon: React.createElement('img', { src: "/materiales.png", className: iconClass }) },
          { id: 'lineas', label: 'Líneas', href: '/cpt/catalogos/lineas', icon: React.createElement('img', { src: "/linea.png", className: iconClass }) },
          { id: 'proveedores', label: 'Proveedores', href: '/cpt/catalogos/proveedores', icon: React.createElement('img', { src: "/proveedor.png", className: iconClass })},
          { id: 'productos', label: 'Productos', href: '/cpt/catalogos/productos', icon: React.createElement('img', { src: "/producto.png", className: iconClass })}
        ]
      },
      { id: 'codigosBarras', label: 'Códigos barras', href: '/cpt/codigos-barras/generacion', icon: React.createElement('img', { src: "/captura.png", className: iconClass2 }) },
      { id: 'embarques', label: 'Embarques', href: '/cpt/embarques', icon: React.createElement('img', { src: "/embarque.png", className: iconClass2 }) },
      { id: 'entradas', label: 'Entradas', href: '/cpt/entradas', icon: React.createElement('img', { src: "/entradas.png", className: iconClass2 }) },
      { id: 'salidas', label: 'Salidas', href: '/cpt/salidas', icon: React.createElement('img', { src: "/salidas.png", className: iconClass2 }) },
      { id: 'flujos', label: 'Flujo producción', href: '/cpt/flujos', icon: React.createElement('img', { src: "/flujo.png", className: iconClass2 }) },
      { id: 'grupos', label: 'Grupos', href: '/cpt/grupos', icon: React.createElement('img', { src: "/grupo.png", className: iconClass2 }) },
      { id: 'pedidos', label: 'Pedidos', href: '/cpt/pedidos', icon: React.createElement('img', { src: "/pedido.png", className: iconClass2 }) }
    ]
  },
  
  {
    id: 'cmp',
    label: 'CMP',
    icon: React.createElement(Box, { className: iconClass }),
    color: 'bg-emerald-500',
    children: [
      { id: 'paquetes', label: 'Paquetes', href: '/cmp/paquetes', icon: React.createElement(Box, { className: iconClass }) },
      { id: 'suelas', label: 'Suelas', href: '/cmp/suelas', icon: React.createElement(GitBranchPlus, { className: iconClass }) }
    ]
  },
  {
    id: 'cobranza',
    label: 'Cobranza',
    icon: React.createElement(TrendingUp, { className: iconClass }),
    color: 'bg-amber-500',
    href: '/cobranza' // Ruta para el módulo de Cobranza
  },
  {
    id: 'facturacion',
    label: 'Facturación',
    icon: React.createElement(Receipt, { className: iconClass }),
    color: 'bg-indigo-500',
    href: '/facturacion' // Ruta para el módulo de Facturación
  },
  {
    id: 'inyeccion',
    label: 'Inyección',
    icon: React.createElement(Factory, { className: iconClass }),
    color: 'bg-rose-500',
     children: [
      { id: 'captura', label: 'Captura', href: '/inyeccion/captura', icon: React.createElement('img', { src: "/captura.png", className: iconClass2 }) },
      { id: 'verificarL', label: 'Verificar lotes', href: '/inyeccion/verificar-lotes', icon: React.createElement('img', { src: "/verificar.png", className: iconClass2 }) }
      ,
      {
        id: 'reportesInyeccion',
        label: 'Reportes',
        children: [
          { id: 'diario', label: 'Diario', href: '/inyeccion/reportes/diario', icon: React.createElement('img', { src: "/pdf.png", className: iconClass }) },
          { id: 'semanal', label: 'Semanal', href: '/inyeccion/reportes/semanal', icon: React.createElement('img', { src: "/pdf.png", className: iconClass }) },
          { id: 'mensual', label: 'Mensual', href: '/inyeccion/reportes/mensual', icon: React.createElement('img', { src: "/pdf.png", className: iconClass })},
          { id: 'proceso', label: 'Inventario proceso', href: '/inyeccion/reportes/inventario-proceso', icon: React.createElement('img', { src: "/pdf.png", className: iconClass })}
        ]
      }
    ]
  }
  ,
  {
    id: 'utileria',
    label: 'Utilerías',
    icon: React.createElement(Cog, { className: iconClass }), // O un ícono más específico
    color: 'bg-gray-500',
    href: '/utilerias'
  }
];