import { Card, Flex, Progress, Typography } from 'antd';
import { AimOutlined } from '@ant-design/icons';

/** Placeholder until the Goals module ships real data. */
const PLACEHOLDER_GOALS = [
  { name: 'Emergency fund', percent: 0 },
  { name: 'Family vacation', percent: 0 },
  { name: 'New car', percent: 0 },
];

export function GoalProgressCard() {
  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <AimOutlined style={{ color: '#f59e0b' }} /> Goal progress
        </Flex>
      }
      style={{ height: '100%' }}
    >
      <Flex vertical gap={16}>
        {PLACEHOLDER_GOALS.map((goal) => (
          <div key={goal.name}>
            <Flex justify="space-between" style={{ marginBottom: 4 }}>
              <Typography.Text>{goal.name}</Typography.Text>
              <Typography.Text type="secondary">{goal.percent}%</Typography.Text>
            </Flex>
            <Progress percent={goal.percent} showInfo={false} strokeColor="#f59e0b" />
          </div>
        ))}
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Goals arrive with the Goals module.
        </Typography.Text>
      </Flex>
    </Card>
  );
}
