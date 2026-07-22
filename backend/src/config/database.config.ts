import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  uri: string;
}

export const DATABASE_CONFIG_KEY = 'database';

export default registerAs(DATABASE_CONFIG_KEY, (): DatabaseConfig => ({
  uri: process.env.MONGODB_URI ?? '',
}));
