import { z } from 'zod';
import { LeaveRequestStatus } from '../leaveRequest.entity';

export const updateLeaveRequestStatusSchema = z.object({
  status: z.enum(LeaveRequestStatus),
});

export type UpdateLeaveRequestStatusBody = z.infer<
  typeof updateLeaveRequestStatusSchema
>;
