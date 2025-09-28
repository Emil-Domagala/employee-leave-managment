import './env';
import 'reflect-metadata';

import app from './app';

import { getEnvNumber } from './common/utils/getEnv';
import redisClient from './config/redisClient';
import { applySchema, testConnection } from './config/db';
import { seedAdmin } from './db/seedAdmin';

const start = async () => {
  const PORT = getEnvNumber('PORT');

  try {
    // main db
    await testConnection();
    await applySchema();
    await seedAdmin();

    // redis
    await redisClient.connect();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
