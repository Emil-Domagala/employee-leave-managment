import { z } from 'zod';

export const createLeaveRequestSchema = z.object({
  leave_type_id: z.string().uuid(),
  start_date: z.string().transform((s) => new Date(s)),
  end_date: z.string().transform((s) => new Date(s)),
});

export type CreateLeaveRequestBody = z.infer<typeof createLeaveRequestSchema>;
