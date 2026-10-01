import { Suspense } from "react";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TaskFilterBar } from "@/components/tasks/task-filter-bar";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskSkeleton } from "@/components/tasks/task-skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Layers } from "lucide-react";

export const metadata = {
  title: "Academic Tasks | StudyFlow",
  description: "Organize, filter, and track coursework tasks with persistent Zustand state and Server Actions.",
};

export default async function TasksPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?callbackUrl=/tasks");
  }

  // Authoritative RSC database query
  const [courses, tasks] = await Promise.all([
    prisma.course.findMany({
      where: { userId: session.userId },
      select: { id: true, code: true, title: true, color: true },
      orderBy: { code: "asc" },
    }),
    prisma.studyTask.findMany({
      where: { userId: session.userId },
      include: {
        course: {
          select: { id: true, code: true, title: true, color: true },
        },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  // Clean serialization across RSC/Client Component boundary
  const serializableTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate.toISOString(),
    estimatedMinutes: t.estimatedMinutes,
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    course: t.course,
  }));

  const serializableCourses = courses.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
  }));

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <CheckSquare className="h-7 w-7 text-primary" />
              Study Tasks
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage coursework deliverables with optimistic client state and validated Server Actions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <CreateTaskDialog courses={serializableCourses} />
        </div>
      </div>

      {/* Filter Bar (Client Component with selective Zustand subscriptions) */}
      <TaskFilterBar courses={serializableCourses} />

      {/* Task Grid with Suspense */}
      <Suspense fallback={<TaskSkeleton />}>
        <TaskList initialTasks={serializableTasks} />
      </Suspense>
    </div>
  );
}
