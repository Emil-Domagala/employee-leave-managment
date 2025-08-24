import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { Pool } from 'pg';
import { createClient, RedisClientType } from 'redis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TestContainers {
  pgContainer: StartedTestContainer;
  redisContainer: StartedTestContainer;
  pgPool: Pool;
  redisClient: RedisClientType;
}

export const setupTestContainers = async (): Promise<TestContainers> => {
  // -------- Postgres --------
  const pgContainer = await new GenericContainer('postgres:15')
    .withEnvironment({
      POSTGRES_DB: 'testdb',
      POSTGRES_USER: 'testuser',
      POSTGRES_PASSWORD: 'testpass',
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
    .start();

  const pgPort = pgContainer.getMappedPort(5432);
  const pgHost = pgContainer.getHost();

  const pgPool = new Pool({
    host: pgHost,
    port: pgPort,
    user: 'testuser',
    password: 'testpass',
    database: 'testdb',
  });

  // -------- Redis --------
  const redisContainer = await new GenericContainer('redis:latest')
    .withExposedPorts(6379)
    .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
    .start();

  const redisPort = redisContainer.getMappedPort(6379);
  const redisHost = redisContainer.getHost();

  const redisClient: RedisClientType = createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  await pgPool.query(schemaSql);

  return { pgContainer, redisContainer, pgPool, redisClient };
};

export const stopTestContainers = async (containers: TestContainers) => {
  await Promise.all([
    containers.pgContainer.stop(),
    containers.redisContainer.stop(),
    containers.pgPool.end(),
    containers.redisClient.quit(),
  ]);
};
