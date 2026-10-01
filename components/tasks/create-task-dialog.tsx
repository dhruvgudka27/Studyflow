"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/lib/validations/task";
import { createTaskAction } from "@/app/actions/task-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PlusCircle, Loader2, Sparkles } from "lucide-react";

interface CreateTaskDialogProps {
  courses: Array<{ id: string; code: string; title: string }>;
  onSuccess?: () => void;
}

export function CreateTaskDialog({ courses, onSuccess }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: courses[0]?.id || "",
      priority: "MEDIUM",
      dueDate: defaultDueDate(),
      estimatedMinutes: 60,
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // Execute the native Server Action ('use server')
      const result = await createTaskAction(values);

      if (!result.success) {
        if (result.fieldErrors) {
          // Map backend Zod validation errors directly to react-hook-form fields
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof TaskFormValues, {
              type: "server",
              message: messages[0],
            });
          });
          toast.error("Please resolve the highlighted validation errors.");
        } else {
          toast.error(result.error || "Failed to create task.");
        }
        return;
      }

      toast.success(`Task "${values.title}" created successfully!`, {
        description: "Transactional notification dispatched & audit logged.",
      });
      reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-xs">
          <PlusCircle className="h-4 w-4" />
          <span>New Study Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Academic Task
          </DialogTitle>
          <DialogDescription>
            Input assignment or laboratory deliverable details. Validated end-to-end via shared Zod schema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Implement Dijkstra Algorithm Heuristic"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Course & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-course" className="text-xs font-semibold">
                Academic Course <span className="text-destructive">*</span>
              </Label>
              <select
                id="task-course"
                {...register("courseId")}
                disabled={isSubmitting}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="text-xs text-destructive font-medium" role="alert">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-priority" className="text-xs font-semibold">
                Priority Tier
              </Label>
              <select
                id="task-priority"
                {...register("priority")}
                disabled={isSubmitting}
                className="w-full h-9 px-3 py-1 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent / Critical</option>
              </select>
              {errors.priority && (
                <p className="text-xs text-destructive font-medium" role="alert">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Due Date & Estimated Minutes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-duedate" className="text-xs font-semibold">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-duedate"
                type="date"
                {...register("dueDate")}
                aria-invalid={errors.dueDate ? "true" : "false"}
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p className="text-xs text-destructive font-medium" role="alert">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-minutes" className="text-xs font-semibold">
                Estimated Time (Minutes)
              </Label>
              <Input
                id="task-minutes"
                type="number"
                min="5"
                max="720"
                step="5"
                placeholder="60"
                {...register("estimatedMinutes")}
                aria-invalid={errors.estimatedMinutes ? "true" : "false"}
                disabled={isSubmitting}
              />
              {errors.estimatedMinutes && (
                <p className="text-xs text-destructive font-medium" role="alert">
                  {errors.estimatedMinutes.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-xs font-semibold">
              Description / Deliverable Criteria
            </Label>
            <Textarea
              id="task-desc"
              placeholder="Outline specific objectives, test cases, or rubric requirements..."
              rows={3}
              {...register("description")}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Task...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
