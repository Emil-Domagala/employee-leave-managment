import { z } from 'zod';
import { SalaryPeriod } from '../domain/compensationHistory.entity';

export const compensationHistoryBodySchema = z.object({
  effective_from: z.coerce.date(),
  effective_to: z.coerce.date().nullable(),
  base_salary: z.number().positive(),
  salary_period: z.enum(SalaryPeriod),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter ISO code')
    .toUpperCase(),
  created_at: z.coerce.date(),
});
export type CompensationHistoryBody = z.infer<
  typeof compensationHistoryBodySchema
>;

export const compensationHistorySchema = z.object({
  user_id: z.string().uuid(),
  effective_from: z.coerce.date(),
  effective_to: z.coerce.date().nullable(),
  base_salary: z.number().positive(),
  salary_period: z.enum(SalaryPeriod),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter ISO code')
    .toUpperCase(),
  created_at: z.coerce.date(),
});
export type CreateCompensationHistoryDto = z.infer<
  typeof compensationHistorySchema
>;
