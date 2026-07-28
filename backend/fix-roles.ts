import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fix() {
  await prisma.employee.updateMany({
    where: { role: 'Admin' },
    data: { role: 'SUPER_ADMIN' }
  });
  await prisma.employee.updateMany({
    where: { role: 'Investigator' },
    data: { role: 'INSPECTOR' }
  });
  await prisma.employee.updateMany({
    where: { role: 'Analyst' },
    data: { role: 'CRIME_ANALYST' }
  });
  await prisma.employee.updateMany({
    where: { role: 'Supervisor' },
    data: { role: 'SP' }
  });
  console.log("Roles fixed!");
}
fix().finally(() => prisma.$disconnect());
