'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { setTheme, toggleHighContrast } from '@/store/slices/preferencesSlice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Sun,
  Moon,
  Eye,
  LogOut,
  LayoutDashboard,
  Shield,
  History,
  Camera,
  Menu,
  X,
  BookOpen,
  HelpCircle,
  Mail,
  Info,
  DollarSign,
  Layers,
} from 'lucide-react';

/**
 * Upgraded Global Navbar supporting transparent-on-hero to sticky-solid scroll transitions,
 * full public marketing links, accessibility toggles, and responsive mobile drawer.
 */
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, high_contrast } = useAppSelector((state) => state.preferences);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for transparent hero transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const publicLinks = [
    { label: 'Features', href: '/features', icon: Layers },
    { label: 'Pricing', href: '/pricing', icon: DollarSign },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  const isLandingPage = pathname === '/';
  const headerBgClass =
    isLandingPage && !isScrolled
      ? 'bg-transparent border-transparent py-2'
      : 'bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl shadow-lg py-0';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${headerBgClass}`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 focus-ring rounded-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent select-none">
            SignBridge <Badge variant="purple" className="ml-1 text-[10px] uppercase tracking-wider">AI ISL</Badge>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5" role="navigation" aria-label="Main navigation">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] inline-flex items-center gap-1.5 focus-ring ${
                  isActive
                    ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-slate-800 mx-1.5" aria-hidden="true" />

          <Link
            href="/studio"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] inline-flex items-center gap-1.5 focus-ring ${
              pathname?.startsWith('/studio')
                ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Live Studio</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] inline-flex items-center gap-1.5 focus-ring ${
                  pathname?.startsWith('/dashboard')
                    ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/history"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] inline-flex items-center gap-1.5 focus-ring ${
                  pathname?.startsWith('/history')
                    ? 'text-indigo-400 font-semibold bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] inline-flex items-center gap-1.5 focus-ring ${
                    pathname?.startsWith('/admin')
                      ? 'text-purple-400 font-semibold bg-purple-500/10'
                      : 'text-slate-300 hover:text-purple-300 hover:bg-slate-900/60'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Accessibility Controls & Auth CTA */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => dispatch(toggleHighContrast())}
            title="Toggle High Contrast Mode (WCAG AA)"
            className={`p-2 min-w-[44px] min-h-[44px] rounded-xl border transition-colors inline-flex items-center justify-center focus-ring ${
              high_contrast
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            aria-label="Toggle high contrast mode"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
            title="Toggle Dark/Light Theme"
            className="p-2 min-w-[44px] min-h-[44px] rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors inline-flex items-center justify-center focus-ring"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-3 ml-1">
              <span className="text-sm font-medium text-slate-300 truncate max-w-[140px]">
                {user?.profile?.full_name || user?.email.split('@')[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus-ring"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t border-slate-800/80 bg-slate-950 px-4 pt-3 pb-6 space-y-2 overflow-hidden shadow-2xl"
          >
            {publicLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                    pathname === link.href ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Live Translation Studio</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] text-slate-300 hover:bg-slate-900"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] text-slate-300 hover:bg-slate-900"
                >
                  <History className="w-4 h-4 text-slate-400" />
                  <span>History</span>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] text-purple-400 hover:bg-purple-500/10"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Admin Portal</span>
                  </Link>
                )}
                <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-white">{user?.profile?.full_name || 'Authenticated User'}</div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Accessibility & Theme Toggles */}
            <div className="pt-3 mt-1 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Theme & Accessibility:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(toggleHighContrast())}
                  className={`px-2.5 py-1.5 rounded-md border min-h-[36px] transition-colors ${
                    high_contrast ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  WCAG High Contrast
                </button>
                <button
                  onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
                  className="px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 min-h-[36px]"
                >
                  {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
