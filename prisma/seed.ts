import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "luvotest@cinevault.com";
  const password = "Test12345!";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Luvo Test",
      password: hashedPassword,
    },
    create: {
      name: "Luvo Test",
      email,
      password: hashedPassword,
    },
  });

  console.log("✅ CineVault test account ready");
  console.log("Email:", email);
  console.log("Password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });