import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

async function runResetPipeline() {
  console.log("==================================================");
  console.log("🔄 StudyFlow Database Reset & Seeding CLI Pipeline");
  console.log("==================================================");

  try {
    console.log("1. Synchronizing Prisma schema to PostgreSQL...");
    execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

    console.log("2. Generating fresh Prisma Client bindings...");
    execSync("npx prisma generate", { stdio: "inherit" });

    console.log("3. Executing automated Faker seed pipeline...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

    // Verify record counts
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const taskCount = await prisma.studyTask.count();
    const goalCount = await prisma.academicGoal.count();
    const sessionCount = await prisma.studySession.count();
    const txCount = await prisma.transaction.count();
    const auditCount = await prisma.auditLog.count();
    const emailLogCount = await prisma.emailDeliveryLog.count();

    console.log("\n==================================================");
    console.log("📊 PostgreSQL Database Verification Summary");
    console.log("==================================================");
    console.log(`- Users:              ${userCount}`);
    console.log(`- Courses:            ${courseCount}`);
    console.log(`- Study Tasks:        ${taskCount}`);
    console.log(`- Academic Goals:     ${goalCount}`);
    console.log(`- Study Sessions:     ${sessionCount}`);
    console.log(`- Transactions:       ${txCount}`);
    console.log(`- Audit Logs:         ${auditCount}`);
    console.log(`- Email Delivery Logs: ${emailLogCount}`);
    console.log("==================================================");
    console.log("✅ Database reset & seeding pipeline completed successfully!\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Reset pipeline encountered an error:", error);
    process.exit(1);
  }
}

runResetPipeline();
