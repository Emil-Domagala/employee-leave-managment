import { O } from 'vitest/dist/chunks/reporters.d.BFLkQcL6';
import { Role } from '../role/role.entity';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  status: UserStatus;
  compensation_history_id?: string;
  password: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface UserWithRole extends Omit<User, 'role_id'> {
  role: Role;
}
export interface UserWithSalary extends Omit<User, 'compensation_history_id'> {
  salary: number;
}
