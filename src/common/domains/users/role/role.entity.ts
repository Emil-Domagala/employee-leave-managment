export interface Role {
  id: string;
  name: RoleName;
}

export enum RoleName {
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  ADMIN = 'administrator',
}

export const RolePriority: Record<RoleName, number> = {
  [RoleName.EMPLOYEE]: 1,
  [RoleName.MANAGER]: 2,
  [RoleName.ADMIN]: 3,
};
