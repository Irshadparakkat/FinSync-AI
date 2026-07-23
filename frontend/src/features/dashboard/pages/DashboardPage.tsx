import { Button, Col, Row, Typography } from 'antd';
import {
  BankOutlined,
  DollarOutlined,
  FundOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { ROUTES } from '@/constants/routes.constants';
import { useMyFamily } from '@/features/family';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency } from '@/utils/format.util';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { GoalProgressCard } from '../components/GoalProgressCard';
import { QuickActionsCard } from '../components/QuickActionsCard';
import { RecentActivityCard } from '../components/RecentActivityCard';

/** Staggered entrance for the card grid. */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * Dashboard shell with placeholder metrics - every card gets real data
 * when its module (income, expenses, goals, AI) is built.
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: family, isLoading } = useMyFamily();

  const currency = family?.currency ?? 'USD';
  const firstName = user?.name.split(' ')[0] ?? 'there';

  const stats = [
    {
      title: 'Total income',
      icon: <DollarOutlined />,
      accent: '#34d399',
      hint: 'Arrives with the Income module',
    },
    {
      title: 'Total expenses',
      icon: <WalletOutlined />,
      accent: '#f87171',
      hint: 'Arrives with the Expenses module',
    },
    {
      title: 'Total savings',
      icon: <BankOutlined />,
      accent: '#0ea5e9',
      hint: 'Arrives with the Savings module',
    },
    {
      title: 'Net worth',
      icon: <FundOutlined />,
      accent: '#8b5cf6',
      hint: 'Arrives with the Net Worth module',
    },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle={
          family
            ? `Here's what's happening in ${family.familyName}`
            : 'Set up your family workspace to unlock FinSync AI'
        }
      />

      {!user?.familyId && (
        <div style={{ marginBottom: 16 }}>
          <EmptyState
            title="Create your family workspace"
            description="Members, finances and insights all live inside your workspace."
            action={
              <Button type="primary" onClick={() => navigate(ROUTES.FAMILY)}>
                Get started
              </Button>
            }
          />
        </div>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {/* Stat tiles */}
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} xl={6} key={stat.title}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <StatCard
                  title={stat.title}
                  value={
                    <Typography.Text style={{ fontSize: 20, fontWeight: 600 }}>
                      {formatCurrency(0, currency)}
                    </Typography.Text>
                  }
                  icon={stat.icon}
                  accent={stat.accent}
                  hint={stat.hint}
                  loading={isLoading && Boolean(user?.familyId)}
                />
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Widgets */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <GoalProgressCard />
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <RecentActivityCard />
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <AiInsightsCard />
            </motion.div>
          </Col>
          <Col xs={24} lg={12}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <QuickActionsCard />
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </>
  );
}
