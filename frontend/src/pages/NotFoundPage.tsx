import { Button, Result } from 'antd';
import { Link } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="This page does not exist."
      extra={
        <Link to={ROUTES.HOME}>
          <Button type="primary">Back home</Button>
        </Link>
      }
    />
  );
}
