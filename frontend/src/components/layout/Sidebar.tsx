'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import { LayoutDashboard, History, Camera, Settings, Shield, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { label: 'Studio', href: '/studio', icon: Camera },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'History', href: '/history', icon: History },
    { label: 'Settings', href: '/dashboard', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ label: 'Admin Portal', href: '/admin', icon: Shield });
  }

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-xl p-4 hidden lg:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Navigation</p>
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-white'
                )}
              >
                <Icon className={clsx('w-5 h-5', isActive ? 'text-indigo-400' : 'text-slate-500')} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-900/40 space-y-2.5">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
          <HelpCircle className="w-4 h-4" /> Need Help?
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Explore our WCAG 2.2 AA guidelines and ISL gesture tips in the interactive guide.
        </p>
      </div>
    </aside>
  );
}
