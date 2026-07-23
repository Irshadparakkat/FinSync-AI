import { App, Button, Flex, Form, Upload } from 'antd';
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { UserAvatar } from '@/components/common/UserAvatar';

/** Client-side guardrails mirroring the backend's profileImage limits. */
const MAX_IMAGE_BYTES = 200 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

interface AvatarUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  /** Name used for the initials fallback preview. */
  displayName: string;
  label?: string;
}

/**
 * Profile picture picker: converts the chosen file to a base64 data URI
 * (the API accepts data URIs or https URLs), previews it, and enforces
 * size/type limits client-side before the backend re-validates.
 */
export function AvatarUpload<T extends FieldValues>({
  control,
  name,
  displayName,
  label = 'Profile photo',
}: AvatarUploadProps<T>) {
  const { message } = App.useApp();
  const { field, fieldState } = useController({ control, name });
  const value = field.value as string | undefined;

  const handleFile = (file: File): false => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      void message.error('Please choose a PNG, JPG, WEBP or GIF image');
      return false;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      void message.error('Image must be smaller than 200KB');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => field.onChange(reader.result as string);
    reader.readAsDataURL(file);
    return false; // never auto-upload - the form submits the data URI
  };

  return (
    <Form.Item
      label={label}
      validateStatus={fieldState.error ? 'error' : ''}
      help={fieldState.error?.message}
    >
      <Flex align="center" gap={16}>
        <UserAvatar name={displayName || '?'} src={value} size={64} />
        <Flex gap={8}>
          <Upload accept={ACCEPTED_TYPES.join(',')} showUploadList={false} beforeUpload={handleFile}>
            <Button icon={<CameraOutlined />}>{value ? 'Change' : 'Upload'}</Button>
          </Upload>
          {value && (
            <Button icon={<DeleteOutlined />} onClick={() => field.onChange(undefined)}>
              Remove
            </Button>
          )}
        </Flex>
      </Flex>
    </Form.Item>
  );
}
