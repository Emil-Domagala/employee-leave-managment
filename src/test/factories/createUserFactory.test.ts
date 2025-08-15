import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createUser } from './createUserFactory';
import { startTestDB, stopTestDB } from '../setupTestDB';

describe('createTestUser', () => {
  beforeAll(async () => {
    await startTestDB();
  });

  afterAll(async () => {
    await stopTestDB();
  });

  it('should create a user with role employee', async () => {
    const user = await createUser();
    expect(user.id).toBeDefined();
    expect(user.role.name).toBe('employee');
  });
});
