/** Public surface of the auth feature - other modules import ONLY from here. */
export { ProtectedRoute } from './components/ProtectedRoute';
export { RequireRole } from './components/RequireRole';
export { AUTH_QUERY_KEYS, useCurrentUser, useLogin, useLogout, useRegister } from './hooks/use-auth';
