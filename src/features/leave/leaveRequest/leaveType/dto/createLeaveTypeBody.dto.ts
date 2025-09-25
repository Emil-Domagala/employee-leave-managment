import { z } from 'zod';

export const createLeaveTypeBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_paid: z.boolean(),
  annual_allowance: z
    .number()
    .int()
    .nonnegative('Annual allowance must be 0 or more'),
});

export type CreateLeaveTypeBodyDto = z.infer<typeof createLeaveTypeBodySchema>;
