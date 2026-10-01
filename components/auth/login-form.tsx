"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogIn, GraduationCap, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const presetRole = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill if preset in URL
  useEffect(() => {
    if (presetRole === "admin") {
      setEmail("admin@studyflow.edu");
      setPassword("Admin@123");
    } else if (presetRole === "member") {
      setEmail("member@studyflow.edu");
      setPassword("Student@123");
    } else if (presetRole === "guest") {
      setEmail("guest@studyflow.edu");
      setPassword("Guest@123");
    }
  }, [presetRole]);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail || !loginPass) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    handleSubmit(undefined, userEmail, userPass);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <GraduationCap className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In to StudyFlow</CardTitle>
        <CardDescription>
          Access your academic courses, tasks, and focus telemetry
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick 1-Click Role Login Buttons */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            One-Click Evaluator Logins
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleQuickLogin("member@studyflow.edu", "Student@123")}
              className="flex flex-col h-auto py-2 text-xs border-primary/30 hover:bg-primary/10 hover:border-primary"
            >
              <UserCheck className="h-3.5 w-3.5 mb-1 text-primary" />
              <span className="font-semibold">Member</span>
              <span className="text-[10px] text-muted-foreground">Student</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleQuickLogin("admin@studyflow.edu", "Admin@123")}
              className="flex flex-col h-auto py-2 text-xs border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
            >
              <ShieldCheck className="h-3.5 w-3.5 mb-1 text-destructive" />
              <span className="font-semibold text-destructive">Admin</span>
              <span className="text-[10px] text-muted-foreground">Faculty/Staff</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleQuickLogin("guest@studyflow.edu", "Guest@123")}
              className="flex flex-col h-auto py-2 text-xs border-muted-foreground/30 hover:bg-muted"
            >
              <LogIn className="h-3.5 w-3.5 mb-1 text-muted-foreground" />
              <span className="font-semibold">Guest</span>
              <span className="text-[10px] text-muted-foreground">Read Only</span>
            </Button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or enter credentials</span>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Institutional Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@studyflow.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
        <p>
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-primary underline underline-offset-4 hover:opacity-80">
            Create an Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
