import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, mockReplace } from '../test-utils';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import authService from '@/services/authService';

vi.mock('@/services/authService', () => ({
  default: {
    hasLocalToken: vi.fn(),
  },
  authService: {
    hasLocalToken: vi.fn(),
  },
}));

describe('AuthGuard & GuestGuard Routing Security Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GuestGuard', () => {
    it('renders children when guest is unauthenticated and has no local token', () => {
      vi.mocked(authService.hasLocalToken).mockReturnValue(false);

      renderWithProviders(
        <GuestGuard>
          <div data-testid="guest-content">Login Page Content</div>
        </GuestGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: false, isLoading: false, user: null, token: null },
          },
        }
      );

      expect(screen.getByTestId('guest-content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects to dashboard when guest is already authenticated', () => {
      vi.mocked(authService.hasLocalToken).mockReturnValue(true);

      renderWithProviders(
        <GuestGuard>
          <div data-testid="guest-content">Login Page Content</div>
        </GuestGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: true, isLoading: false, user: { id: '1', role: 'user' }, token: 'mock' },
          },
        }
      );

      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });

    it('shows loading spinner when Redux auth state is loading', () => {
      renderWithProviders(
        <GuestGuard>
          <div data-testid="guest-content">Hidden</div>
        </GuestGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: false, isLoading: true, user: null, token: null },
          },
        }
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/checking active authentication status/i)).toBeInTheDocument();
      expect(screen.queryByTestId('guest-content')).not.toBeInTheDocument();
    });
  });

  describe('AuthGuard', () => {
    it('renders protected children when user is authenticated', () => {
      vi.mocked(authService.hasLocalToken).mockReturnValue(true);

      renderWithProviders(
        <AuthGuard>
          <div data-testid="protected-content">Dashboard Protected Area</div>
        </AuthGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: true, isLoading: false, user: { id: '1', role: 'USER' }, token: 'mock' },
          },
        }
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('redirects unauthenticated users to login page preserving redirect parameter', () => {
      vi.mocked(authService.hasLocalToken).mockReturnValue(false);

      renderWithProviders(
        <AuthGuard>
          <div data-testid="protected-content">Secret</div>
        </AuthGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: false, isLoading: false, user: null, token: null },
          },
        }
      );

      expect(mockReplace).toHaveBeenCalledWith('/login?redirect=%2Ftest-path');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects user without required ADMIN role to dashboard (RBAC protection)', () => {
      vi.mocked(authService.hasLocalToken).mockReturnValue(true);

      renderWithProviders(
        <AuthGuard requiredRole="ADMIN">
          <div data-testid="admin-panel">Admin Only</div>
        </AuthGuard>,
        {
          preloadedState: {
            auth: { isAuthenticated: true, isLoading: false, user: { id: '1', role: 'USER' }, token: 'mock' },
          },
        }
      );

      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
      expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument();
    });
  });
});
