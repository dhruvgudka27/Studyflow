import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TelemetryViewer } from "@/components/analytics/telemetry-viewer";
import { BarChart3, Database, Layers, Clock, Zap, Target } from "lucide-react";

export const metadata = {
  title: "Telemetry & Focus Analytics | StudyFlow",
  description: "Cross-platform analytics bridging relational PostgreSQL study data with Mongoose MongoDB document streams.",
};

export default async function AnalyticsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?callbackUrl=/analytics");
  }

  // Authoritative relational statistics from PostgreSQL
  const [studySessions, tasks] = await Promise.all([
    prisma.studySession.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studyTask.findMany({
      where: { userId: session.userId },
    }),
  ]);

  const totalFocusMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgFocusScore =
    studySessions.length > 0
      ? Math.round(studySessions.reduce((acc, s) => acc + s.focusScore, 0) / studySessions.length)
      : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <BarChart3 className="h-7 w-7 text-primary" />
          Focus Analytics & Multi-Database Telemetry
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Demonstrating Unit IV dual-database integration: Structured relational state in PostgreSQL (Prisma)
          and time-series document telemetry in MongoDB (Mongoose).
        </p>
      </div>

      {/* Relational PostgreSQL Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Relational Focus Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFocusMinutes} Minutes</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prisma model: <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">StudySession</code>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Mean Focus Rating
            </CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFocusScore} / 100</div>
            <p className="text-xs text-muted-foreground mt-1">
              Computed across {studySessions.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Database Architecture
            </CardTitle>
            <Database className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-foreground">Postgres + MongoDB</div>
            <p className="text-xs text-muted-foreground mt-1">
              Relational schemas & Object documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive MongoDB / Mongoose Telemetry Component */}
      <TelemetryViewer />
    </div>
  );
}
