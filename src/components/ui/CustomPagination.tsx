import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomPaginationProps {
  count: number;
  page: number;
  onPageChange: (newPage: number) => void;
  rowsPerPage?: number;
  totalRows?: number;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  onPageChange,
}) => {
  if (count <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Página {page + 1} de {count}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= count - 1}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};