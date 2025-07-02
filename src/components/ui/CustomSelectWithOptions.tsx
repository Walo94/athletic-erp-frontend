// src/components/ui/CustomSelectWithOptions.tsx

import React from 'react';

// Define the structure for each object in the options array
type SelectOption = {
  value: string | number;
  label: string;
};

interface CustomSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void; // Returns the value directly, not the event
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  disabled?: boolean;
}

export const CustomSelectWithOptions: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  error,
  isRequired,
  disabled = false,
}) => {
  const baseClasses = "w-full border rounded-md shadow-sm p-2 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600";
  const errorClasses = "border-red-500 dark:border-red-500";
  const defaultClasses = "border-gray-300 dark:border-gray-600";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // Find the original option to check its type (string or number)
    const originalOption = options.find(opt => String(opt.value) === selectedValue);
    
    // Return number or string based on original option type
    if (originalOption && typeof originalOption.value === 'number') {
      onChange(Number(selectedValue));
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`${baseClasses} ${error ? errorClasses : defaultClasses}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};