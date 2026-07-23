import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { useLogout } from '@/features/auth';

/**
 * Logout is reachable from two shell spots (sidebar + header dropdown);
 * this hook keeps the behavior identical: invalidate server-side, clear
 * local session, land on the login page.
 */
export function useLogoutAction() {
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate(ROUTES.LOGIN, { replace: true }),
    });
  };

  return { logout, isLoggingOut: logoutMutation.isPending };
}
