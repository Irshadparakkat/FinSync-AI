import { Descriptions, Drawer, Flex, Tag, Typography } from 'antd';
import { RoleBadge } from '@/components/common/RoleBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { formatCurrency } from '@/utils/format.util';
import { relationshipLabel } from '../constants/member-options.constants';
import type { Member } from '../types/member.types';

interface MemberDetailsDrawerProps {
  member: Member | null;
  currency: string;
  onClose: () => void;
}

/** Read-only member profile in a slide-in drawer (responsive width). */
export function MemberDetailsDrawer({ member, currency, onClose }: MemberDetailsDrawerProps) {
  return (
    <Drawer
      open={Boolean(member)}
      onClose={onClose}
      title="Member profile"
      width={Math.min(420, window.innerWidth - 32)}
    >
      {member && (
        <>
          <Flex vertical align="center" gap={8} style={{ marginBottom: 24 }}>
            <UserAvatar name={member.name} src={member.profileImage} size={88} />
            <Typography.Title level={4} style={{ margin: 0 }}>
              {member.name}
            </Typography.Title>
            <Flex gap={8} align="center">
              <RoleBadge role={member.role} />
              {member.isActive ? <Tag color="success">Active</Tag> : <Tag>Inactive</Tag>}
            </Flex>
          </Flex>

          <Descriptions
            column={1}
            size="small"
            items={[
              {
                key: 'relationship',
                label: 'Relationship',
                children: relationshipLabel(member.relationship),
              },
              { key: 'gender', label: 'Gender', children: member.gender },
              {
                key: 'dob',
                label: 'Date of birth',
                children: new Date(member.dateOfBirth).toLocaleDateString(),
              },
              { key: 'age', label: 'Age', children: `${member.age} years` },
              { key: 'occupation', label: 'Occupation', children: member.occupation ?? '—' },
              {
                key: 'income',
                label: 'Monthly income',
                children: formatCurrency(member.monthlyIncome, currency),
              },
              { key: 'phone', label: 'Phone', children: member.phone ?? '—' },
              { key: 'email', label: 'Email', children: member.email ?? '—' },
              {
                key: 'added',
                label: 'Added',
                children: new Date(member.createdAt).toLocaleDateString(),
              },
            ]}
          />
        </>
      )}
    </Drawer>
  );
}
