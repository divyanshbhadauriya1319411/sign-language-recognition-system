import React from 'react';
import clsx from 'clsx';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem) => void;
  showHomeIcon?: boolean;
  className?: string;
}

/**
 * Accessible Breadcrumbs hierarchy indicator supporting keyboard navigation.
 */
export function Breadcrumbs({
  items,
  onNavigate,
  showHomeIcon = true,
  className,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center text-small text-text-secondary', className)}>
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.id} className="inline-flex items-center gap-1.5">
              {/* Separator */}
              {index > 0 && <ChevronRight className="w-4 h-4 text-divider shrink-0" aria-hidden="true" />}

              {/* Breadcrumb Item Link / Text */}
              {isLast ? (
                <span className="font-semibold text-text-primary select-none flex items-center gap-1.5" aria-current="page">
                  {isFirst && showHomeIcon && <Home className="w-4 h-4" aria-hidden="true" />}
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate?.(item)}
                  className="inline-flex items-center gap-1.5 hover:text-primary-base transition-colors min-h-[32px] rounded focus-ring"
                >
                  {isFirst && showHomeIcon && <Home className="w-4 h-4" aria-hidden="true" />}
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
