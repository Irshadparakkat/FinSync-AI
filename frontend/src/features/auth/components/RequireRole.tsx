import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@/types/auth.types';

interface RequireRoleProps extends PropsWithChildren {
  roles: UserRole[];
}

/**
 * Role guard for route subtrees (e.g. /admin/* for SUPER_ADMIN).
 * UX only - the API's RolesGuard enforces the real authorization.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const role = useAuthStore((state) => state.user?.role);

  if (!role || !roles.includes(role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
