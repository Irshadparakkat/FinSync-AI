import { Card, Empty, Flex } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';

/** Placeholder until income/expense records exist to feed a timeline. */
export function RecentActivityCard() {
  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <HistoryOutlined style={{ color: '#0ea5e9' }} /> Recent activities
        </Flex>
      }
      style={{ height: '100%' }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Activity appears once you start tracking income and expenses"
      />
    </Card>
  );
}
