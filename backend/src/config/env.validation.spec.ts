import { Environment, validateEnv } from './env.validation';

describe('validateEnv', () => {
  const validConfig = {
    NODE_ENV: 'development',
    PORT: '3000',
    API_PREFIX: 'api',
    MONGODB_URI: 'mongodb://localhost:27017/finsync-test',
  };

  it('accepts a valid configuration and coerces types', () => {
    const result = validateEnv(validConfig);

    expect(result.NODE_ENV).toBe(Environment.Development);
    expect(result.PORT).toBe(3000);
    expect(result.MONGODB_URI).toBe(validConfig.MONGODB_URI);
  });

  it('applies defaults for optional variables', () => {
    const result = validateEnv({ MONGODB_URI: validConfig.MONGODB_URI });

    expect(result.NODE_ENV).toBe(Environment.Development);
    expect(result.PORT).toBe(3000);
    expect(result.API_PREFIX).toBe('api');
  });

  it('throws when MONGODB_URI is missing', () => {
    const withoutUri: Record<string, unknown> = { ...validConfig };
    delete withoutUri.MONGODB_URI;
    expect(() => validateEnv(withoutUri)).toThrow(/MONGODB_URI/i);
  });

  it('throws for an invalid NODE_ENV', () => {
    expect(() => validateEnv({ ...validConfig, NODE_ENV: 'staging' })).toThrow(
      /Environment validation failed/,
    );
  });

  it('throws for an out-of-range port', () => {
    expect(() => validateEnv({ ...validConfig, PORT: '99999' })).toThrow(
      /Environment validation failed/,
    );
  });
});
