import { Button, Flex, Typography } from 'antd';
import { Link, Navigate } from 'react-router';
import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Landing page. Authenticated users go straight to their dashboard;
 * visitors get the entry points to sign in or register.
 */
export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <Flex vertical align="center" justify="center" gap="middle" style={{ minHeight: '100vh' }}>
      <Typography.Title level={1}>{env.appName}</Typography.Title>
      <Typography.Paragraph type="secondary">
        AI-powered family financial management
      </Typography.Paragraph>
      <Flex gap="small">
        <Link to={ROUTES.LOGIN}>
          <Button type="primary" size="large">
            Sign in
          </Button>
        </Link>
        <Link to={ROUTES.REGISTER}>
          <Button size="large">Create account</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
