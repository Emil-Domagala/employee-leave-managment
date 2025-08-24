import { Pool } from 'pg';
import { CompensationHistory } from './compensationHistory.entity';

export class CompensationHistoryRepository {
  constructor(private pool: Pool) {}
  async getById(id: string): Promise<CompensationHistory | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM compensation_history WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async create(ch: {
    user_id: string;
    effective_from: Date;
    effective_to: Date | null;
    base_salary: number;
    salary_period: 'monthly' | 'annual';
    currency: string;
    created_at: Date;
  }): Promise<CompensationHistory> {
    const sql = `INSERT INTO compensation_history
                   (user_id, effective_from, effective_to, base_salary, salary_period, currency, created_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      ch.user_id,
      ch.effective_from,
      ch.effective_to,
      ch.base_salary,
      ch.salary_period,
      ch.currency,
      ch.created_at,
    ]);
    return rows[0];
  }
}
