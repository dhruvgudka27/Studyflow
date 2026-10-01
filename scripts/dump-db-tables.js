import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== SELECT * FROM \"User\" ===");
  const users = await prisma.user.findMany({ take: 7 });
  console.table(users.map(u => ({ id: u.id.slice(0, 16) + "...", name: u.name, email: u.email, role: u.role, createdAt: u.createdAt.toISOString() })));

  console.log("\n=== SELECT * FROM \"StudyTask\" ===");
  const tasks = await prisma.studyTask.findMany({ take: 7, include: { course: true } });
  console.table(tasks.map(t => ({ id: t.id.slice(0, 12) + "...", title: t.title.slice(0, 30) + "...", course: t.course.code, priority: t.priority, status: t.status, minutes: t.estimatedMinutes })));

  console.log("\n=== SELECT * FROM \"EmailDeliveryLog\" ===");
  const emails = await prisma.emailDeliveryLog.findMany({ take: 5 });
  console.table(emails.map(e => ({ id: e.id.slice(0, 12) + "...", recipient: e.recipientEmail, template: e.templateName, status: e.status, resendId: e.resendMessageId?.slice(0, 20) || "none" })));
}

main().finally(() => prisma.$disconnect());
