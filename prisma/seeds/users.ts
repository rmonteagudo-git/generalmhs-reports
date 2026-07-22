import type { PrismaClient } from "../../src/generated/prisma/client";
import { hashPassword } from "../../src/lib/password";

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await hashPassword("General@2026");

  await prisma.user.upsert({
    where: { email: "admin@generalreports.com" },
    update: {},
    create: {
      email: "admin@generalreports.com",
      name: "Admin General Mental Health",
      passwordHash,
    },
  });

  console.log("✓ users seeded");
}
