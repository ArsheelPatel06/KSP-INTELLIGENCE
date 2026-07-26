import type { AuthContext } from '../auth/auth-context.interface';

export interface RequestContext {
  requestId: string;
  user?: AuthContext;
  unitId?: number;
  districtId?: number;
}
