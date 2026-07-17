'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Modal, ModalProps } from '../ui/Modal';
import { Button } from '../buttons/Button';

export interface DialogProps extends Omit<ModalProps, 'children'> {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Dialogs collection providing standardized ConfirmationModal, SuccessDialog, and ErrorDialog.
 */
export function ConfirmationModal({
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  onClose,
  ...props
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose || onCancel || (() => {})} title={title} {...props}>
      <div className="space-y-6 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-warning-soft flex items-center justify-center text-warning-base shrink-0">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-body text-text-secondary leading-relaxed pt-1">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel || onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function SuccessDialog({
  title,
  description,
  confirmText = 'Continue',
  onConfirm,
  isOpen,
  onClose,
  ...props
}: Omit<DialogProps, 'cancelText' | 'onCancel'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose || onConfirm} title={title} {...props}>
      <div className="space-y-6 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center text-success-base">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <p className="text-body text-text-secondary leading-relaxed max-w-sm">{description}</p>
        <Button variant="primary" onClick={onConfirm || onClose} fullWidth>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export function ErrorDialog({
  title,
  description,
  confirmText = 'Dismiss',
  onConfirm,
  isOpen,
  onClose,
  ...props
}: Omit<DialogProps, 'cancelText' | 'onCancel'>) {
  return (
    <Modal isOpen={isOpen} onClose={onClose || onConfirm} title={title} {...props}>
      <div className="space-y-6 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-error-soft flex items-center justify-center text-error-base">
          <XCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <p className="text-body text-text-secondary leading-relaxed max-w-sm">{description}</p>
        <Button variant="danger" onClick={onConfirm || onClose} fullWidth>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
