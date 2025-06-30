import React from 'react';
import { format } from 'date-fns';

interface CustomDatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  containerClassName?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  containerClassName = ''
}) => {
  const baseClasses = "w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600";
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // El valor del input es YYYY-MM-DD, que Date interpreta como UTC.
    // Para evitar problemas de zona horaria, añadimos T00:00:00
    const date = new Date(`${e.target.value}T00:00:00`);
    onChange(date);
  };

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input
        type="date"
        className={baseClasses}
        value={format(value, 'yyyy-MM-dd')}
        onChange={handleChange}
      />
    </div>
  );
};