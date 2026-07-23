import { Form, InputNumber } from 'antd';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface ControlledInputNumberProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  /** Displayed after the value (e.g. the workspace currency code). */
  suffix?: string;
}

/** RHF <-> antd InputNumber bridge (see ControlledInput). */
export function ControlledInputNumber<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  min,
  suffix,
}: ControlledInputNumberProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={fieldState.error ? 'error' : ''}
      help={fieldState.error?.message}
    >
      <InputNumber
        style={{ width: '100%' }}
        value={(field.value as number | undefined) ?? undefined}
        onChange={(value) => field.onChange(value ?? undefined)}
        onBlur={field.onBlur}
        placeholder={placeholder}
        min={min}
        addonAfter={suffix}
      />
    </Form.Item>
  );
}
