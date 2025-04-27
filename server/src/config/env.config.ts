import { getEnv } from '@utils/get-env';

export const envConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '5001'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
});

export const Env = envConfig();
