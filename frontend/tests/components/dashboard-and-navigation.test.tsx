import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test-utils';
import { Navbar, NavItem } from '@/components/navigation/Navbar';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Home, Camera, Settings } from 'lucide-react';

describe('Navigation & Dashboard Layout Test Suite', () => {
  const mockNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <Home />, isActive: true },
    { id: 'detect', label: 'Live Detection', href: '/detect', icon: <Camera /> },
    { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings /> },
  ];

  describe('Navbar Component', () => {
    it('renders brand logo and navigation items cleanly', () => {
      renderWithProviders(<Navbar items={mockNavItems} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('SignBridge AI')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Live Detection')).toBeInTheDocument();
    });

    it('triggers onNavigate when a navigation link is clicked', () => {
      const handleNavigate = vi.fn();
      renderWithProviders(<Navbar items={mockNavItems} onNavigate={handleNavigate} />);
      
      const detectLink = screen.getByText('Live Detection');
      fireEvent.click(detectLink);
      expect(handleNavigate).toHaveBeenCalledWith(mockNavItems[1]);
    });

    it('shows mobile menu toggle button and triggers onToggleMobileMenu', () => {
      const handleToggle = vi.fn();
      renderWithProviders(<Navbar items={mockNavItems} onToggleMobileMenu={handleToggle} isMobileMenuOpen={false} />);
      
      const toggleBtn = screen.getByLabelText(/open navigation menu/i);
      expect(toggleBtn).toBeInTheDocument();
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sidebar Component', () => {
    it('renders sidebar navigation items with proper roles', () => {
      renderWithProviders(<Sidebar items={mockNavItems} />);
      
      const aside = screen.getByRole('navigation', { name: /sidebar navigation/i });
      expect(aside).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('handles collapse toggle correctly and updates aria attributes', () => {
      const handleToggleCollapse = vi.fn();
      const { rerender } = renderWithProviders(
        <Sidebar items={mockNavItems} isCollapsed={false} onToggleCollapse={handleToggleCollapse} />
      );
      
      const collapseBtn = screen.getByLabelText('Collapse sidebar');
      expect(collapseBtn).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.click(collapseBtn);
      expect(handleToggleCollapse).toHaveBeenCalledTimes(1);

      // Re-render collapsed state
      rerender(<Sidebar items={mockNavItems} isCollapsed={true} onToggleCollapse={handleToggleCollapse} />);
      expect(screen.getByLabelText('Expand sidebar')).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders footerSlot when provided', () => {
      renderWithProviders(
        <Sidebar
          items={mockNavItems}
          footerSlot={<div data-testid="sidebar-footer">System Status: Online</div>}
        />
      );
      expect(screen.getByTestId('sidebar-footer')).toHaveTextContent('System Status: Online');
    });
  });
});
