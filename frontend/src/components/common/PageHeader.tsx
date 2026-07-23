import type { ReactNode } from 'react';
import { Flex, Typography } from 'antd';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Action area (buttons, search) - wraps under the title on mobile. */
  extra?: ReactNode;
}

/** Uniform page heading used by every route-level screen. */
export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      gap={16}
      wrap
      style={{ marginBottom: 24 }}
    >
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {extra && <Flex gap={8} wrap>{extra}</Flex>}
    </Flex>
  );
}
