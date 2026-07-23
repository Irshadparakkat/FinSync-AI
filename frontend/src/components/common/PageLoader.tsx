import { Flex, Spin } from 'antd';

/** Full-height centered spinner - Suspense fallback for lazy routes. */
export function PageLoader() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
      <Spin size="large" />
    </Flex>
  );
}
