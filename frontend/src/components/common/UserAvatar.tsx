import { Avatar } from 'antd';
import type { AvatarProps } from 'antd';
import { getAvatarColor, getInitials } from '@/utils/format.util';

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'children'> {
  name: string;
  /** Image URL / data URI; falls back to colored initials when absent. */
  src?: string | null;
}

/** Reusable avatar: photo when available, deterministic initials otherwise. */
export function UserAvatar({ name, src, style, ...rest }: UserAvatarProps) {
  if (src) {
    return <Avatar src={src} alt={name} style={style} {...rest} />;
  }

  return (
    <Avatar
      alt={name}
      style={{ backgroundColor: getAvatarColor(name), fontWeight: 600, ...style }}
      {...rest}
    >
      {getInitials(name)}
    </Avatar>
  );
}
