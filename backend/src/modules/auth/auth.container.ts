import { AuthController } from './controllers/auth.controller';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { AuthService } from './services/auth.service';

import { CatalystService } from './services/catalyst.service';

export const authRepository = new PrismaAuthRepository();
export const authService = new AuthService(authRepository);
export const catalystService = new CatalystService();
export const authController = new AuthController(authService, catalystService);
