export interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  days_allocated: number;
  days_taken: number;
  days_remaining: number;
}
