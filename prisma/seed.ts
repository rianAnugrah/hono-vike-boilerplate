import { PrismaClient } from "@prisma/client";

import { seedUsers } from "./seed-users";


const prisma = new PrismaClient();

async function main() {
  // Cek apakah sudah pernah di-seed
  const existingUser = await prisma.users.findFirst();
  if (existingUser) {
    console.log("✅ Seed already exists. Skipping...");
    return;
  }

  console.log("🌱 Seeding database...");
  await seedUsers();
  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
