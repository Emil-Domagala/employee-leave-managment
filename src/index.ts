import './env';
import 'reflect-metadata';

import app from './app';
import { AppDataSource } from './dataSource';
import { getEnvNumber } from './common/utils/getEnv';
import { seedAdmin, seedRoles } from './seed/seed';
import redisClient from './redisClient';

const start = async () => {
  const PORT = getEnvNumber('PORT');

  try {
    await AppDataSource.initialize();
    await redisClient.connect();
    await seedRoles();
    await seedAdmin();
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
