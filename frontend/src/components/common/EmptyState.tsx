import type { ReactNode } from 'react';
import { Card, Empty, Typography } from 'antd';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  /** Call-to-action (e.g. a "Create" button). */
  action?: ReactNode;
}

/** Friendly empty screen with an optional CTA - fades in softly. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card styles={{ body: { padding: '48px 24px' } }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <>
              <Typography.Title level={5} style={{ marginBottom: 4 }}>
                {title}
              </Typography.Title>
              {description && <Typography.Text type="secondary">{description}</Typography.Text>}
            </>
          }
        >
          {action}
        </Empty>
      </Card>
    </motion.div>
  );
}
