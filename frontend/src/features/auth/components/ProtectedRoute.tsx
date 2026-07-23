import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Route guard: unauthenticated visitors are redirected to /login and the
 * intended destination is preserved so login can send them back.
 * UX only - the API enforces the real authorization.
 */
export function ProtectedRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
