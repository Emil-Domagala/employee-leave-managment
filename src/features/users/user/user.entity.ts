export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  salary: number;
  role_id: string;
  status: 'active' | 'inactive';
  password: string;
}
