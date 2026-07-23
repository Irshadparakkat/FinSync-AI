import { Card, Flex, Tag, Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { palette } from '@/theme';

/** Placeholder until the AI Analysis module ships. */
export function AiInsightsCard() {
  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <BulbOutlined style={{ color: '#8b5cf6' }} /> AI insights
        </Flex>
      }
      extra={<Tag color="purple">Coming soon</Tag>}
      style={{ height: '100%' }}
    >
      <Flex
        vertical
        gap={8}
        style={{
          padding: 16,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${palette.primarySoft}, rgba(139, 92, 246, 0.10))`,
        }}
      >
        <Typography.Text strong>Your financial copilot is warming up</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          Once income and expenses are tracked, FinSync AI will analyze spending patterns, flag
          anomalies and suggest savings opportunities for your family.
        </Typography.Text>
      </Flex>
    </Card>
  );
}
