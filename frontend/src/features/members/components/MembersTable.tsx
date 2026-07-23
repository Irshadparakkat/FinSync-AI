import { Button, Popconfirm, Space, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/common/DataTable';
import { UserAvatar } from '@/components/common/UserAvatar';
import type { PaginationMeta } from '@/types/api.types';
import { formatCurrency } from '@/utils/format.util';
import { relationshipLabel } from '../constants/member-options.constants';
import type { Member } from '../types/member.types';

interface MembersTableProps {
  members: Member[];
  meta?: PaginationMeta;
  loading: boolean;
  currency: string;
  /** Owner-only actions are hidden for plain members. */
  canManage: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  deletingId?: string | null;
}

/**
 * Members table on the reusable DataTable. Secondary columns collapse on
 * smaller screens (antd responsive columns); the rest stays scrollable.
 */
export function MembersTable({
  members,
  meta,
  loading,
  currency,
  canManage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  deletingId,
}: MembersTableProps) {
  const columns: TableProps<Member>['columns'] = [
    {
      title: 'Member',
      key: 'member',
      fixed: 'left',
      render: (_, member) => (
        <Space>
          <UserAvatar name={member.name} src={member.profileImage} size={36} />
          <div>
            <Typography.Text strong style={{ display: 'block' }}>
              {member.name}
            </Typography.Text>
            {member.email && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {member.email}
              </Typography.Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Relationship',
      dataIndex: 'relationship',
      render: (value: Member['relationship']) => relationshipLabel(value),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 70,
      align: 'center',
    },
    {
      title: 'Occupation',
      dataIndex: 'occupation',
      responsive: ['md'],
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Monthly income',
      dataIndex: 'monthlyIncome',
      responsive: ['lg'],
      align: 'right',
      render: (value: number) => formatCurrency(value, currency),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      width: 100,
      render: (isActive: boolean) =>
        isActive ? <Tag color="success">Active</Tag> : <Tag>Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, member) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(member)} />
          {canManage && (
            <>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(member)}
              />
              <Popconfirm
                title="Remove this member?"
                description={`${member.name} will be removed from the family.`}
                okText="Remove"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDelete(member)}
              >
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deletingId === member.id}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <DataTable<Member>
      rowKey="id"
      columns={columns}
      dataSource={members}
      loading={loading}
      meta={meta}
      onPageChange={onPageChange}
    />
  );
}
