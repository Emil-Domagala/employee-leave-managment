import { beforeAll, afterAll } from 'vitest';
import { createTestApp, stopTestApp, app, containers } from '../app-test';

export { app, containers };

beforeAll(async () => {
  // Start test containers and app
  await createTestApp();
}, 60000);

afterAll(async () => {
  // Stop containers and clean up
  await stopTestApp();
}, 30000);
