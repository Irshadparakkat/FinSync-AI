import type { ReactNode } from 'react';
import { Card, Tag, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { palette } from '@/theme';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

/**
 * Placeholder screen for modules that exist in navigation but ship
 * later (income, expenses, admin…). Keeps the shell complete without
 * building business logic ahead of its module.
 */
export function ComingSoonPage({ title, description, icon }: ComingSoonPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card styles={{ body: { padding: '64px 24px', textAlign: 'center' } }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 72,
            height: 72,
            margin: '0 auto 20px',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: palette.primary,
            background: palette.primarySoft,
          }}
        >
          {icon ?? <RocketOutlined />}
        </motion.div>
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ maxWidth: 440, margin: '0 auto 16px' }}>
          {description}
        </Typography.Paragraph>
        <Tag color="processing">Coming soon</Tag>
      </Card>
    </motion.div>
  );
}
