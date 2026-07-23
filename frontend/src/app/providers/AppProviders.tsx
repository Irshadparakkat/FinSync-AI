import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntApp, ConfigProvider } from 'antd';
import { env } from '@/config/env';
import { queryClient } from '@/lib/query-client';
import { theme } from '@/theme';

/**
 * Composition of all global providers, outermost first.
 * New cross-cutting providers (auth context, feature flags, i18n)
 * are added here - main.tsx never changes.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          {children}
          {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
