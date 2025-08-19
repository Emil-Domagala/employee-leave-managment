import { createClient } from 'redis';
import { getEnvString } from './common/utils/getEnv';

const redisClient = createClient({
  url: getEnvString('REDIS_URL'),
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;
