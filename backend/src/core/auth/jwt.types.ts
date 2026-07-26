import type { Permission } from './permissions';
import type { Role } from './roles';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  permissions: Permission[];
  employeeId?: string;
  tokenVersion: number;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  familyId: string;
  tokenVersion: number;
  type: 'refresh';
}
