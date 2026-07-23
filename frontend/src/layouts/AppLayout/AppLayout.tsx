import { useEffect, useState } from 'react';
import { Drawer, Grid, Layout, Typography } from 'antd';
import { Outlet, useLocation } from 'react-router';
import { PageTransition } from '@/components/common/PageTransition';
import { env } from '@/config/env';
import { useUiStore } from '@/stores/ui.store';
import { palette } from '@/theme';
import { AppHeader } from './AppHeader';
import { SidebarContent } from './SidebarContent';

const SIDER_WIDTH = 256;
const SIDER_COLLAPSED_WIDTH = 80;

/**
 * The authenticated application shell shared by EVERY module (dashboard,
 * family, finances, admin…): desktop sidebar (collapsible icon rail),
 * mobile slide-in drawer, sticky header, animated content area, footer.
 */
export function AppLayout() {
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Route changes close the mobile drawer (e.g. back button navigation).
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop: collapsible sider with antd's built-in width animation */}
      {!isMobile && (
        <Layout.Sider
          width={SIDER_WIDTH}
          collapsedWidth={SIDER_COLLAPSED_WIDTH}
          collapsed={collapsed}
          trigger={null}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            borderRight: `1px solid ${palette.borderSecondary}`,
          }}
        >
          <SidebarContent collapsed={collapsed} />
        </Layout.Sider>
      )}

      {/* Mobile: same navigation inside a slide-in drawer */}
      <Drawer
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={280}
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        <SidebarContent collapsed={false} onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      <Layout>
        <AppHeader
          isMobile={isMobile}
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <Layout.Content style={{ padding: isMobile ? 16 : 24 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </Layout.Content>

        <Layout.Footer style={{ textAlign: 'center', background: 'transparent', paddingTop: 0 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {env.appName} — AI-powered family financial management
          </Typography.Text>
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
