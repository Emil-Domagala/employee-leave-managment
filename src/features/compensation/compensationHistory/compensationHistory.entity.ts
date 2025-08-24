export interface CompensationHistory {
  id: string;
  user_id: string;
  effective_from: Date;
  effective_to: Date | null;
  base_salary: number;
  salary_period: 'monthly' | 'annual';
  currency: string;
  created_at: Date;
}
