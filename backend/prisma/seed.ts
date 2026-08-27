import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/db/generated/prisma/client.ts";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Seed Admin
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@banksahayak.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "System Admin",
      email: adminEmail,
      passwordHash: adminHash,
    },
  });
  console.log(`✅ Admin: ${admin.email} (password: ${adminPassword})`);

  // Seed Team Members
  const teamEmail = process.env.TEAM_SEED_EMAIL || "team1@banksahayak.com";
  const teamPassword = process.env.TEAM_SEED_PASSWORD || "team123";
  const teamHash = await bcrypt.hash(teamPassword, 10);

  const team1 = await prisma.teamMember.upsert({
    where: { email: teamEmail },
    update: {},
    create: {
      name: "Team Agent 1",
      email: teamEmail,
      passwordHash: teamHash,
    },
  });
  console.log(`✅ Team Member: ${team1.email} (password: ${teamPassword})`);

  // Seed a second team member
  const team2 = await prisma.teamMember.upsert({
    where: { email: "team2@banksahayak.com" },
    update: {},
    create: {
      name: "Team Agent 2",
      email: "team2@banksahayak.com",
      passwordHash: teamHash,
    },
  });
  console.log(`✅ Team Member: ${team2.email} (password: ${teamPassword})`);

  console.log("\n🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
