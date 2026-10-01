import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Sparkles,
  Layers,
  Zap,
  ShieldCheck,
  Database,
  Mail,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart2,
  Clock,
  Code2,
} from "lucide-react";

export default function HomePage() {
  const technicalPillars = [
    {
      icon: Layers,
      title: "RSC & Client Boundaries",
      badge: "Unit I & II",
      description:
        "Engineered with React Server Components (RSC) for data fetching and minimal 'use client' islands for interactive state, eliminating unnecessary JS hydration.",
    },
    {
      icon: Zap,
      title: "Persistent Zustand State",
      badge: "Unit II",
      description:
        "Centralized client-side state slices for focus sessions and persistent filters with selective subscriptions that prevent layout re-renders.",
    },
    {
      icon: CheckCircle2,
      title: "Shared Zod Server Actions",
      badge: "Unit III",
      description:
        "100% type-safe form validation using identical Zod schemas on both client-side react-hook-form and native Next.js Server Actions.",
    },
    {
      icon: Database,
      title: "Dual Database Architecture",
      badge: "Unit IV",
      description:
        "Normalized relational models in PostgreSQL via Prisma ORM paired with flexible document streams in MongoDB via Mongoose for telemetry events.",
    },
    {
      icon: ShieldCheck,
      title: "Edge Session RBAC",
      badge: "Unit V",
      description:
        "Better Auth session management with cryptographic JWT verification enforced at Next.js Edge Middleware for Admin, Member, and Guest roles.",
    },
    {
      icon: Mail,
      title: "Transactional Resend Pipeline",
      badge: "Unit V & VI",
      description:
        "Modular React Email templates triggered post-mutation via the Resend API, with an automated webhook Route Handler persisting delivery and bounce logs.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-background via-muted/30 to-background border-b">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.03] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academic Year 2026-27 • Laboratory-III (DJS23AMD302L)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Study<span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">Flow</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto">
            A Next.js Student Academic Productivity & Coursework Orchestration Platform
          </p>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto">
            Combining persistent client state, unstyled Radix primitives, Server Actions with Zod sanitization,
            PostgreSQL relational persistence, and real-time MongoDB focus telemetry.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 h-11 px-6 shadow-md hover:shadow-lg transition-all">
              <Link href="/dashboard">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link href="/login">One-Click Demo Logins</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-11 px-6">
              <Link href="/tasks">View Live Tasks</Link>
            </Button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur shadow-xs">
              <div className="text-2xl font-bold text-primary">RSC First</div>
              <div className="text-xs text-muted-foreground mt-1">Zero-Hydration Server Tree</div>
            </div>
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur shadow-xs">
              <div className="text-2xl font-bold text-indigo-500">PostgreSQL</div>
              <div className="text-xs text-muted-foreground mt-1">Prisma Relational ORM</div>
            </div>
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur shadow-xs">
              <div className="text-2xl font-bold text-purple-500">MongoDB</div>
              <div className="text-xs text-muted-foreground mt-1">Mongoose Object Telemetry</div>
            </div>
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur shadow-xs">
              <div className="text-2xl font-bold text-emerald-500">Zustand + Zod</div>
              <div className="text-xs text-muted-foreground mt-1">Persistent State & Schema</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight">Full Stack Architecture Pillars</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Directly satisfying every unit outcome and deliverable specified in Assignment 1 & Assignment 2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="relative overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Interactive Role Switcher Showcase */}
      <section className="py-14 bg-muted/40 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Zero-Setup Testing</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Experience Multi-Role RBAC Authorization Instantly
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Test the application across different access levels: Member (create/mutate tasks, start focus sessions),
                Admin (security audit logs, role manager, financial transactions), and Guest (read-only showcase).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button asChild variant="default" className="gap-2">
                <Link href="/login?role=member">
                  <GraduationCap className="h-4 w-4" />
                  Sign In as Member
                </Link>
              </Button>
              <Button asChild variant="destructive" className="gap-2">
                <Link href="/login?role=admin">
                  <ShieldCheck className="h-4 w-4" />
                  Sign In as Admin
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/login?role=guest">
                  <Clock className="h-4 w-4" />
                  Explore as Guest
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
