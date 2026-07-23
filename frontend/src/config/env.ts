/**
 * Typed, validated access to environment variables.
 * The only place `import.meta.env` is read - the rest of the app
 * imports `env`, so a missing variable fails loudly at startup
 * instead of surfacing as undefined behavior deep in a component.
 */

interface Env {
  apiBaseUrl: string;
  appName: string;
  isDev: boolean;
  isProd: boolean;
}

function required(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: Env = {
  apiBaseUrl: required('VITE_API_BASE_URL'),
  appName: (import.meta.env.VITE_APP_NAME as string | undefined) ?? 'FinSync AI',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
