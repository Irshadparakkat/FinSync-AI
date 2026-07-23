import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

/**
 * Single source of truth for design tokens - dark, premium SaaS look
 * (Linear/Vercel-inspired). Components consume Ant Design's token
 * system - never hardcoded colors - so a brand change is a one-file edit.
 */

/** Raw palette shared by the token config and the few chart/gradient spots. */
export const palette = {
  bgBase: '#0b0f1a',
  bgSider: '#0d1321',
  bgContainer: '#121828',
  bgElevated: '#171e31',
  border: '#232c44',
  borderSecondary: '#1b2338',
  primary: '#6366f1',
  primarySoft: 'rgba(99, 102, 241, 0.14)',
  textHeading: '#eef1f8',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
} as const;

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: palette.primary,
    colorInfo: palette.primary,
    colorSuccess: palette.success,
    colorWarning: palette.warning,
    colorError: palette.error,
    colorBgBase: palette.bgBase,
    colorBgContainer: palette.bgContainer,
    colorBgElevated: palette.bgElevated,
    colorBgLayout: palette.bgBase,
    colorBorder: palette.border,
    colorBorderSecondary: palette.borderSecondary,
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    // Soft, deep shadows - cards float instead of popping
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.45)',
  },
  components: {
    Layout: {
      headerBg: 'rgba(11, 15, 26, 0.75)',
      siderBg: palette.bgSider,
      bodyBg: palette.bgBase,
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemSelectedBg: palette.primarySoft,
      itemSelectedColor: '#a5b4fc',
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemHeight: 40,
    },
    Card: {
      colorBgContainer: palette.bgContainer,
      borderRadiusLG: 14,
    },
    Table: {
      headerBg: palette.bgElevated,
      headerSplitColor: 'transparent',
      rowHoverBg: palette.bgElevated,
    },
    Modal: {
      contentBg: palette.bgContainer,
      headerBg: palette.bgContainer,
    },
    Drawer: {
      colorBgElevated: palette.bgSider,
    },
    Button: {
      primaryShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
    },
  },
};
