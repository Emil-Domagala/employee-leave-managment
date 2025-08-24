import { z } from 'zod';

export const CreateUserDto = z.object({
  id: z.uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.email(),
  salary: z.coerce.number().nonnegative(),
  role_id: z.uuid(),
  status: z.enum(['active', 'inactive']),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
