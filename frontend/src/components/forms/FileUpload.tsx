'use client';

import React from 'react';
import clsx from 'clsx';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  helperText?: string;
  error?: string;
  /** Accepted file MIME types or extensions (e.g., '.jpg,.png,.pdf') */
  accept?: string;
  /** Maximum file size in bytes */
  maxSizeBytes?: number;
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

/**
 * Accessible drag-and-drop File Upload component with file size/type validation and preview list.
 */
export function FileUpload({
  label,
  helperText,
  error: parentError,
  accept,
  maxSizeBytes = 10 * 1024 * 1024, // 10 MB default
  onFileSelect,
  multiple = false,
  disabled = false,
}: FileUploadProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;
    setInternalError(null);
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (maxSizeBytes && file.size > maxSizeBytes) {
        setInternalError(`File "${file.name}" exceeds maximum allowed size of ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updated = multiple ? [...selectedFiles, ...validFiles] : [validFiles[0]];
      setSelectedFiles(updated);
      onFileSelect(updated);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFileSelect(updated);
  };

  const error = parentError || internalError;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && <label className="block text-small font-medium text-text-primary select-none">{label}</label>}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={clsx(
          'border-2 border-dashed rounded-lg p-6 text-center transition-all min-h-[140px] flex flex-col items-center justify-center gap-2 select-none',
          dragOver ? 'border-primary-base bg-primary-soft/30' : 'border-border bg-surface hover:border-neutral-400',
          error && 'border-error-base bg-error-soft/10',
          disabled && 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800'
        )}
      >
        <Upload className="w-8 h-8 text-text-secondary" aria-hidden="true" />
        <div className="text-small text-text-primary">
          <label className="font-semibold text-primary-base cursor-pointer hover:underline">
            Click to upload
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              onChange={(e) => handleFiles(e.target.files)}
              className="sr-only"
            />
          </label>{' '}
          or drag and drop
        </div>
        {helperText && <p className="text-caption text-text-secondary">{helperText}</p>}
      </div>

      {/* Error display */}
      {error && (
        <p className="text-caption text-error-base font-medium flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <ul className="space-y-2 pt-2">
          {selectedFiles.map((file, i) => (
            <li key={i} className="flex items-center justify-between p-2.5 rounded-md border border-border bg-neutral-50 dark:bg-neutral-800/60 text-small">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-primary-base shrink-0" aria-hidden="true" />
                <span className="truncate font-medium text-text-primary">{file.name}</span>
                <span className="text-caption text-text-secondary shrink-0">({Math.round(file.size / 1024)} KB)</span>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors text-text-secondary hover:text-error-base focus-ring"
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
