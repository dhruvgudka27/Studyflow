"use server";

import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskSchema, courseSchema, TaskFormValues, CourseFormValues } from "@/lib/validations/task";
import { dispatchTaskCreatedEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { TaskStatus, Role } from "@prisma/client";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action: Create Study Task
 * 1. Authenticates current user session server-side.
 * 2. Validates/sanitizes payload using the shared Zod schema.
 * 3. Persists relational record into PostgreSQL via Prisma.
 * 4. Dispatches transactional email lifecycle event via Resend.
 * 5. Records forensic audit log.
 * 6. Triggers Next.js cache revalidation.
 */
export async function createTaskAction(rawInput: TaskFormValues): Promise<ActionResult> {
  try {
    // 1. Authoritative Server-Side Session Validation
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        error: "Authentication required. Please sign in to create study tasks.",
      };
    }

    // Guests have read-only access
    if (session.role === Role.GUEST) {
      return {
        success: false,
        error: "Guest accounts are read-only. Please register a student account to create tasks.",
      };
    }

    // 2. Strict Server-Side Zod Validation & Sanitization
    const validationResult = taskSchema.safeParse(rawInput);
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten();
      return {
        success: false,
        error: "Validation failed. Please correct the highlighted errors.",
        fieldErrors: flattened.fieldErrors,
      };
    }

    const { title, description, courseId, priority, dueDate, estimatedMinutes } = validationResult.data;

    // Verify course belongs to this user or exists
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: session.userId },
    });

    if (!course) {
      return {
        success: false,
        error: "The specified academic course was not found in your workspace.",
      };
    }

    // 3. PostgreSQL Database Mutation via Prisma ORM
    const newTask = await prisma.studyTask.create({
      data: {
        title,
        description: description || null,
        courseId,
        priority,
        dueDate: new Date(dueDate),
        estimatedMinutes,
        userId: session.userId,
        status: TaskStatus.TODO,
      },
      include: {
        course: true,
      },
    });

    // 4. Forensic Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "TASK_CREATED",
        entityType: "StudyTask",
        entityId: newTask.id,
        details: {
          title: newTask.title,
          courseCode: course.code,
          priority: newTask.priority,
          estimatedMinutes: newTask.estimatedMinutes,
        },
      },
    });

    // 5. Transactional Email Notification (triggered strictly POST-mutation)
    try {
      await dispatchTaskCreatedEmail({
        recipientEmail: session.email,
        studentName: session.name,
        taskTitle: newTask.title,
        courseTitle: course.title,
        courseCode: course.code,
        priority: newTask.priority,
        dueDate: new Date(dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        estimatedMinutes: newTask.estimatedMinutes,
      });
    } catch (emailErr) {
      console.warn("Notice: Email notification dispatch non-fatal failure:", emailErr);
    }

    // 6. Next.js App Router Cache Revalidation
    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return {
      success: true,
      data: newTask,
    };
  } catch (err: any) {
    console.error("❌ createTaskAction server error:", err);
    return {
      success: false,
      error: "A database error occurred while creating your task. Please try again.",
    };
  }
}

/**
 * Server Action: Update Task Status (TODO -> IN_PROGRESS -> COMPLETED)
 */
export async function updateTaskStatusAction(
  taskId: string,
  newStatus: TaskStatus
): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Authentication required." };
    }

    if (session.role === Role.GUEST) {
      return { success: false, error: "Guest accounts cannot update tasks." };
    }

    // Verify task ownership
    const task = await prisma.studyTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "Task not found." };
    }

    if (task.userId !== session.userId && session.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access to this task." };
    }

    const updated = await prisma.studyTask.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : null,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: newStatus === TaskStatus.COMPLETED ? "TASK_COMPLETED" : "TASK_STATUS_UPDATED",
        entityType: "StudyTask",
        entityId: taskId,
        details: { previousStatus: task.status, newStatus },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, data: updated };
  } catch (err: any) {
    console.error("❌ updateTaskStatusAction error:", err);
    return { success: false, error: "Failed to update task status." };
  }
}

/**
 * Server Action: Delete Task
 */
export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Authentication required." };
    }

    if (session.role === Role.GUEST) {
      return { success: false, error: "Guest accounts cannot delete tasks." };
    }

    const task = await prisma.studyTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "Task not found." };
    }

    if (task.userId !== session.userId && session.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.studyTask.delete({
      where: { id: taskId },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "TASK_DELETED",
        entityType: "StudyTask",
        entityId: taskId,
        details: { title: task.title },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Failed to delete task." };
  }
}

/**
 * Server Action: Create Course
 */
export async function createCourseAction(rawInput: CourseFormValues): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Authentication required." };
    }

    if (session.role === Role.GUEST) {
      return { success: false, error: "Guest accounts cannot create courses." };
    }

    const validation = courseSchema.safeParse(rawInput);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid course fields.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { code, title, description, instructor, credits, color } = validation.data;

    const existing = await prisma.course.findFirst({
      where: { code, userId: session.userId },
    });

    if (existing) {
      return {
        success: false,
        error: `A course with code ${code} is already registered in your workspace.`,
      };
    }

    const course = await prisma.course.create({
      data: {
        code,
        title,
        description: description || null,
        instructor,
        credits,
        color,
        userId: session.userId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");

    return { success: true, data: course };
  } catch (err: any) {
    return { success: false, error: "Failed to create course." };
  }
}
