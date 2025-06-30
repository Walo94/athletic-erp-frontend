import React, { forwardRef } from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({
  label,
  icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = "w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-600";
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          // 4. Pasa la ref al elemento input
          ref={ref} 
          className={`${baseClasses} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
});