import { beforeAll, afterAll, beforeEach } from 'vitest';
import { startTestDB, stopTestDB, TestDataSource } from './setupTestDB.js';

beforeAll(async () => {
  await startTestDB();
});

beforeEach(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.synchronize(true); // reset schema before each test
  }
});

afterAll(async () => {
  await stopTestDB();
});
