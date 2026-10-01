import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Role } from "@prisma/client";

export const metadata = {
  title: "Admin Security & Audit Portal | StudyFlow",
  description: "Administrative oversight, role-based access control, forensic audit trail, and webhook telemetry.",
};

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  // Strict Server-Side RBAC Guard
  if (session.role !== Role.ADMIN) {
    redirect("/dashboard?error=insufficient_permissions");
  }

  const [users, auditLogs, transactions, emailLogs] = await Promise.all([
    prisma.user.findMany({
      include: {
        _count: {
          select: { courses: true, tasks: true, transactions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      include: {
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.transaction.findMany({
      include: {
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.emailDeliveryLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  // Clean serializable mapping
  const serializableTransactions = transactions.map((tx) => ({
    ...tx,
    amount: tx.amount.toString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-destructive/10 border border-destructive/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Administrative Control Center & Security Audit
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Strictly gated by Next.js Edge Middleware and Server-side RBAC (Role: ADMIN)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-background/80 px-3 py-1.5 rounded-lg border">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Active Admin: {session.email}</span>
        </div>
      </div>

      <AdminTabs
        users={users}
        auditLogs={auditLogs}
        transactions={serializableTransactions}
        emailLogs={emailLogs}
      />
    </div>
  );
}
