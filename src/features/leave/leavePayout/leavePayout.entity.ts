export interface LeavePayout {
  id: string;
  leave_request_id: string;
  employee_id: string;
  calculated_on: Date;
  amount: number;
  currency: string;
  compensation_history_id: string;
}
