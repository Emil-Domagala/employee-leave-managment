import { ConfigError } from '../errors/configError';

/**
 * Attempts to extract env and parse into number
 * @throws {ConfigError} if no env or couldnt parse to number
 */
export const getEnvNumber = (key: string): number => {
  const val = process.env[key];
  if (!val) throw new ConfigError(`Missing env var: ${key}`);
  const num = Number(val);
  if (isNaN(num)) throw new ConfigError(`Invalid number for env var: ${key}`);
  return num;
};

/**
 * Attempts to extract env
 * @throws {ConfigError} if no env
 */
export const getEnvString = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new ConfigError(`Missing env var: ${key}`);
  return val;
};
