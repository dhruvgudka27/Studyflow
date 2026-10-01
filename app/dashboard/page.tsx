import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  PlusCircle,
  AlertCircle,
  ShieldCheck,
  Activity,
  Calendar,
  Sparkles,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "Student Dashboard | StudyFlow",
  description: "Comprehensive student academic workspace overview, tasks, coursework, and focus telemetry.",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Fetch real authoritative server state via Prisma (RSC Direct Database Query)
  const [courses, tasks, goals, studySessions, recentAuditLogs] = await Promise.all([
    prisma.course.findMany({
      where: { userId: session.userId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.studyTask.findMany({
      where: { userId: session.userId },
      include: { course: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.academicGoal.findMany({
      where: { userId: session.userId },
      orderBy: { progressPercentage: "desc" },
    }),
    prisma.studySession.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.auditLog.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);

  const urgentTasks = tasks
    .filter((t) => t.status !== "COMPLETED")
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {session.name}
            </h1>
            <Badge
              variant={session.role === "ADMIN" ? "destructive" : "default"}
              className="text-[10px] tracking-wider uppercase font-bold"
            >
              {session.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Academic Workspace • T.Y. B.Tech AIML (Sem V) • Course: DJS23AMD302L
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild size="sm" className="gap-1.5 shadow-xs">
            <Link href="/tasks">
              <PlusCircle className="h-4 w-4" />
              Manage Tasks
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/analytics">
              <Activity className="h-4 w-4 text-emerald-500" />
              Focus Telemetry
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length} Courses</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total {totalCredits} Academic Credits
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Task Velocity
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            <Progress value={taskCompletionRate} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed of {totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Focus Time
            </CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFocusMinutes} mins</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {studySessions.length} recorded focus sessions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Academic Goals
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length} Milestones</div>
            <p className="text-xs text-muted-foreground mt-1">
              {goals.filter((g) => g.progressPercentage >= 80).length} on-track distinctions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Upcoming Deadlines & Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Deadlines (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Upcoming Study Milestones & Tasks
                </CardTitle>
                <CardDescription>
                  Tasks requiring immediate review, sequenced by calendar due date
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/tasks">
                  View All ({totalTasks})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {urgentTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  🎉 All tasks completed! No urgent deliverables pending.
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-lg border bg-card/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: t.course.color }}
                          />
                          <span className="text-xs font-mono text-muted-foreground font-semibold">
                            {t.course.code}
                          </span>
                          <span className="font-semibold text-sm">{t.title}</span>
                        </div>
                        {t.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {t.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            t.priority === "URGENT"
                              ? "destructive"
                              : t.priority === "HIGH"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {t.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(t.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Goals Progress */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Academic Term Goals
              </CardTitle>
              <CardDescription>
                Semester V milestone benchmarks and GPA projections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((g) => (
                <div key={g.id} className="space-y-1.5 p-3 rounded-lg border bg-card/40">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{g.title}</span>
                    <span className="font-bold text-xs">{g.progressPercentage}%</span>
                  </div>
                  <Progress value={g.progressPercentage} className="h-2" />
                  {g.description && (
                    <p className="text-xs text-muted-foreground">{g.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Registered Courses & Audit Feed */}
        <div className="space-y-6">
          {/* Courses Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Semester V Courses
              </CardTitle>
              <CardDescription>
                Active registered modules & lab sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-lg border bg-card/50 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="font-semibold text-xs font-mono">{course.code}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      {course.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {course.instructor} • {course.credits} Credits
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {course._count.tasks} Tasks
                  </Badge>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-2 text-xs" size="sm">
                <Link href="/courses">Manage Courses</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Audit Logs Quick Snapshot */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                Recent Audit Trail
              </CardTitle>
              <CardDescription>
                Prisma forensic audit ledger snapshots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded border bg-muted/20 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-semibold text-primary">{log.action}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      Entity: {log.entityType}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
