"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormValues } from "@/lib/validations/task";
import { createCourseAction } from "@/app/actions/task-actions";
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
import { BookPlus, Loader2 } from "lucide-react";

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      instructor: "",
      credits: 3,
      color: "#3b82f6",
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createCourseAction(values);
      if (!result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof CourseFormValues, {
              type: "server",
              message: messages[0],
            });
          });
        }
        toast.error(result.error || "Failed to add course.");
        return;
      }

      toast.success(`Course ${values.code} added successfully!`);
      reset();
      setOpen(false);
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-xs">
          <BookPlus className="h-4 w-4" />
          <span>Register Course</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register Academic Course</DialogTitle>
          <DialogDescription>
            Add a course module to your Semester V study plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course-code" className="text-xs font-semibold">
                Course Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="course-code"
                placeholder="e.g. DJS23AMD302L"
                {...register("code")}
                disabled={isSubmitting}
              />
              {errors.code && (
                <p className="text-xs text-destructive font-medium">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="course-credits" className="text-xs font-semibold">
                Credits
              </Label>
              <Input
                id="course-credits"
                type="number"
                min="1"
                max="10"
                {...register("credits")}
                disabled={isSubmitting}
              />
              {errors.credits && (
                <p className="text-xs text-destructive font-medium">{errors.credits.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course-title" className="text-xs font-semibold">
              Course Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="course-title"
              placeholder="e.g. Full Stack Development Using Next.js"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course-instructor" className="text-xs font-semibold">
                Instructor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="course-instructor"
                placeholder="Prof. S. R. Mehta"
                {...register("instructor")}
                disabled={isSubmitting}
              />
              {errors.instructor && (
                <p className="text-xs text-destructive font-medium">{errors.instructor.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="course-color" className="text-xs font-semibold">
                Theme Color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="course-color"
                  type="color"
                  {...register("color")}
                  disabled={isSubmitting}
                  className="h-9 w-12 rounded cursor-pointer border border-input p-0.5 bg-background"
                />
                <Input
                  {...register("color")}
                  placeholder="#3b82f6"
                  className="h-9 font-mono text-xs uppercase"
                  disabled={isSubmitting}
                />
              </div>
              {errors.color && (
                <p className="text-xs text-destructive font-medium">{errors.color.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course-desc" className="text-xs font-semibold">
              Syllabus Outline
            </Label>
            <Textarea
              id="course-desc"
              placeholder="Key concepts, lab modules, project expectations..."
              rows={2}
              {...register("description")}
              disabled={isSubmitting}
            />
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
                  Saving...
                </>
              ) : (
                <>
                  <BookPlus className="h-4 w-4" />
                  Register Course
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
