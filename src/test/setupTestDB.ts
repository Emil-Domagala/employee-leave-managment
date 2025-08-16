import 'reflect-metadata';

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Role } from '../user/role.entity.js';

let container: StartedPostgreSqlContainer;
export let TestDataSource: DataSource;

export async function startTestDB() {
  container = await new PostgreSqlContainer('postgres:17')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  TestDataSource = new DataSource({
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    synchronize: true,
    dropSchema: true,
    entities: [User, Role],
  });

  await TestDataSource.initialize();
}

export async function stopTestDB() {
  if (TestDataSource?.isInitialized) {
    await TestDataSource.destroy();
  }
  if (container) {
    await container.stop();
  }
}
