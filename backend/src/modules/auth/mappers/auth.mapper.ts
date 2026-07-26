import { permissionsForRole } from '../../../core/auth/permissions';
import type { AuthenticatedUser, AuthUser } from '../types/auth.types';

export function toAuthenticatedUser(user: AuthUser): AuthenticatedUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId?.toString() ?? null,
    permissions: permissionsForRole(user.role),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
  };
}
