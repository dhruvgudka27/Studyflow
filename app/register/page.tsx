import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | StudyFlow",
  description: "Create an academic profile to start managing study tasks, courses, and focus sessions.",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-muted/20">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-xl bg-card animate-pulse border" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
