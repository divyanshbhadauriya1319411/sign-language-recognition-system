import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

describe('UI Components & Accessibility Test Suite', () => {
  describe('Button Component', () => {
    it('renders button text correctly and handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveClass('min-h-[44px]'); // Accessibility touch target check
      
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button and shows spinner when isLoading is true', () => {
      const handleClick = vi.fn();
      render(<Button isLoading onClick={handleClick}>Submit</Button>);
      
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies danger styling when variant is danger', () => {
      render(<Button variant="danger">Delete</Button>);
      const btn = screen.getByRole('button', { name: /delete/i });
      expect(btn).toHaveClass('bg-error-base');
    });
  });

  describe('Badge Component', () => {
    it('renders badge content with semantic variant classes', () => {
      render(<Badge variant="success" size="md">Active</Badge>);
      const badge = screen.getByText('Active');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-success-soft');
      expect(badge).toHaveClass('rounded-pill');
    });
  });

  describe('Card Component', () => {
    it('renders children with standard or interactive styles', () => {
      render(
        <Card variant="interactive" glow data-testid="test-card">
          <p>Card Content</p>
        </Card>
      );
      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Input Component', () => {
    it('renders label and binds accessible htmlFor/id relationships', () => {
      render(<Input label="Email Address" placeholder="enter email" />);
      
      const input = screen.getByLabelText('Email Address');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'enter email');
    });

    it('displays error message and sets aria-invalid attribute', () => {
      render(<Input label="Username" error="Username is required" />);
      
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveClass('border-error-base');
    });
  });

  describe('Modal Component', () => {
    it('renders modal cleanly when isOpen is true and supports Escape close', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Security Alert" description="Please confirm your action">
          <p>Modal body content</p>
        </Modal>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Security Alert')).toBeInTheDocument();
      expect(screen.getByText('Modal body content')).toBeInTheDocument();
      
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not render modal when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
          <p>Hidden body</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
