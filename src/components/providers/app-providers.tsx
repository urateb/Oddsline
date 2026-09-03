'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { applyThemeClass, useThemeStore } from '@/stores/theme-store';

interface AppProvidersProps {
  children: React.ReactNode;
}

function ThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      {children}
    </QueryClientProvider>
  );
}
