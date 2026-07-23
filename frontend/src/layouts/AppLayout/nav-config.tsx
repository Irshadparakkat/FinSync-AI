import type { MenuProps } from 'antd';
import {
  AimOutlined,
  ApartmentOutlined,
  BankOutlined,
  BarChartOutlined,
  BellOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DashboardOutlined,
  DollarOutlined,
  FundOutlined,
  HomeOutlined,
  LineChartOutlined,
  RiseOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants/routes.constants';
import type { UserRole } from '@/types/auth.types';

/**
 * Single source of truth for sidebar navigation. Keys ARE route paths -
 * the Menu navigates by key and selection is derived from the location.
 */
export function buildNavItems(role: UserRole): MenuProps['items'] {
  const adminGroup: MenuProps['items'] =
    role === 'SUPER_ADMIN'
      ? [
          {
            type: 'group',
            label: 'Administration',
            children: [
              { key: ROUTES.ADMIN, icon: <CrownOutlined />, label: 'Admin Dashboard' },
              { key: ROUTES.ADMIN_FAMILIES, icon: <ApartmentOutlined />, label: 'Families' },
              { key: ROUTES.ADMIN_USERS, icon: <UserOutlined />, label: 'Users' },
              { key: ROUTES.ADMIN_ANALYTICS, icon: <BarChartOutlined />, label: 'Analytics' },
              {
                key: ROUTES.ADMIN_SUBSCRIPTIONS,
                icon: <CreditCardOutlined />,
                label: 'Subscriptions',
              },
              { key: ROUTES.ADMIN_SETTINGS, icon: <SettingOutlined />, label: 'System Settings' },
            ],
          },
        ]
      : [];

  return [
    {
      type: 'group',
      label: 'Overview',
      children: [{ key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, label: 'Dashboard' }],
    },
    {
      type: 'group',
      label: 'Family',
      children: [
        { key: ROUTES.FAMILY, icon: <HomeOutlined />, label: 'Family' },
        { key: ROUTES.MEMBERS, icon: <TeamOutlined />, label: 'Members' },
      ],
    },
    {
      type: 'group',
      label: 'Finance',
      children: [
        { key: ROUTES.INCOME, icon: <DollarOutlined />, label: 'Income' },
        { key: ROUTES.EXPENSES, icon: <WalletOutlined />, label: 'Expenses' },
        { key: ROUTES.SAVINGS, icon: <BankOutlined />, label: 'Savings' },
        { key: ROUTES.INVESTMENTS, icon: <RiseOutlined />, label: 'Investments' },
        { key: ROUTES.GOALS, icon: <AimOutlined />, label: 'Goals' },
        { key: ROUTES.BUDGET, icon: <CalculatorOutlined />, label: 'Budget Planner' },
        { key: ROUTES.NET_WORTH, icon: <FundOutlined />, label: 'Net Worth' },
      ],
    },
    {
      type: 'group',
      label: 'Insights',
      children: [
        { key: ROUTES.REPORTS, icon: <LineChartOutlined />, label: 'Reports' },
        { key: ROUTES.AI_INSIGHTS, icon: <BulbOutlined />, label: 'AI Insights' },
      ],
    },
    {
      type: 'group',
      label: 'General',
      children: [
        { key: ROUTES.NOTIFICATIONS, icon: <BellOutlined />, label: 'Notifications' },
        { key: ROUTES.SETTINGS, icon: <SettingOutlined />, label: 'Settings' },
        { key: ROUTES.PROFILE, icon: <UserOutlined />, label: 'Profile' },
      ],
    },
    ...adminGroup,
  ];
}

/** Longest route key that prefixes the current pathname (deepest match wins). */
export function findSelectedKey(pathname: string): string {
  const keys = Object.values(ROUTES).filter((route) => route !== ROUTES.HOME);
  return (
    keys
      .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
      .sort((a, b) => b.length - a.length)[0] ?? ''
  );
}
