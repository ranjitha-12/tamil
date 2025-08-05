'use client';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="p-2 sm:p-4 flex flex-wrap items-center justify-between gap-2 text-gray-500 w-full">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-md bg-slate-200 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 sm:px-3 py-1 rounded ${
              currentPage === page ? 'bg-purple-400 text-white' : 'bg-slate-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-md bg-slate-200 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;