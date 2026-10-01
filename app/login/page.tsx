import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In | StudyFlow",
  description: "Sign in to access your coursework, persistent study tasks, and focus telemetry.",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-muted/20">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-xl bg-card animate-pulse border" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
