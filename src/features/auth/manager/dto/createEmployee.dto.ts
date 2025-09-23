import { z } from 'zod';
import { UserStatus } from '../../../../common/domains/users/user/user.entity';

export const createEmployeeSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.email(),
  salary: z.coerce.number().nonnegative(),
  status: z.enum(UserStatus),
});

export type CreateEmployeeBody = z.infer<typeof createEmployeeSchema>;
