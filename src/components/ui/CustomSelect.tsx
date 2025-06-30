import React from 'react';

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
  containerClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ label, children, containerClassName = '', className = '', ...props }) => {
  const baseClasses = "w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600";

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select className={`${baseClasses} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};