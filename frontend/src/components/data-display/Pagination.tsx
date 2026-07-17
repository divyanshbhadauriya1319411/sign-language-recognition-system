'use client';

import React from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Accessible Pagination component guaranteeing 44x44px touch targets and full keyboard operability.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <nav aria-label="Pagination navigation" className={clsx('flex items-center justify-between gap-4 py-3 select-none', className)}>
      <div className="text-caption text-text-secondary">
        Page <strong className="text-text-primary font-semibold">{currentPage}</strong> of <strong className="text-text-primary font-semibold">{totalPages}</strong>
      </div>

      <ul className="flex items-center gap-1">
        {/* First Page */}
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            aria-label="Go to first page"
            className="min-w-[44px] min-h-[44px] p-2 rounded-md inline-flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-ring"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        </li>

        {/* Previous Page */}
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
            className="min-w-[44px] min-h-[44px] p-2 rounded-md inline-flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-ring"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <li key={`ellipsis-${i}`} className="px-2 text-text-secondary min-h-[44px] inline-flex items-center select-none">
              ...
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={clsx(
                  'min-w-[44px] min-h-[44px] px-3.5 rounded-md inline-flex items-center justify-center text-small font-semibold transition-colors focus-ring',
                  p === currentPage
                    ? 'bg-primary-base text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                {p}
              </button>
            </li>
          )
        )}

        {/* Next Page */}
        <li>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
            className="min-w-[44px] min-h-[44px] p-2 rounded-md inline-flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-ring"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </li>

        {/* Last Page */}
        <li>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Go to last page"
            className="min-w-[44px] min-h-[44px] p-2 rounded-md inline-flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-ring"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
