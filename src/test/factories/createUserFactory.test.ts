import { describe, it, expect } from 'vitest';
import { createUser } from './createUserFactory';

describe('createTestUser', () => {
  it('should create a user with role employee', async () => {
    const user = await createUser();
    expect(user.id).toBeDefined();
    expect(user.role.name).toBe('employee');
  });
});
