import { permissionsForRole } from '../../../core/auth/permissions';
import type { AuthenticatedUser, AuthUser } from '../types/auth.types';

export function toAuthenticatedUser(user: AuthUser): AuthenticatedUser {
  return {
    id: user.id.toString(),
    kgid: user.kgid,
    firstName: user.firstName,
    role: user.role,
    permissions: permissionsForRole(user.role),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
  };
}
