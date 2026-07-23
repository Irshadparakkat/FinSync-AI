import { Form, Input } from 'antd';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * RHF <-> antd Input bridge. All form fields go through these Controlled*
 * components so validation display and layout stay identical everywhere.
 */
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  required,
  disabled,
}: ControlledInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={fieldState.error ? 'error' : ''}
      help={fieldState.error?.message}
    >
      <Input
        {...field}
        value={(field.value as string | undefined) ?? ''}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Form.Item>
  );
}
