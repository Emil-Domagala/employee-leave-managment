import '../env';
import 'reflect-metadata';
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { startTestDB, stopTestDB, TestDataSource } from './setupTestDB.js';
import { AppDataSource } from '../data-source.js';

beforeAll(async () => {
  await startTestDB();
  Object.assign(AppDataSource, TestDataSource);
});

beforeEach(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.synchronize(true); // reset schema before each test
  }
});

afterAll(async () => {
  await stopTestDB();
});
