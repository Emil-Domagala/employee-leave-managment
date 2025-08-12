import { ConfigError } from '../errors/configError';

export const getEnvNumber = (key: string): number => {
  const val = process.env[key];
  if (!val) throw new ConfigError(`Missing env var: ${key}`);
  const num = Number(val);
  if (isNaN(num)) throw new ConfigError(`Invalid number for env var: ${key}`);
  return num;
};

export const getEnvString = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new ConfigError(`Missing env var: ${key}`);
  return val;
};
