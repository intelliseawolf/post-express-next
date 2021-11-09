import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");
  const hashPassword = await bcrypt.hash("123123", 10);

  await prisma.$connect();
  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: hashPassword,
      firstname: "admin",
      lastname: "super",
      role: "admin",
      status: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
