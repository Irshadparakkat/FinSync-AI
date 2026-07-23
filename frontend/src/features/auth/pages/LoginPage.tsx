import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';
import { ApiError } from '@/lib/api-client';
import { useLogin } from '../hooks/use-auth';
import type { LoginFormValues } from '../validation/auth.schemas';
import { loginSchema } from '../validation/auth.schemas';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const from = (location.state as { from?: string } | null)?.from;
        navigate(from ?? ROUTES.DASHBOARD, { replace: true });
      },
    });
  });

  const apiError = loginMutation.error instanceof ApiError ? loginMutation.error.message : null;

  return (
    <Card style={{ width: '100%', maxWidth: 400 }}>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Sign in
      </Typography.Title>

      {apiError && (
        <Alert type="error" showIcon message={apiError} style={{ marginBottom: 16 }} />
      )}

      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
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
              <Input.Password {...field} placeholder="Your password" size="large" />
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loginMutation.isPending}
        >
          Sign in
        </Button>
      </Form>

      <Typography.Paragraph style={{ textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
        No account yet? <Link to={ROUTES.REGISTER}>Create one</Link>
      </Typography.Paragraph>
    </Card>
  );
}
