import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { APP } from '@/constants/app.constants';

interface ControlledDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  /** Disable future dates (dates of birth). */
  disableFuture?: boolean;
}

/**
 * RHF <-> antd DatePicker bridge. The form value is an ISO date STRING
 * (YYYY-MM-DD) - what the API expects - conversion to dayjs stays here.
 */
export function ControlledDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required,
  disableFuture,
}: ControlledDatePickerProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const value = field.value as string | undefined;

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={fieldState.error ? 'error' : ''}
      help={fieldState.error?.message}
    >
      <DatePicker
        style={{ width: '100%' }}
        value={value ? dayjs(value) : null}
        onChange={(date) => field.onChange(date ? date.format(APP.DATE_FORMAT) : '')}
        onBlur={field.onBlur}
        placeholder={placeholder}
        disabledDate={disableFuture ? (current) => current.isAfter(dayjs(), 'day') : undefined}
      />
    </Form.Item>
  );
}
