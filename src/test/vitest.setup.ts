import { beforeAll, afterAll } from 'vitest';
import {
  setupTestContainers,
  stopTestContainers,
} from '../config/testDB';

export let containers: Awaited<ReturnType<typeof setupTestContainers>>;

beforeAll(async () => {
  containers = await setupTestContainers();
});

afterAll(async () => {
  await stopTestContainers(containers);
});

