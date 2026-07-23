import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Flex, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS, getTimezoneOptions } from '@/constants/geo.constants';
import type { FamilyFormValues } from '../validation/family.schemas';
import { familySchema } from '../validation/family.schemas';

interface FamilyFormProps {
  defaultValues: FamilyFormValues;
  onSubmit: (values: FamilyFormValues) => void;
  submitLabel: string;
  submitting: boolean;
  onCancel?: () => void;
}

const TIMEZONE_OPTIONS = getTimezoneOptions();

/** One workspace form for both create and edit - fields never drift apart. */
export function FamilyForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
  onCancel,
}: FamilyFormProps) {
  const { control, handleSubmit } = useForm<FamilyFormValues>({
    resolver: zodResolver(familySchema),
    defaultValues,
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
      <ControlledInput
        control={control}
        name="familyName"
        label="Family name"
        placeholder="e.g. The Doe Family"
        required
      />
      <ControlledSelect
        control={control}
        name="currency"
        label="Currency"
        placeholder="Workspace currency"
        options={CURRENCY_OPTIONS}
        showSearch
        required
      />
      <ControlledSelect
        control={control}
        name="country"
        label="Country"
        placeholder="Where the family lives"
        options={COUNTRY_OPTIONS}
        showSearch
        required
      />
      <ControlledSelect
        control={control}
        name="timezone"
        label="Timezone"
        placeholder="e.g. Asia/Dubai"
        options={TIMEZONE_OPTIONS}
        showSearch
        required
      />

      <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button type="primary" htmlType="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </Flex>
    </Form>
  );
}
