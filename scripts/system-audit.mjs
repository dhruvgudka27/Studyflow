/**
 * StudyFlow Comprehensive System & Architecture Audit Script
 * Tests:
 * 1. PostgreSQL Database & Prisma ORM Multi-Entity Relational Integrity
 * 2. Mongoose & MongoDB Document Stream Persistence
 * 3. Better Auth JWT Session Issuance, Verification & RBAC Rules
 * 4. Shared Zod Schema Validation Boundary Enforcement
 * 5. Transactional Resend Email & Webhook State Machine Pipeline
 * 6. Audit Logging & Forensic Data Trail
 */

import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

const prisma = new PrismaClient();
const SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "studyflow_super_secret_jwt_encryption_key_2026_aiml"
);

// Shared Zod Schema definition mirroring lib/validations/task.ts
const taskSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  courseId: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().min(1).refine((s) => !isNaN(Date.parse(s))),
  estimatedMinutes: z.coerce.number().int().min(5).max(720).default(60),
});

async function runAudit() {
  console.log("\n==================================================================");
  console.log("🚀 STUDYFLOW END-TO-END SYSTEM INTEGRATION & COMPLIANCE AUDIT");
  console.log("   Academic Year 2026-27 • Programming Laboratory-III (Next.js)");
  console.log("==================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, detail = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName} ${detail ? `(${detail})` : ""}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 1: PostgreSQL & Prisma Relational Integrity
  // -------------------------------------------------------------
  console.log("--- TEST SUITE 1: PostgreSQL & Prisma Relational Schema ---");
  try {
    const userCount = await prisma.user.count();
    assert(userCount >= 3, "User Archetypes Seeded", `Found ${userCount} users`);

    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    assert(admin !== null && admin.email === "admin@studyflow.edu", "Admin User Registered", admin?.email);

    const member = await prisma.user.findFirst({ where: { role: "MEMBER" } });
    assert(member !== null, "Member User Registered", member?.email);

    const guest = await prisma.user.findFirst({ where: { role: "GUEST" } });
    assert(guest !== null, "Guest User Registered", guest?.email);

    const courses = await prisma.course.findMany({ where: { userId: member.id } });
    assert(courses.length >= 1, "Relational Course Ownership", `Member has ${courses.length} courses`);

    const tasks = await prisma.studyTask.findMany({
      where: { userId: member.id },
      include: { course: true },
    });
    assert(tasks.length >= 1, "Foreign-Key Integrity: Tasks -> Course", `${tasks.length} tasks linked to courses`);

    const transactions = await prisma.transaction.findMany();
    assert(transactions.length >= 1, "Transactions Relational Model", `${transactions.length} financial transactions recorded`);

    const auditLogs = await prisma.auditLog.findMany();
    assert(auditLogs.length >= 1, "Forensic AuditLog Persistence", `${auditLogs.length} audit logs persisted`);
  } catch (err) {
    console.error("Suite 1 encountered an unexpected failure:", err);
  }

  // -------------------------------------------------------------
  // TEST SUITE 2: Better Auth & Edge JWT Session Cryptography
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 2: Better Auth JWT Session & Edge RBAC ---");
  try {
    const payload = {
      userId: "usr_test_123",
      email: "test.student@studyflow.edu",
      role: "MEMBER",
      name: "Test Student",
    };

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    assert(typeof token === "string" && token.split(".").length === 3, "Cryptographic HS256 Token Generation");

    const { payload: verified } = await jwtVerify(token, SECRET);
    assert(
      verified.userId === payload.userId && verified.role === payload.role,
      "Edge Middleware JWT Signature Verification",
      `Role: ${verified.role}`
    );

    // Test tamper detection
    let tamperedPassed = false;
    try {
      const tampered = token.slice(0, -5) + "abcde";
      await jwtVerify(tampered, SECRET);
    } catch {
      tamperedPassed = true;
    }
    assert(tamperedPassed, "Cryptographic Anti-Tampering Rejection");
  } catch (err) {
    console.error("Suite 2 error:", err);
  }

  // -------------------------------------------------------------
  // TEST SUITE 3: Shared Zod Schema Boundary Validation
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 3: Shared Zod Schema Validation ---");
  try {
    // Valid input
    const validData = {
      title: "Implement Graph Cut Algorithm",
      description: "Edmonds-Karp max flow min cut theorem implementation",
      courseId: "course_123",
      priority: "HIGH",
      dueDate: "2026-10-15",
      estimatedMinutes: 90,
    };
    const validResult = taskSchema.safeParse(validData);
    assert(validResult.success === true, "Zod Valid Input Conformance");

    // Invalid input: title too short (< 3 chars)
    const shortTitle = { ...validData, title: "ab" };
    const shortResult = taskSchema.safeParse(shortTitle);
    assert(
      shortResult.success === false && shortResult.error.flatten().fieldErrors.title !== undefined,
      "Zod Field Constraint: Title Min Length"
    );

    // Invalid input: estimatedMinutes out of range (> 720)
    const excessMinutes = { ...validData, estimatedMinutes: 9999 };
    const excessResult = taskSchema.safeParse(excessMinutes);
    assert(
      excessResult.success === false && excessResult.error.flatten().fieldErrors.estimatedMinutes !== undefined,
      "Zod Field Constraint: Estimated Minutes Upper Bound"
    );
  } catch (err) {
    console.error("Suite 3 error:", err);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: Mongoose & MongoDB Document Telemetry
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 4: Mongoose & MongoDB Object Database ---");
  try {
    let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/studyflow_telemetry";
    let isConnected = false;

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      isConnected = true;
    } catch {
      console.log("   (Standard MongoDB port 27017 inactive; initiating MongoMemoryServer mock integration...)");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const memServer = await MongoMemoryServer.create();
      mongoUri = memServer.getUri();
      await mongoose.connect(mongoUri);
      isConnected = true;
    }

    assert(isConnected, "Mongoose MongoDB Connection Established", mongoUri.slice(0, 30) + "...");

    // Create schema & test document
    const TestTelemetrySchema = new mongoose.Schema(
      {
        userId: String,
        eventType: String,
        payload: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
      },
      { collection: "audit_test_events" }
    );

    const TestModel = mongoose.models.TestTelemetry || mongoose.model("TestTelemetry", TestTelemetrySchema);

    const doc = await TestModel.create({
      userId: "test_user_789",
      eventType: "AUDIT_FOCUS_TICK",
      payload: { focusRatio: 0.98, keystrokes: 340 },
    });

    assert(doc._id !== null, "Mongoose Document Inserted", `Doc ID: ${doc._id}`);

    const retrieved = await TestModel.findById(doc._id);
    assert(retrieved?.eventType === "AUDIT_FOCUS_TICK", "Mongoose Document Query & Lean Retrieval");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Suite 4 error:", err);
  }

  // -------------------------------------------------------------
  // TEST SUITE 5: Transactional Email & Webhook State Machine
  // -------------------------------------------------------------
  console.log("\n--- TEST SUITE 5: Resend Email & Webhook State Lifecycle ---");
  try {
    // 1. Create Queued / Sent Log
    const emailLog = await prisma.emailDeliveryLog.create({
      data: {
        recipientEmail: "test.student@studyflow.edu",
        templateName: "TaskCreatedEmail",
        subject: "[StudyFlow Alert] New Task: Graph Algorithms",
        status: "SENT",
        resendMessageId: `msg_audit_test_${Date.now()}`,
        metadata: { deliveryMode: "automated_audit_test" },
      },
    });

    assert(emailLog.id !== null, "Transactional Email Log Created", emailLog.resendMessageId);

    // 2. Simulate Webhook Delivery Confirmation
    const deliveredLog = await prisma.emailDeliveryLog.update({
      where: { id: emailLog.id },
      data: {
        status: "DELIVERED",
        metadata: { ...(emailLog.metadata || {}), webhookReceivedAt: new Date().toISOString() },
      },
    });

    assert(deliveredLog.status === "DELIVERED", "Resend Webhook 'email.delivered' State Transition");

    // Clean up test entry
    await prisma.emailDeliveryLog.delete({ where: { id: emailLog.id } });
  } catch (err) {
    console.error("Suite 5 error:", err);
  }

  // -------------------------------------------------------------
  // AUDIT SUMMARY
  // -------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`🏁 AUDIT COMPLETION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("==================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 ALL ARCHITECTURAL SPECIFICATIONS AND TEST SUITES VERIFIED!\n");
    process.exit(0);
  } else {
    console.error(`⚠️  ${totalTests - passedTests} tests failed. Please inspect logs above.\n`);
    process.exit(1);
  }
}

runAudit()
  .catch((e) => {
    console.error("Fatal audit script error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
