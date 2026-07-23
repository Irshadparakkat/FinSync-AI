import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Row,
  Skeleton,
  Statistic,
  Typography,
} from 'antd';
import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/common/PageHeader';
import { RoleBadge } from '@/components/common/RoleBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { AvatarUpload } from '@/components/form/AvatarUpload';
import { ControlledDatePicker } from '@/components/form/ControlledDatePicker';
import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledSelect } from '@/components/form/ControlledSelect';
import { COUNTRY_OPTIONS, getTimezoneOptions } from '@/constants/geo.constants';
import { GENDER_OPTIONS } from '@/constants/select-options.constants';
import type { AuthUser } from '@/types/auth.types';
import { calculateAge } from '@/utils/age.util';
import { useMyProfile, useUpdateProfile } from '../hooks/use-profile';
import type { ProfileFormValues } from '../validation/profile.schemas';
import type { UpdateProfilePayload } from '../types/profile.types';
import { profileSchema } from '../validation/profile.schemas';

const TIMEZONE_OPTIONS = getTimezoneOptions();

const toFormValues = (profile: AuthUser): ProfileFormValues => ({
  name: profile.name,
  phone: profile.phone ?? '',
  gender: profile.gender ?? undefined,
  dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
  profileImage: profile.profileImage ?? undefined,
  country: profile.country ?? undefined,
  timezone: profile.timezone ?? undefined,
});

/** Empty strings are omitted - the API only receives real changes. */
const toPayload = (values: ProfileFormValues): UpdateProfilePayload => ({
  name: values.name,
  phone: values.phone || undefined,
  gender: values.gender,
  dateOfBirth: values.dateOfBirth || undefined,
  profileImage: values.profileImage || undefined,
  country: values.country,
  timezone: values.timezone,
});

/**
 * User profile: identity card with LIVE age (recomputed from the DOB
 * field as the user edits - never stored) + editable profile form.
 */
export function ProfilePage() {
  const { message } = App.useApp();
  const { data: profile, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const { control, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', dateOfBirth: '' },
  });

  // Seed the form once the profile arrives (and after external updates)
  useEffect(() => {
    if (profile) {
      reset(toFormValues(profile));
    }
  }, [profile, reset]);

  const watchedName = watch('name');
  const watchedDob = watch('dateOfBirth');
  const liveAge = watchedDob ? calculateAge(watchedDob) : (profile?.age ?? null);

  if (isLoading || !profile) {
    return <Skeleton active avatar paragraph={{ rows: 8 }} />;
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Your personal information and preferences" />

      <Row gutter={[16, 16]}>
        {/* Identity summary */}
        <Col xs={24} lg={8}>
          <Card>
            <Flex vertical align="center" gap={12}>
              <UserAvatar name={watchedName || profile.name} src={watch('profileImage')} size={96} />
              <Typography.Title level={4} style={{ margin: 0 }}>
                {watchedName || profile.name}
              </Typography.Title>
              <RoleBadge role={profile.role} />
              <Typography.Text type="secondary">{profile.email}</Typography.Text>

              <Statistic
                title="Current age"
                value={liveAge ?? '—'}
                suffix={liveAge !== null ? 'years' : undefined}
              />

              <Descriptions
                column={1}
                size="small"
                style={{ width: '100%', marginTop: 8 }}
                items={[
                  {
                    key: 'joined',
                    label: 'Member since',
                    children: new Date(profile.createdAt).toLocaleDateString(),
                  },
                  {
                    key: 'workspace',
                    label: 'Workspace',
                    children: profile.familyId ? 'Joined' : 'Not created yet',
                  },
                ]}
              />
            </Flex>
          </Card>
        </Col>

        {/* Edit form */}
        <Col xs={24} lg={16}>
          <Card title="Edit profile">
            <Form
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit((values) =>
                updateMutation.mutate(toPayload(values), {
                  onSuccess: () => void message.success('Profile updated'),
                  onError: (error) => void message.error(error.message),
                }),
              )}
            >
              <AvatarUpload
                control={control}
                name="profileImage"
                displayName={watchedName || profile.name}
              />

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <ControlledInput control={control} name="name" label="Full name" required />
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
                  <ControlledDatePicker
                    control={control}
                    name="dateOfBirth"
                    label="Date of birth"
                    placeholder="Select date"
                    disableFuture
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <ControlledSelect
                    control={control}
                    name="gender"
                    label="Gender"
                    options={GENDER_OPTIONS}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <ControlledSelect
                    control={control}
                    name="country"
                    label="Country"
                    options={COUNTRY_OPTIONS}
                    showSearch
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <ControlledSelect
                    control={control}
                    name="timezone"
                    label="Timezone"
                    options={TIMEZONE_OPTIONS}
                    showSearch
                    allowClear
                  />
                </Col>
              </Row>

              <Flex justify="flex-end">
                <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                  Save changes
                </Button>
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
