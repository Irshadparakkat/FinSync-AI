import { App, Badge, Button, Dropdown, Empty, Flex, Input, Layout, Tag, Tooltip, Typography } from 'antd';
import {
  BellOutlined,
  BulbOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { RoleBadge } from '@/components/common/RoleBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { ROUTES } from '@/constants/routes.constants';
import { useMyFamily } from '@/features/family';
import { useAuthStore } from '@/stores/auth.store';
import { palette } from '@/theme';
import { useLogoutAction } from './use-logout-action';

interface AppHeaderProps {
  isMobile: boolean;
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenDrawer: () => void;
}

/**
 * Sticky glassy header: sidebar toggle, global search, notifications,
 * theme toggle (future), workspace chip and the user menu.
 */
export function AppHeader({ isMobile, collapsed, onToggleSidebar, onOpenDrawer }: AppHeaderProps) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const user = useAuthStore((state) => state.user);
  const { data: family } = useMyFamily();
  const { logout } = useLogoutAction();

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  const onUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'profile') navigate(ROUTES.PROFILE);
    if (key === 'settings') navigate(ROUTES.SETTINGS);
    if (key === 'logout') logout();
  };

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${palette.borderSecondary}`,
      }}
    >
      {/* Sidebar / drawer toggle */}
      {isMobile ? (
        <Button type="text" icon={<MenuOutlined />} onClick={onOpenDrawer} aria-label="Open menu" />
      ) : (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        />
      )}

      {/* Global search */}
      <Input
        prefix={<SearchOutlined style={{ color: '#64748b' }} />}
        placeholder="Search…"
        allowClear
        style={{ maxWidth: isMobile ? 160 : 320, borderRadius: 999 }}
        onPressEnter={() => void message.info('Global search arrives with the Reports module')}
      />

      <div style={{ flex: 1 }} />

      {/* Current family workspace */}
      {!isMobile && family && (
        <Tag
          icon={<HomeOutlined />}
          style={{ borderRadius: 999, padding: '3px 12px', marginInlineEnd: 0 }}
        >
          {family.familyName}
        </Tag>
      )}

      {/* Theme toggle - future */}
      <Tooltip title="Light theme is coming soon">
        <Button type="text" icon={<BulbOutlined />} aria-label="Theme toggle" />
      </Tooltip>

      {/* Notifications */}
      <Dropdown
        trigger={['click']}
        popupRender={() => (
          <div
            style={{
              background: palette.bgElevated,
              borderRadius: 12,
              padding: 24,
              width: 280,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications yet" />
          </div>
        )}
      >
        <Badge count={0} size="small" showZero={false}>
          <Button type="text" icon={<BellOutlined />} aria-label="Notifications" />
        </Badge>
      </Dropdown>

      {/* User menu */}
      {user && (
        <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} trigger={['click']}>
          <Flex align="center" gap={10} style={{ cursor: 'pointer', paddingInline: 4 }}>
            <UserAvatar name={user.name} src={user.profileImage} size={34} />
            {!isMobile && (
              <Flex vertical align="flex-start" style={{ lineHeight: 1.2 }}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {user.name}
                </Typography.Text>
                <RoleBadge role={user.role} />
              </Flex>
            )}
          </Flex>
        </Dropdown>
      )}
    </Layout.Header>
  );
}
