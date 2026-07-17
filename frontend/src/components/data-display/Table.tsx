'use client';

import React from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  className?: string;
  rowKey: (row: T, index: number) => string | number;
}

/**
 * Responsive accessible Table component supporting sortable columns, custom cell renderers,
 * sticky header state, and keyboard navigation.
 */
export function Table<T>({
  data,
  columns,
  sortKey,
  sortDirection,
  onSort,
  isLoading = false,
  emptyMessage = 'No records available to display.',
  stickyHeader = true,
  className,
  rowKey,
}: TableProps<T>) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={clsx('w-full overflow-x-auto rounded-lg border border-border bg-surface shadow-sm', className)}>
      <table className="w-full text-small text-text-primary border-collapse" role="table">
        <thead className={clsx('bg-neutral-50 dark:bg-neutral-800/80 border-b border-divider', stickyHeader && 'sticky top-0 z-10')}>
          <tr role="row">
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  role="columnheader"
                  aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={{ width: col.width }}
                  className={clsx(
                    'px-4 py-3.5 font-semibold text-text-primary tracking-wider uppercase text-caption select-none min-h-[44px]',
                    alignClasses[col.align || 'left'],
                    col.sortable && 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition-colors'
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className={clsx('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-text-secondary">
                        {isSorted ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-primary-base" /> : <ArrowDown className="w-3.5 h-3.5 text-primary-base" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-divider/60">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-secondary">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-secondary italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                role="row"
                className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} role="cell" className={clsx('px-4 py-3.5 min-h-[44px]', alignClasses[col.align || 'left'])}>
                    {col.render ? col.render(row, index) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
