import { useMemo } from 'react';
import { Button, Flex, Menu, Typography } from 'antd';
import { LogoutOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import { palette } from '@/theme';
import { buildNavItems, findSelectedKey } from './nav-config';
import { useLogoutAction } from './use-logout-action';

interface SidebarContentProps {
  collapsed: boolean;
  /** Mobile drawer closes itself after navigation. */
  onNavigate?: () => void;
}

/**
 * Brand + navigation + logout. Rendered inside the desktop Sider AND the
 * mobile Drawer, so both always show identical navigation.
 */
export function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAuthStore((state) => state.user?.role) ?? 'FAMILY_MEMBER';
  const { logout, isLoggingOut } = useLogoutAction();

  const items = useMemo(() => buildNavItems(role), [role]);
  const selectedKey = findSelectedKey(location.pathname);

  return (
    <Flex vertical style={{ height: '100%' }}>
      {/* Brand */}
      <Flex
        align="center"
        justify={collapsed ? 'center' : 'flex-start'}
        gap={10}
        style={{ padding: collapsed ? '18px 0' : '18px 20px', flexShrink: 0 }}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${palette.primary}, #8b5cf6)`,
            color: '#fff',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          <ThunderboltFilled />
        </Flex>
        {!collapsed && (
          <Typography.Text strong style={{ fontSize: 17, whiteSpace: 'nowrap' }}>
            {env.appName}
          </Typography.Text>
        )}
      </Flex>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Menu
          mode="inline"
          items={items}
          selectedKeys={selectedKey ? [selectedKey] : []}
          inlineCollapsed={collapsed}
          style={{ borderInlineEnd: 'none', background: 'transparent' }}
          onClick={({ key }) => {
            navigate(key);
            onNavigate?.();
          }}
        />
      </div>

      {/* Logout pinned to the bottom */}
      <div style={{ padding: 12, flexShrink: 0 }}>
        <Button
          danger
          type="text"
          block
          icon={<LogoutOutlined />}
          loading={isLoggingOut}
          onClick={logout}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', display: 'flex' }}
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </Flex>
  );
}
