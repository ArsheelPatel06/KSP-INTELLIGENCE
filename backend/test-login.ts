require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import { PrismaAuthRepository } from './src/modules/auth/repositories/prisma-auth.repository';
import { AuthService } from './src/modules/auth/services/auth.service';
import { CatalystService } from './src/modules/auth/services/catalyst.service';

const prisma = new PrismaClient();
const authRepo = new PrismaAuthRepository(prisma);
const catalyst = new CatalystService();
const authService = new AuthService(authRepo, catalyst);

async function test() {
  try {
    const res = await authService.login(
      { username: "123456", password: "TestPassword123!", deliveryMode: "body" },
      { ipAddress: "127.0.0.1", userAgent: "curl", requestId: "test" }
    );
    console.log("Success:", res.user.id);
  } catch (e: any) {
    console.error("Error during login:", e);
  }
  await prisma.$disconnect();
}
test();
