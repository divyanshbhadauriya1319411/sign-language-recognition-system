'use client';

import React from 'react';
import { SelectDropdown, SelectOption } from '../forms/SelectDropdown';

export interface SortDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * Accessible Sort Dropdown wrapping SelectDropdown for table / grid sorting controls.
 */
export function SortDropdown({
  options,
  value,
  onChange,
  label = 'Sort by:',
  className,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-small font-medium text-text-secondary select-none shrink-0">{label}</span>}
      <SelectDropdown
        options={options}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        aria-label="Sort records"
      />
    </div>
  );
}
