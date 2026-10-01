import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog";
import Link from "next/link";
import { BookOpen, User, Award, CheckSquare, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Academic Courses | StudyFlow",
  description: "Semester coursework, syllabi, instructors, and deliverable associations.",
};

export default async function CoursesPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?callbackUrl=/courses");
  }

  const courses = await prisma.course.findMany({
    where: { userId: session.userId },
    include: {
      tasks: {
        select: { id: true, status: true },
      },
    },
    orderBy: { code: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-primary" />
            Registered Academic Courses
          </h1>
          <p className="text-sm text-muted-foreground">
            Semester V curricula, laboratory sections, and credit allocations
          </p>
        </div>

        <CreateCourseDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const totalTasks = course.tasks.length;
          const completedTasks = course.tasks.filter((t) => t.status === "COMPLETED").length;
          const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <Card key={course.id} className="relative overflow-hidden border shadow-xs hover:shadow-md transition-all">
              <div className="h-2 w-full" style={{ backgroundColor: course.color }} />
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold" style={{ borderColor: `${course.color}88` }}>
                    {course.code}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {course.credits} Credits
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold pt-1">{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{course.instructor}</span>
                  <span>•</span>
                  <span>{course.semester}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {course.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                )}

                <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckSquare className="h-3.5 w-3.5" />
                      Tasks Progress:
                    </span>
                    <span className="font-semibold font-mono">
                      {completedTasks} / {totalTasks} ({completionPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${completionPct}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Link href={`/tasks`}>
                      View Tasks
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
