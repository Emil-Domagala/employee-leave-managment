import { Role } from '../role/role.entity';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  status: UserStatus;
  salary: number;
  password: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface UserWithRole extends Omit<User, 'role_id'> {
  role: Role;
}
