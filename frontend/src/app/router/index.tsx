import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router';
import { PageLoader } from '@/components/common/PageLoader';
import { ROUTES } from '@/constants/routes.constants';
import { ProtectedRoute, RequireRole } from '@/features/auth';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Route tree. Feature pages are lazy-loaded (code-split per route);
 * this file is the only place allowed to deep-import feature pages.
 */
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const FamilyPage = lazy(() =>
  import('@/features/family/pages/FamilyPage').then((m) => ({ default: m.FamilyPage })),
);
const MembersPage = lazy(() =>
  import('@/features/members/pages/MembersPage').then((m) => ({ default: m.MembersPage })),
);
const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

const suspended = (node: ReactNode): ReactNode => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

/** Future-module placeholders: route + title + blurb, one line each. */
const comingSoon = (title: string, description: string): ReactNode => (
  <ComingSoonPage title={title} description={description} />
);

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    // Public auth pages under the dark auth shell
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: suspended(<LoginPage />) },
      { path: ROUTES.REGISTER, element: suspended(<RegisterPage />) },
    ],
  },
  {
    // Authenticated application shell - every module renders inside it
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: suspended(<DashboardPage />) },
      { path: ROUTES.FAMILY, element: suspended(<FamilyPage />) },
      { path: ROUTES.MEMBERS, element: suspended(<MembersPage />) },
      { path: ROUTES.PROFILE, element: suspended(<ProfilePage />) },
      // Future modules - placeholders keep the shell complete
      {
        path: ROUTES.INCOME,
        element: comingSoon('Income', 'Track salaries, business income and other earnings.'),
      },
      {
        path: ROUTES.EXPENSES,
        element: comingSoon('Expenses', 'Categorized spending tracking for the whole family.'),
      },
      {
        path: ROUTES.SAVINGS,
        element: comingSoon('Savings', 'Savings accounts and contributions in one place.'),
      },
      {
        path: ROUTES.INVESTMENTS,
        element: comingSoon('Investments', 'Portfolio tracking across all your assets.'),
      },
      {
        path: ROUTES.GOALS,
        element: comingSoon('Goals', 'Set financial goals and watch the progress.'),
      },
      {
        path: ROUTES.BUDGET,
        element: comingSoon('Budget Planner', 'Plan monthly budgets per category.'),
      },
      {
        path: ROUTES.NET_WORTH,
        element: comingSoon('Net Worth', "Your family's complete financial picture."),
      },
      {
        path: ROUTES.REPORTS,
        element: comingSoon('Reports', 'Charts, trends and exportable statements.'),
      },
      {
        path: ROUTES.AI_INSIGHTS,
        element: comingSoon('AI Insights', 'AI-powered analysis of your family finances.'),
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: comingSoon('Notifications', 'Alerts for bills, goals and unusual activity.'),
      },
      {
        path: ROUTES.SETTINGS,
        element: comingSoon('Settings', 'Workspace preferences and integrations.'),
      },
      // Platform administration - SUPER_ADMIN only
      {
        path: ROUTES.ADMIN,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('Admin Dashboard', 'Platform-wide metrics and operations.')}
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_FAMILIES,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('Families', 'Manage every family workspace on the platform.')}
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('Users', 'Platform user administration.')}
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_ANALYTICS,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('Analytics', 'Growth, retention and usage analytics.')}
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_SUBSCRIPTIONS,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('Subscriptions', 'Plans, billing and subscription management.')}
          </RequireRole>
        ),
      },
      {
        path: ROUTES.ADMIN_SETTINGS,
        element: (
          <RequireRole roles={['SUPER_ADMIN']}>
            {comingSoon('System Settings', 'Platform configuration and feature flags.')}
          </RequireRole>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
