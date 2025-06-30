import React from 'react';

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'p-0' | 'p-2' | 'p-4' | 'p-6';
}

export const CustomCard: React.FC<CustomCardProps> = ({ children, className = '', padding = 'p-6' }) => {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700";
  
  return (
    <div className={`${baseClasses} ${padding} ${className}`}>
      {children}
    </div>
  );
};