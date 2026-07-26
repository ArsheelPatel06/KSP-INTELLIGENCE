import type { AuthContext } from '../core/auth/auth-context.interface';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AuthContext;
    }
  }
}

export {};
