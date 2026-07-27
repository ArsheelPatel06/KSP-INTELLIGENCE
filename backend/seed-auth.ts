import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding authentication data for an employee...');

  // Try to find an existing employee
  let employee = await prisma.employee.findFirst({
    where: { active: true, kgid: { not: null } }
  });

  if (!employee) {
    console.log('No active employee with a kgid found. Creating a dummy employee...');
    employee = await prisma.employee.create({
      data: {
        kgid: 'KSP-12345',
        firstName: 'Test',
        active: true,
      }
    });
  }

  const plainPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const updatedEmployee = await prisma.employee.update({
    where: { id: employee.id },
    data: {
      passwordHash,
      role: 'SUPER_ADMIN',
      active: true
    }
  });

  console.log('\n✅ Successfully configured Employee for login:');
  console.log('------------------------------------------------');
  console.log(`Username (KGID): ${updatedEmployee.kgid}`);
  console.log(`Password:        ${plainPassword}`);
  console.log(`Employee Name:   ${updatedEmployee.firstName}`);
  console.log(`Role:            ${updatedEmployee.role}`);
  console.log('------------------------------------------------\n');
}

main()
  .catch(e => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
