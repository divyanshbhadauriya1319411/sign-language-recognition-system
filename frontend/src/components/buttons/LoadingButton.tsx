'use client';

import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export interface LoadingButtonProps extends ButtonProps {
  /** Text announced or displayed while loading */
  loadingText?: string;
}

/**
 * Dedicated LoadingButton wrapping standard Button with screen-reader status announcements
 * and disabled interaction handling during asynchronous operations.
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading = false, loadingText = 'Loading...', className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        isLoading={isLoading}
        aria-busy={isLoading}
        className={clsx(className)}
        {...props}
      >
        {isLoading ? loadingText : children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
