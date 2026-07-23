import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, App, Button, Card, Form, Input, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { ApiError } from '@/lib/api-client';
import { useRegister } from '../hooks/use-auth';
import type { RegisterFormValues } from '../validation/auth.schemas';
import { registerSchema } from '../validation/auth.schemas';

export function RegisterPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(({ name, email, password }) => {
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: (data) => {
          void message.success(data.message);
          navigate(ROUTES.LOGIN);
        },
      },
    );
  });

  const apiError =
    registerMutation.error instanceof ApiError ? registerMutation.error.message : null;

  return (
    <Card style={{ width: '100%', maxWidth: 400 }}>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Create your account
      </Typography.Title>

      {apiError && (
        <Alert type="error" showIcon message={apiError} style={{ marginBottom: 16 }} />
      )}

      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          label="Name"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="John Doe" size="large" />}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" placeholder="you@example.com" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Minimum 8 characters" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Repeat your password" size="large" />
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={registerMutation.isPending}
        >
          Create account
        </Button>
      </Form>

      <Typography.Paragraph style={{ textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
        Already registered? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </Typography.Paragraph>
    </Card>
  );
}
