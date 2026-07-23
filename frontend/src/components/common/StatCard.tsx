import type { ReactNode } from 'react';
import { Card, Skeleton, Typography } from 'antd';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  /** Accent for the icon chip (any CSS color). */
  accent: string;
  hint?: ReactNode;
  loading?: boolean;
}

/**
 * Animated dashboard stat tile: hover lift, icon chip, optional hint
 * line. Purely presentational - values come from the caller.
 */
export function StatCard({ title, value, icon, accent, hint, loading }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ height: '100%' }}
    >
      <Card style={{ height: '100%' }} styles={{ body: { padding: 20 } }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: accent,
                background: `color-mix(in srgb, ${accent} 15%, transparent)`,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {title}
              </Typography.Text>
              <Typography.Title level={4} style={{ margin: '2px 0 0' }}>
                {value}
              </Typography.Title>
              {hint && (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {hint}
                </Typography.Text>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
