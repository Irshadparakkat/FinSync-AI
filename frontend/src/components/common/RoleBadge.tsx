import { Tag } from 'antd';
import type { UserRole } from '@/types/auth.types';

const ROLE_PRESETS: Record<UserRole, { color: string; label: string }> = {
  SUPER_ADMIN: { color: 'gold', label: 'Super Admin' },
  FAMILY_OWNER: { color: 'geekblue', label: 'Owner' },
  FAMILY_MEMBER: { color: 'cyan', label: 'Member' },
};

/** Consistent role rendering everywhere a principal or member appears. */
export function RoleBadge({ role }: { role: UserRole }) {
  const preset = ROLE_PRESETS[role];
  return (
    <Tag color={preset.color} style={{ borderRadius: 999, marginInlineEnd: 0 }}>
      {preset.label}
    </Tag>
  );
}
