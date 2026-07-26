import type { Permission } from './permissions';
import type { Role } from './roles';

export interface AuthContext {
  userId: string;
  employeeId?: string;
  role: Role;
  permissions: Permission[];
  tokenVersion: number;
}
