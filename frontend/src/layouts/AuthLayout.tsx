import { App as AntApp, ConfigProvider, theme as antdTheme, Typography } from 'antd';
import { Outlet } from 'react-router';
import { env } from '@/config/env';

/**
 * Dark, centered shell for the public auth pages (modern SaaS look).
 * Scoped ConfigProvider: dark algorithm applies ONLY under this layout -
 * the rest of the app keeps the global theme.
 */
export function AuthLayout() {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: { colorPrimary: '#1668dc', borderRadius: 8 },
      }}
    >
      <AntApp>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background:
              'radial-gradient(ellipse at top, #16233a 0%, #0d1420 55%, #0a0f18 100%)',
          }}
        >
          <Typography.Title level={2} style={{ color: '#e6f0ff', marginBottom: 4 }}>
            {env.appName}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginBottom: 32 }}>
            AI-powered family financial management
          </Typography.Text>
          <Outlet />
        </div>
      </AntApp>
    </ConfigProvider>
  );
}
