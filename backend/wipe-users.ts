import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function wipe() {
  await prisma.employee.deleteMany({});
  console.log('All users wiped from database.');
}
wipe().finally(() => prisma.$disconnect());
