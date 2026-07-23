import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Col, Flex, Form, Row } from 'antd';
import { useForm } from 'react-hook-form';
import { AppModal } from '@/components/common/AppModal';
import { AvatarUpload } from '@/components/form/AvatarUpload';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledInputNumber } from '@/components/form/ControlledInputNumber';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { GENDER_OPTIONS, MEMBER_ROLE_OPTIONS } from '@/constants/select-options.constants';
import { ApiError } from '@/lib/api-client';
import { RELATIONSHIP_OPTIONS } from '../constants/member-options.constants';
import type { CreateMemberPayload, Member } from '../types/member.types';
import type { MemberFormValues } from '../validation/member.schemas';
import { memberSchema } from '../validation/member.schemas';

const EMPTY_VALUES: MemberFormValues = {
  name: '',
  relationship: 'OTHER',
  gender: 'MALE',
  dateOfBirth: '',
  occupation: '',
  monthlyIncome: undefined,
  phone: '',
  email: '',
  profileImage: undefined,
  role: 'FAMILY_MEMBER',
};

const toFormValues = (member: Member): MemberFormValues => ({
  name: member.name,
  relationship: member.relationship,
  gender: member.gender,
  dateOfBirth: member.dateOfBirth.slice(0, 10),
  occupation: member.occupation ?? '',
  monthlyIncome: member.monthlyIncome,
  phone: member.phone ?? '',
  email: member.email ?? '',
  profileImage: member.profileImage ?? undefined,
  role: member.role === 'FAMILY_OWNER' ? 'FAMILY_OWNER' : 'FAMILY_MEMBER',
});

/** Empty strings become omitted fields - the API treats them as absent. */
const toPayload = (values: MemberFormValues): CreateMemberPayload => ({
  name: values.name,
  relationship: values.relationship,
  gender: values.gender,
  dateOfBirth: values.dateOfBirth,
  occupation: values.occupation || undefined,
  monthlyIncome: values.monthlyIncome,
  phone: values.phone || undefined,
  email: values.email || undefined,
  profileImage: values.profileImage || undefined,
  role: values.role,
});

interface MemberFormModalProps {
  open: boolean;
  /** Present -> edit mode; absent -> add mode. */
  member?: Member | null;
  onClose: () => void;
  onSubmit: (payload: CreateMemberPayload) => void;
  submitting: boolean;
  error?: unknown;
}

/**
 * Add/Edit member form in the reusable modal. Single-column on mobile,
 * two columns from sm up.
 */
export function MemberFormModal({
  open,
  member,
  onClose,
  onSubmit,
  submitting,
  error,
}: MemberFormModalProps) {
  const { control, handleSubmit, reset, watch } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: EMPTY_VALUES,
  });

  // Re-seed the form whenever the modal opens for a different member
  useEffect(() => {
    if (open) {
      reset(member ? toFormValues(member) : EMPTY_VALUES);
    }
  }, [open, member, reset]);

  const name = watch('name');
  const apiError = error instanceof ApiError ? error.message : null;

  return (
    <AppModal
      open={open}
      title={member ? 'Edit member' : 'Add member'}
      onClose={onClose}
      width={640}
    >
      {apiError && <Alert type="error" showIcon message={apiError} style={{ marginBottom: 16 }} />}

      <Form
        layout="vertical"
        onFinish={handleSubmit((values) => onSubmit(toPayload(values)))}
        requiredMark={false}
      >
        <AvatarUpload control={control} name="profileImage" displayName={name || 'New member'} />

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <ControlledInput
              control={control}
              name="name"
              label="Full name"
              placeholder="e.g. Sarah Doe"
              required
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledSelect
              control={control}
              name="relationship"
              label="Relationship"
              options={RELATIONSHIP_OPTIONS}
              required
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledSelect
              control={control}
              name="gender"
              label="Gender"
              options={GENDER_OPTIONS}
              required
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledDatePicker
              control={control}
              name="dateOfBirth"
              label="Date of birth"
              placeholder="Select date"
              disableFuture
              required
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledInput
              control={control}
              name="occupation"
              label="Occupation"
              placeholder="e.g. Teacher"
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledInputNumber
              control={control}
              name="monthlyIncome"
              label="Monthly income"
              placeholder="0"
              min={0}
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledInput
              control={control}
              name="phone"
              label="Phone"
              placeholder="+971 50 123 4567"
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledInput
              control={control}
              name="email"
              label="Email (optional)"
              type="email"
              placeholder="member@example.com"
            />
          </Col>
          <Col xs={24} sm={12}>
            <ControlledSelect
              control={control}
              name="role"
              label="Role"
              options={MEMBER_ROLE_OPTIONS}
              required
            />
          </Col>
        </Row>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save
          </Button>
        </Flex>
      </Form>
    </AppModal>
  );
}
