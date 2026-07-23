import { useState } from 'react';
import { App, Button, Card, Col, Descriptions, Row, Skeleton, Tag, Typography } from 'antd';
import { EditOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { AppModal } from '@/components/common/AppModal';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { COUNTRY_OPTIONS } from '@/constants/geo.constants';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';
import { CreateFamilyCard } from '../components/CreateFamilyCard';
import { FamilyForm } from '../components/FamilyForm';
import { useMyFamily, useUpdateFamily } from '../hooks/use-family';

/**
 * Family Workspace screen: onboarding (no workspace yet) or workspace
 * overview + owner-only settings.
 */
export function FamilyPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: family, isLoading } = useMyFamily();
  const updateMutation = useUpdateFamily();
  const [editOpen, setEditOpen] = useState(false);

  const isOwner = user?.role === 'FAMILY_OWNER';

  // No workspace yet -> onboarding
  if (!user?.familyId) {
    return <CreateFamilyCard />;
  }

  if (isLoading || !family) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const countryLabel =
    COUNTRY_OPTIONS.find((option) => option.value === family.country)?.label ?? family.country;

  return (
    <>
      <PageHeader
        title={family.familyName}
        subtitle={
          <>
            Workspace code&nbsp;
            <Typography.Text code copyable>
              {family.familyCode}
            </Typography.Text>
          </>
        }
        extra={
          isOwner && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
              Edit workspace
            </Button>
          )
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Members"
            value={family.membersCount}
            icon={<TeamOutlined />}
            accent="#6366f1"
            hint={
              <Typography.Link onClick={() => navigate(ROUTES.MEMBERS)}>
                Manage members
              </Typography.Link>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Currency"
            value={family.currency}
            icon={<span style={{ fontWeight: 700 }}>$</span>}
            accent="#34d399"
            hint="Workspace reporting currency"
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard
            title="Status"
            value={
              <Tag color={family.status === 'ACTIVE' ? 'success' : 'error'}>{family.status}</Tag>
            }
            icon={<span>●</span>}
            accent={family.status === 'ACTIVE' ? '#34d399' : '#f87171'}
            hint={`Since ${new Date(family.createdAt).toLocaleDateString()}`}
          />
        </Col>
      </Row>

      <Card title="Workspace details" style={{ marginTop: 16 }}>
        <Descriptions
          column={{ xs: 1, sm: 2 }}
          items={[
            { key: 'name', label: 'Family name', children: family.familyName },
            { key: 'code', label: 'Family code', children: family.familyCode },
            { key: 'country', label: 'Country', children: countryLabel },
            { key: 'timezone', label: 'Timezone', children: family.timezone },
            { key: 'currency', label: 'Currency', children: family.currency },
            {
              key: 'created',
              label: 'Created',
              children: new Date(family.createdAt).toLocaleDateString(),
            },
          ]}
        />
      </Card>

      <AppModal open={editOpen} title="Edit workspace" onClose={() => setEditOpen(false)}>
        <FamilyForm
          defaultValues={{
            familyName: family.familyName,
            currency: family.currency,
            country: family.country,
            timezone: family.timezone,
          }}
          onSubmit={(values) =>
            updateMutation.mutate(values, {
              onSuccess: () => {
                setEditOpen(false);
                void message.success('Workspace updated');
              },
              onError: (error) => void message.error(error.message),
            })
          }
          submitLabel="Save changes"
          submitting={updateMutation.isPending}
          onCancel={() => setEditOpen(false)}
        />
      </AppModal>
    </>
  );
}
