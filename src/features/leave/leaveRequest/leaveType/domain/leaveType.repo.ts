import { Pool } from 'pg';
import { LeaveType } from './leaveType.entity';
import { CreateLeaveTypeBodyDto } from '../dto/createLeaveTypeBody.dto';

export class LeaveTypesRepository {
  constructor(private pool: Pool) {}

  async getById(id: string): Promise<LeaveType | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_types WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  }

  async getAll(): Promise<LeaveType[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_types ORDER BY name ASC',
    );
    return rows;
  }

  async create(l: CreateLeaveTypeBodyDto): Promise<LeaveType> {
    const sql = `INSERT INTO leave_types (name, is_paid, annual_allowance)
                 VALUES ($1,$2,$3)
                 RETURNING *;`;

    const { rows } = await this.pool.query(sql, [
      l.name,
      l.is_paid,
      l.annual_allowance,
    ]);
    return rows[0];
  }

  async getByName(name: string): Promise<LeaveType | null> {
    const { rows } = await this.pool.query(
      'SELECT * FROM leave_types WHERE name = $1',
      [name],
    );
    return rows[0] ?? null;
  }

  async getLeaveTypeById(id: string): Promise<{
    id: string;
    name: string;
    is_paid: boolean;
    annual_allowance: number;
  } | null> {
    const sql = `SELECT * FROM leave_types WHERE id = $1`;
    const { rows } = await this.pool.query(sql, [id]);
    return rows[0] ?? null;
  }
}
