export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: Date;
  end_date: Date;
  total_days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approver_id: string;
  request_date: Date;
  decision_date: Date | null;
}
