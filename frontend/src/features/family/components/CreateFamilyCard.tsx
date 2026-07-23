import { Alert, Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import { ApiError } from '@/lib/api-client';
import { useCreateFamily } from '../hooks/use-family';
import type { FamilyFormValues } from '../validation/family.schemas';
import { FamilyForm } from './FamilyForm';

const DEFAULTS: FamilyFormValues = {
  familyName: '',
  currency: 'USD',
  country: 'AE',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

/**
 * Onboarding card shown while the user has no workspace yet - creating
 * one unlocks every tenant-scoped module.
 */
export function CreateFamilyCard() {
  const createMutation = useCreateFamily();
  const apiError = createMutation.error instanceof ApiError ? createMutation.error.message : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: 480, margin: '48px auto 0' }}
    >
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Create your family workspace
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Your workspace is the private home for your family's finances — members, income,
          expenses, goals and insights all live inside it.
        </Typography.Paragraph>

        {apiError && (
          <Alert type="error" showIcon message={apiError} style={{ marginBottom: 16 }} />
        )}

        <FamilyForm
          defaultValues={DEFAULTS}
          onSubmit={(values) => createMutation.mutate(values)}
          submitLabel="Create workspace"
          submitting={createMutation.isPending}
        />
      </Card>
    </motion.div>
  );
}
