import { PrismaClient, Role, TaskPriority, TaskStatus, GoalStatus, TransactionType, TransactionStatus, EmailEventType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting realistic relational seeding for StudyFlow...");

  // Clear existing records in proper foreign-key order
  await prisma.emailDeliveryLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.studyTask.deleteMany();
  await prisma.academicGoal.deleteMany();
  await prisma.course.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // Password hashes
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);
  const guestPasswordHash = await bcrypt.hash("Guest@123", 10);

  // 1. Create Core Role Archetypes
  const adminUser = await prisma.user.create({
    data: {
      name: "Dr. Eleanor Vance",
      email: "admin@studyflow.edu",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      emailVerified: new Date(),
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      name: "Dhruv Gudka",
      email: "member@studyflow.edu",
      passwordHash: studentPasswordHash,
      role: Role.MEMBER,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      emailVerified: new Date(),
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      name: "Prospective Student",
      email: "guest@studyflow.edu",
      passwordHash: guestPasswordHash,
      role: Role.GUEST,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      emailVerified: null,
    },
  });

  console.log(`👤 Created 3 core role users:`);
  console.log(`   - ADMIN:  admin@studyflow.edu  (Password: Admin@123)`);
  console.log(`   - MEMBER: member@studyflow.edu (Password: Student@123)`);
  console.log(`   - GUEST:  guest@studyflow.edu  (Password: Guest@123)`);

  // Additional realistic students
  const additionalStudents = [];
  for (let i = 0; i < 4; i++) {
    const student = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        passwordHash: studentPasswordHash,
        role: Role.MEMBER,
        image: faker.image.avatar(),
        emailVerified: new Date(),
      },
    });
    additionalStudents.push(student);
  }

  const allActiveStudents = [memberUser, ...additionalStudents];

  // 2. Define Academic Courses
  const defaultCourses = [
    {
      code: "DJS23AMD302L",
      title: "Full Stack Development Using Next.js",
      description: "App router architecture, server actions, state orchestration & production deployment",
      instructor: "Prof. S. R. Mehta",
      color: "#3b82f6", // Blue
      credits: 4,
      semester: "Sem V",
    },
    {
      code: "DJS23AMD301T",
      title: "Advanced Data Structures & Algorithms",
      description: "Graph heuristics, dynamic programming, network flow, and amortized complexity",
      instructor: "Dr. K. N. Kulkarni",
      color: "#8b5cf6", // Purple
      credits: 4,
      semester: "Sem V",
    },
    {
      code: "DJS23AMD303T",
      title: "Deep Learning & Neural Architectures",
      description: "CNNs, Transformer attention mechanisms, backpropagation optimization, and PyTorch",
      instructor: "Prof. P. H. Joshi",
      color: "#ec4899", // Pink
      credits: 3,
      semester: "Sem V",
    },
    {
      code: "DJS23AMD304T",
      title: "Distributed Cloud Systems & Edge",
      description: "CAP theorem, microservice consensus algorithms, serverless runtime, and edge CDN",
      instructor: "Dr. R. V. Patel",
      color: "#10b981", // Emerald
      credits: 3,
      semester: "Sem V",
    },
  ];

  // Populate courses for memberUser
  const createdCourses = [];
  for (const c of defaultCourses) {
    const course = await prisma.course.create({
      data: {
        ...c,
        userId: memberUser.id,
      },
    });
    createdCourses.push(course);
  }

  console.log(`📚 Populated ${createdCourses.length} academic courses for primary member.`);

  // 3. Populate StudyTasks for Member
  const taskTemplates = [
    {
      title: "Implement Next.js App Router Hydration Audit",
      description: "Audit client vs server boundaries, verify suppressHydrationWarning, profile LCP and CLS",
      priority: TaskPriority.URGENT,
      status: TaskStatus.IN_PROGRESS,
      daysOffset: 1,
      estimatedMinutes: 90,
      courseIndex: 0,
    },
    {
      title: "Configure Zustand Client Store with Local Storage Persistence",
      description: "Store task filters and focus mode slices avoiding unnecessary re-renders across layout.tsx",
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
      daysOffset: -1,
      estimatedMinutes: 60,
      courseIndex: 0,
    },
    {
      title: "Implement Type-Safe Server Action Form with Zod",
      description: "Validate task input on both client form and server mutation action using shared Zod schema",
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      daysOffset: 3,
      estimatedMinutes: 75,
      courseIndex: 0,
    },
    {
      title: "Solve Red-Black Tree Rotation Complexities",
      description: "Complete assignment on balancing invariants and amortized worst-case deletion analysis",
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.COMPLETED,
      daysOffset: -3,
      estimatedMinutes: 120,
      courseIndex: 1,
    },
    {
      title: "Implement Dijkstra & A* Pathfinding Heuristics",
      description: "Benchmark path exploration on road network graph dataset with custom priority queues",
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      daysOffset: 4,
      estimatedMinutes: 110,
      courseIndex: 1,
    },
    {
      title: "Fine-tune Transformer Attention Layer in PyTorch",
      description: "Train multi-head self-attention on mini-WikiText dataset using AdamW and cosine decay",
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      daysOffset: 5,
      estimatedMinutes: 180,
      courseIndex: 2,
    },
    {
      title: "Benchmark CAP Theorem Consistency in Edge Nodes",
      description: "Simulate network partitions across 3 edge locations using Raft consensus telemetry",
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      daysOffset: 8,
      estimatedMinutes: 90,
      courseIndex: 3,
    },
  ];

  const createdTasks = [];
  for (const t of taskTemplates) {
    const course = createdCourses[t.courseIndex];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + t.daysOffset);

    const task = await prisma.studyTask.create({
      data: {
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate,
        estimatedMinutes: t.estimatedMinutes,
        completedAt: t.status === TaskStatus.COMPLETED ? new Date() : null,
        courseId: course.id,
        userId: memberUser.id,
      },
    });
    createdTasks.push(task);
  }

  console.log(`✅ Seeded ${createdTasks.length} contextual study tasks.`);

  // 4. Populate Academic Goals
  await prisma.academicGoal.createMany({
    data: [
      {
        title: "Achieve Grade Point Average >= 9.2 in Sem V",
        description: "Maintain distinction in all laboratory and theoretical core courses",
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progressPercentage: 82,
        status: GoalStatus.ACTIVE,
        userId: memberUser.id,
      },
      {
        title: "Publish Technical Paper on Intelligent Edge Scheduling",
        description: "Submit to IEEE International Conference on Cloud and Big Data Computing",
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progressPercentage: 45,
        status: GoalStatus.ACTIVE,
        userId: memberUser.id,
      },
      {
        title: "Complete 100 LeetCode Hard Dynamic Programming Problems",
        description: "Master multi-dimensional state transitions and bitmask dynamic programming",
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progressPercentage: 100,
        status: GoalStatus.ACHIEVED,
        userId: memberUser.id,
      },
    ],
  });

  // 5. Populate StudySessions
  for (let i = 0; i < 6; i++) {
    const task = createdTasks[i % createdTasks.length];
    await prisma.studySession.create({
      data: {
        title: `Deep Focus Session: ${task.title.slice(0, 30)}...`,
        durationMinutes: faker.helpers.arrayElement([45, 60, 90, 120]),
        notes: faker.lorem.sentence(),
        focusScore: faker.number.int({ min: 80, max: 100 }),
        taskId: task.id,
        userId: memberUser.id,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 6. Populate Transactions (Academic resource & credit allowances)
  const transactionTypes = [
    {
      type: TransactionType.CREDIT_ALLOCATION,
      amount: 150.0,
      description: "University Cloud Compute Lab Grant - AWS / Neon Credits",
      status: TransactionStatus.COMPLETED,
    },
    {
      type: TransactionType.RESOURCE_UNLOCK,
      amount: 45.0,
      description: "IEEE Xplore Digital Library Research Access Pass",
      status: TransactionStatus.COMPLETED,
    },
    {
      type: TransactionType.LAB_ALLOWANCE,
      amount: 80.0,
      description: "AI Workstation High-Performance GPU Hours (RTX 4090)",
      status: TransactionStatus.COMPLETED,
    },
    {
      type: TransactionType.RESEARCH_GRANT,
      amount: 250.0,
      description: "Department Research Scholarship for Autonomous Agentics",
      status: TransactionStatus.COMPLETED,
    },
  ];

  for (const tx of transactionTypes) {
    await prisma.transaction.create({
      data: {
        userId: memberUser.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        status: tx.status,
        referenceCode: `TX-${faker.string.alphanumeric({ length: 8, casing: "upper" })}`,
        createdAt: faker.date.recent({ days: 14 }),
      },
    });
  }

  console.log(`💳 Seeded financial & credit transactions.`);

  // 7. Populate Audit Logs
  const auditEntries = [
    {
      userId: adminUser.id,
      action: "AUTH_ROLE_GRANT",
      entityType: "User",
      entityId: memberUser.id,
      details: { roleGranted: "MEMBER", approvedBy: "admin@studyflow.edu" },
    },
    {
      userId: memberUser.id,
      action: "COURSE_ENROLLMENT",
      entityType: "Course",
      entityId: createdCourses[0].id,
      details: { code: "DJS23AMD302L", title: "Full Stack Development" },
    },
    {
      userId: memberUser.id,
      action: "TASK_CREATED",
      entityType: "StudyTask",
      entityId: createdTasks[0].id,
      details: { priority: "URGENT", title: createdTasks[0].title },
    },
    {
      userId: memberUser.id,
      action: "TASK_COMPLETED",
      entityType: "StudyTask",
      entityId: createdTasks[1].id,
      details: { completedAt: new Date().toISOString() },
    },
  ];

  for (const a of auditEntries) {
    await prisma.auditLog.create({
      data: {
        userId: a.userId,
        action: a.action,
        entityType: a.entityType,
        entityId: a.entityId,
        details: a.details,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) StudyFlow/1.0",
      },
    });
  }

  // 8. Populate Email Delivery Logs (Resend transactional lifecycle)
  await prisma.emailDeliveryLog.createMany({
    data: [
      {
        recipientEmail: memberUser.email,
        templateName: "WelcomeStudentEmail",
        subject: "Welcome to StudyFlow - Your Academic Workspace is Ready",
        status: EmailEventType.DELIVERED,
        resendMessageId: `msg_${faker.string.alphanumeric(20)}`,
        metadata: { deliveryLatencyMs: 420, client: "Resend SMTP" },
      },
      {
        recipientEmail: memberUser.email,
        templateName: "TaskCreatedEmail",
        subject: "Urgent StudyFlow Task Alert: Next.js App Router Hydration Audit",
        status: EmailEventType.DELIVERED,
        resendMessageId: `msg_${faker.string.alphanumeric(20)}`,
        metadata: { deliveryLatencyMs: 380, client: "Resend Webhook" },
      },
      {
        recipientEmail: "bounced.test@example.com",
        templateName: "SecurityAlertEmail",
        subject: "Security Notification: New Device Login",
        status: EmailEventType.BOUNCED,
        resendMessageId: `msg_${faker.string.alphanumeric(20)}`,
        metadata: { bounceReason: "550 5.1.1 User unknown", code: "hard_bounce" },
      },
    ],
  });

  console.log(`📬 Seeded email delivery and bounce telemetry logs.`);
  console.log("✨ Seeding completed successfully with full relational integrity!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
