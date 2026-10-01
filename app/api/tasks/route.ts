import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations/task";
import { dispatchTaskCreatedEmail } from "@/lib/email";
import { Role, TaskStatus } from "@prisma/client";

/**
 * Protected Route Handler: GET /api/tasks
 * Enforces session authentication & role checks
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as TaskStatus | null;
    const courseId = searchParams.get("courseId");

    const where: any = { userId: session.userId };
    if (status && ["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      where.status = status;
    }
    if (courseId) {
      where.courseId = courseId;
    }

    const tasks = await prisma.studyTask.findMany({
      where,
      include: {
        course: { select: { id: true, code: true, title: true, color: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch tasks", details: error.message }, { status: 500 });
  }
}

/**
 * Protected Route Handler: POST /api/tasks
 * Validates payload via shared Zod schema and mutates PostgreSQL
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    if (session.role === Role.GUEST) {
      return NextResponse.json({ error: "Forbidden: Guest accounts are read-only" }, { status: 403 });
    }

    const body = await request.json();
    const validation = taskSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, courseId, priority, dueDate, estimatedMinutes } = validation.data;

    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: session.userId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found in user workspace" }, { status: 404 });
    }

    const task = await prisma.studyTask.create({
      data: {
        title,
        description: description || null,
        courseId,
        priority,
        dueDate: new Date(dueDate),
        estimatedMinutes,
        userId: session.userId,
      },
      include: { course: true },
    });

    // Forensic audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "API_TASK_CREATED",
        entityType: "StudyTask",
        entityId: task.id,
        details: { title: task.title, courseCode: course.code },
      },
    });

    // Post-mutation email dispatch
    try {
      await dispatchTaskCreatedEmail({
        recipientEmail: session.email,
        studentName: session.name,
        taskTitle: task.title,
        courseTitle: course.title,
        courseCode: course.code,
        priority: task.priority,
        dueDate: new Date(dueDate).toLocaleDateString(),
        estimatedMinutes: task.estimatedMinutes,
      });
    } catch (e) {
      console.warn("Non-fatal email dispatch error:", e);
    }

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create task", details: error.message }, { status: 500 });
  }
}
