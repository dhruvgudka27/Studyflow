"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <GraduationCap className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create Student Account</CardTitle>
        <CardDescription>
          Register to join StudyFlow and begin organizing your courses
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
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

          <div className="space-y-2">
            <Label htmlFor="role">Role Archetype</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              aria-label="Role Archetype"
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="MEMBER">Member (Standard Student)</option>
              <option value="ADMIN">Admin (Faculty / System Administrator)</option>
              <option value="GUEST">Guest (Prospective / Read Only)</option>
            </select>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Register
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary underline underline-offset-4 hover:opacity-80">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
