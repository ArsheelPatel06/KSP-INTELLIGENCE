import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const existing = await prisma.employee.findFirst({
    where: {
      kgid: "admin",
    },
  });

  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  await prisma.employee.create({
    data: {
      kgid: "admin",
      firstName: "System Administrator",
      passwordHash,
      role: "SUPER_ADMIN",
      active: true,
      tokenVersion: 0,
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });