import { Form, Select } from 'antd';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface ControlledSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Searchable dropdown (long lists: countries, timezones). */
  showSearch?: boolean;
  allowClear?: boolean;
}

/** RHF <-> antd Select bridge (see ControlledInput). */
export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  options,
  label,
  placeholder,
  required,
  disabled,
  showSearch,
  allowClear,
}: ControlledSelectProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={fieldState.error ? 'error' : ''}
      help={fieldState.error?.message}
    >
      <Select
        value={(field.value as string | undefined) ?? undefined}
        onChange={field.onChange}
        onBlur={field.onBlur}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        showSearch={showSearch}
        allowClear={allowClear}
        optionFilterProp="label"
      />
    </Form.Item>
  );
}
