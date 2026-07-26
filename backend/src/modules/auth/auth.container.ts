import { AuthController } from './controllers/auth.controller';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { AuthService } from './services/auth.service';

export const authRepository = new PrismaAuthRepository();
export const authService = new AuthService(authRepository);
export const authController = new AuthController(authService);
