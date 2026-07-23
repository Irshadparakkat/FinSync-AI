/**
 * Route paths as constants - navigation and route definitions share one
 * source of truth, so a URL change is a one-line edit.
 */
export const ROUTES = {
  HOME: '/',
  // Auth (Module: auth)
  LOGIN: '/login',
  REGISTER: '/register',
  // App (all tenant-scoped, added with their features)
  DASHBOARD: '/dashboard',
  FAMILY: '/family',
  MEMBERS: '/family/members',
  INCOME: '/income',
  EXPENSES: '/expenses',
  SAVINGS: '/savings',
  INVESTMENTS: '/investments',
  GOALS: '/goals',
  BUDGET: '/budget',
  NET_WORTH: '/net-worth',
  REPORTS: '/reports',
  AI_INSIGHTS: '/ai-insights',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  // Platform administration (SUPER_ADMIN only)
  ADMIN: '/admin',
  ADMIN_FAMILIES: '/admin/families',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
