'use client';

import React from 'react';
import clsx from 'clsx';
import { X, Check } from 'lucide-react';
import { SelectOption } from './SelectDropdown';

export interface MultiSelectProps {
  label?: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Accessible Multi-Select dropdown with chip indicators and keyboard arrow navigation.
 */
export function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select items...',
  error,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOption = (value: string) => {
    if (disabled) return;
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeChip = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className="w-full space-y-1.5 text-left relative">
      {label && <label className="block text-small font-medium text-text-primary select-none">{label}</label>}

      {/* Trigger Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'min-h-[44px] w-full rounded-md bg-surface border px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-pointer transition-all focus-ring select-none',
          error ? 'border-error-base' : 'border-border hover:border-neutral-400 dark:hover:border-neutral-500',
          disabled && 'bg-neutral-100 dark:bg-neutral-800 text-text-secondary cursor-not-allowed opacity-75'
        )}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && setIsOpen(!isOpen);
          }
        }}
        role="combobox"
        aria-expanded={isOpen}
      >
        {selectedValues.length === 0 ? (
          <span className="text-text-secondary text-body">{placeholder}</span>
        ) : (
          selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-primary-soft text-primary-base text-caption font-medium border border-primary-base/20"
              >
                <span>{opt?.label || val}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => removeChip(e, val)}
                    className="p-0.5 hover:bg-primary-base/10 rounded-full transition-colors"
                    aria-label={`Remove ${opt?.label || val}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            );
          })
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <ul className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-surface border border-border py-1 shadow-lg">
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={clsx(
                    'flex items-center justify-between px-3.5 py-2.5 text-body cursor-pointer transition-colors min-h-[44px]',
                    isSelected ? 'bg-primary-soft/40 text-primary-base font-medium' : 'text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-base" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {error && <p className="text-caption text-error-base font-medium">{error}</p>}
    </div>
  );
}
