'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, useAppDispatch, useAppSelector } from '@/store';
import { setUser, setLoading } from '@/store/slices/authSlice';
import { setPreferences } from '@/store/slices/preferencesSlice';
import api from '@/services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ThemeAndAuthSync({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, high_contrast } = useAppSelector((state) => state.preferences);

  // Sync theme and high contrast classes to root html tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    if (high_contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [theme, high_contrast]);

  // Check auth session on startup
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        dispatch(setLoading(false));
        return;
      }
      try {
        const res = await api.get('/users/me');
        dispatch(setUser(res.data));
        if (res.data.profile?.accessibility_settings) {
          dispatch(setPreferences(res.data.profile.accessibility_settings));
        }
      } catch (err) {
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    }
    checkAuth();
  }, [token, dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeAndAuthSync>{children}</ThemeAndAuthSync>
      </QueryClientProvider>
    </Provider>
  );
}
