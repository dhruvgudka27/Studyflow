"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Users,
  ShieldCheck,
  CreditCard,
  Mail,
  Send,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminTabsProps {
  users: any[];
  auditLogs: any[];
  transactions: any[];
  emailLogs: any[];
}

export function AdminTabs({ users, auditLogs, transactions, emailLogs }: AdminTabsProps) {
  const router = useRouter();
  const [testingWebhook, setTestingWebhook] = useState(false);

  const simulateWebhook = async (status: "email.delivered" | "email.bounced") => {
    setTestingWebhook(true);
    try {
      const mockMessageId = `resend_sim_${Date.now()}`;
      const payload = {
        type: status,
        created_at: new Date().toISOString(),
        data: {
          id: mockMessageId,
          email_id: mockMessageId,
          from: "notifications@studyflow.edu",
          to: ["member@studyflow.edu"],
          subject: status === "email.delivered" ? "[StudyFlow] Delivery Confirmed" : "[StudyFlow] Message Bounced",
        },
      };

      const res = await fetch("/api/webhooks/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(`Webhook ingested: ${status}`, {
          description: `Logged in EmailDeliveryLog table (Status: ${json.status})`,
        });
        router.refresh();
      } else {
        toast.error(json.error || "Failed to trigger webhook.");
      }
    } catch {
      toast.error("Webhook route call error.");
    } finally {
      setTestingWebhook(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return <Badge variant="destructive">ADMIN</Badge>;
    if (role === "MEMBER") return <Badge variant="default">MEMBER</Badge>;
    return <Badge variant="secondary">GUEST</Badge>;
  };

  const getEmailStatusBadge = (status: string) => {
    if (status === "DELIVERED")
      return <Badge className="bg-emerald-600 text-white font-mono text-[10px]">DELIVERED</Badge>;
    if (status === "BOUNCED" || status === "FAILED")
      return <Badge variant="destructive" className="font-mono text-[10px]">{status}</Badge>;
    if (status === "SENT")
      return <Badge className="bg-blue-600 text-white font-mono text-[10px]">SENT</Badge>;
    return <Badge variant="outline" className="font-mono text-[10px]">{status}</Badge>;
  };

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
        <TabsTrigger value="users" className="gap-2 py-2 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span>Users ({users.length})</span>
        </TabsTrigger>
        <TabsTrigger value="audit" className="gap-2 py-2 text-xs sm:text-sm">
          <ShieldCheck className="h-4 w-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </TabsTrigger>
        <TabsTrigger value="transactions" className="gap-2 py-2 text-xs sm:text-sm">
          <CreditCard className="h-4 w-4" />
          <span>Transactions ({transactions.length})</span>
        </TabsTrigger>
        <TabsTrigger value="emails" className="gap-2 py-2 text-xs sm:text-sm">
          <Mail className="h-4 w-4" />
          <span>Email Logs ({emailLogs.length})</span>
        </TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        <Card className="border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold">Institutional User Directory</CardTitle>
            <CardDescription className="text-xs">
              Normalized relational User table with RBAC security mappings (PostgreSQL)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/30 text-muted-foreground uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Courses</th>
                    <th className="p-2.5">Tasks</th>
                    <th className="p-2.5">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20">
                      <td className="p-2.5 font-sans font-semibold text-foreground">{u.name}</td>
                      <td className="p-2.5 text-muted-foreground">{u.email}</td>
                      <td className="p-2.5">{getRoleBadge(u.role)}</td>
                      <td className="p-2.5">{u._count.courses}</td>
                      <td className="p-2.5">{u._count.tasks}</td>
                      <td className="p-2.5 text-[11px] text-muted-foreground font-sans">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Audit Logs Tab */}
      <TabsContent value="audit" className="space-y-4">
        <Card className="border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold">Forensic Audit Trail</CardTitle>
            <CardDescription className="text-xs">
              Prisma AuditLog model capturing state mutations, IP headers, and user activities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border bg-card/60 text-xs font-mono space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{log.action}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {log.entityType}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-sans">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
                    <span>User: {log.user?.email || "System / Anonymous"}</span>
                    <span>IP: {log.ipAddress || "127.0.0.1"}</span>
                  </div>
                  {log.details && (
                    <div className="p-2 rounded bg-black/30 text-slate-300 text-[10px] overflow-x-auto">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Transactions Tab */}
      <TabsContent value="transactions" className="space-y-4">
        <Card className="border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold">Financial & Resource Transactions</CardTitle>
            <CardDescription className="text-xs">
              Relational Transaction table tracking lab allowances and research credits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b bg-muted/30 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 font-sans">Reference</th>
                    <th className="p-2.5 font-sans">User</th>
                    <th className="p-2.5 font-sans">Type</th>
                    <th className="p-2.5 font-sans">Amount</th>
                    <th className="p-2.5 font-sans">Status</th>
                    <th className="p-2.5 font-sans">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="p-2.5 font-bold text-primary">{tx.referenceCode}</td>
                      <td className="p-2.5 text-muted-foreground">{tx.user?.email}</td>
                      <td className="p-2.5">
                        <span className="text-[11px] font-sans">{tx.type}</span>
                      </td>
                      <td className="p-2.5 font-bold">₹{Number(tx.amount).toFixed(2)}</td>
                      <td className="p-2.5">
                        <Badge
                          variant={tx.status === "COMPLETED" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="p-2.5 font-sans text-muted-foreground text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Email Delivery Logs & Resend Webhooks Tab */}
      <TabsContent value="emails" className="space-y-4">
        <Card className="border shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Transactional Email Pipeline & Resend Webhooks
                </CardTitle>
                <CardDescription className="text-xs">
                  EmailDeliveryLog table updated via Resend API and `/api/webhooks/resend` Route Handler
                </CardDescription>
              </div>

              {/* Webhook Testing Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={testingWebhook}
                  onClick={() => simulateWebhook("email.delivered")}
                  className="h-7 text-xs border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Simulate Webhook Delivered
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={testingWebhook}
                  onClick={() => simulateWebhook("email.bounced")}
                  className="h-7 text-xs border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Simulate Webhook Bounced
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b bg-muted/30 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 font-sans">Recipient</th>
                    <th className="p-2.5 font-sans">Subject</th>
                    <th className="p-2.5 font-sans">Status</th>
                    <th className="p-2.5 font-sans">Resend Message ID</th>
                    <th className="p-2.5 font-sans">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20">
                      <td className="p-2.5 text-foreground font-semibold">{log.recipientEmail}</td>
                      <td className="p-2.5 text-muted-foreground font-sans line-clamp-1 max-w-xs">
                        {log.subject}
                      </td>
                      <td className="p-2.5">{getEmailStatusBadge(log.status)}</td>
                      <td className="p-2.5 text-muted-foreground text-[11px]">
                        {log.resendMessageId || "queued_local"}
                      </td>
                      <td className="p-2.5 font-sans text-muted-foreground text-[11px]">
                        {new Date(log.createdAt).toLocaleTimeString()} •{" "}
                        {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
