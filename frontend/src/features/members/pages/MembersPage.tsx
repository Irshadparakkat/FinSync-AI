import { useState } from 'react';
import { App, Button, Card, Flex, Input, Select } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { APP } from '@/constants/app.constants';
import { ROUTES } from '@/constants/routes.constants';
import { useMyFamily } from '@/features/family';
import { useAuthStore } from '@/stores/auth.store';
import { MemberDetailsDrawer } from '../components/MemberDetailsDrawer';
import { MemberFormModal } from '../components/MemberFormModal';
import { MembersTable } from '../components/MembersTable';
import { RELATIONSHIP_OPTIONS } from '../constants/member-options.constants';
import {
  useCreateMember,
  useDeleteMember,
  useMembers,
  useUpdateMember,
} from '../hooks/use-members';
import type { Member, MemberListQuery, Relationship } from '../types/member.types';

/**
 * Member management: list + filters + add/edit modal + details drawer.
 * Owner-only mutations; members get a read-only view.
 */
export function MembersPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: family } = useMyFamily();

  const [query, setQuery] = useState<MemberListQuery>({
    page: 1,
    limit: APP.DEFAULT_PAGE_SIZE,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [viewing, setViewing] = useState<Member | null>(null);

  const { data, isLoading, isFetching } = useMembers(query);
  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember();
  const deleteMutation = useDeleteMember();

  const canManage = user?.role === 'FAMILY_OWNER';
  const currency = family?.currency ?? 'USD';

  // No workspace yet -> point the user to onboarding
  if (!user?.familyId) {
    return (
      <EmptyState
        title="Create your family workspace first"
        description="Members live inside your family workspace."
        action={
          <Button type="primary" onClick={() => navigate(ROUTES.FAMILY)}>
            Create workspace
          </Button>
        }
      />
    );
  }

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditing(member);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const activeMutation = editing ? updateMutation : createMutation;

  return (
    <>
      <PageHeader
        title="Members"
        subtitle={`${data?.meta?.totalItems ?? family?.membersCount ?? 0} people in ${family?.familyName ?? 'your family'}`}
        extra={
          canManage && (
            <Button type="primary" icon={<UserAddOutlined />} onClick={openAdd}>
              Add member
            </Button>
          )
        }
      />

      <Card>
        {/* Filters - stack on mobile via wrap */}
        <Flex gap={12} wrap style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#64748b' }} />}
            placeholder="Search by name…"
            allowClear
            style={{ maxWidth: 260 }}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, page: 1, search: event.target.value || undefined }))
            }
          />
          <Select
            placeholder="Relationship"
            allowClear
            style={{ minWidth: 160 }}
            options={RELATIONSHIP_OPTIONS}
            onChange={(value: Relationship | undefined) =>
              setQuery((prev) => ({ ...prev, page: 1, relationship: value }))
            }
          />
          <Select
            placeholder="Status"
            allowClear
            style={{ minWidth: 130 }}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            onChange={(value: string | undefined) =>
              setQuery((prev) => ({
                ...prev,
                page: 1,
                isActive: value === undefined ? undefined : value === 'true',
              }))
            }
          />
        </Flex>

        <MembersTable
          members={data?.items ?? []}
          meta={data?.meta}
          loading={isLoading || isFetching}
          currency={currency}
          canManage={canManage}
          onPageChange={(page, pageSize) =>
            setQuery((prev) => ({ ...prev, page, limit: pageSize }))
          }
          onView={setViewing}
          onEdit={openEdit}
          onDelete={(member) =>
            deleteMutation.mutate(member.id, {
              onSuccess: () => void message.success(`${member.name} removed`),
              onError: (error) => void message.error(error.message),
            })
          }
          deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
        />
      </Card>

      <MemberFormModal
        open={formOpen}
        member={editing}
        onClose={closeForm}
        submitting={activeMutation.isPending}
        error={activeMutation.error}
        onSubmit={(payload) => {
          if (editing) {
            updateMutation.mutate(
              { id: editing.id, payload },
              {
                onSuccess: () => {
                  closeForm();
                  void message.success('Member updated');
                },
              },
            );
          } else {
            createMutation.mutate(payload, {
              onSuccess: () => {
                closeForm();
                void message.success('Member added');
              },
            });
          }
        }}
      />

      <MemberDetailsDrawer member={viewing} currency={currency} onClose={() => setViewing(null)} />
    </>
  );
}
