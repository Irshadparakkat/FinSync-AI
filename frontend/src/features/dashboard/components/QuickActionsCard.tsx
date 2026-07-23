import { Button, Card, Flex, Tooltip } from 'antd';
import {
  DollarOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';

/** Shortcuts into the modules; future ones stay visible but disabled. */
export function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <ThunderboltOutlined style={{ color: '#34d399' }} /> Quick actions
        </Flex>
      }
      style={{ height: '100%' }}
    >
      <Flex vertical gap={10}>
        <Button
          icon={<UserAddOutlined />}
          block
          onClick={() => navigate(ROUTES.MEMBERS)}
          style={{ justifyContent: 'flex-start', display: 'flex' }}
        >
          Add family member
        </Button>
        <Tooltip title="Arrives with the Income module">
          <Button
            icon={<DollarOutlined />}
            block
            disabled
            style={{ justifyContent: 'flex-start', display: 'flex' }}
          >
            Record income
          </Button>
        </Tooltip>
        <Tooltip title="Arrives with the Expenses module">
          <Button
            icon={<WalletOutlined />}
            block
            disabled
            style={{ justifyContent: 'flex-start', display: 'flex' }}
          >
            Record expense
          </Button>
        </Tooltip>
        <Tooltip title="Arrives with the Reports module">
          <Button
            icon={<LineChartOutlined />}
            block
            disabled
            style={{ justifyContent: 'flex-start', display: 'flex' }}
          >
            View reports
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  );
}
