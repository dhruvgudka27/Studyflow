import { z } from "zod";

export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const TaskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);

/**
 * Shared Zod Schema for Task Mutation
 * Applied identically on:
 * 1. Client-side react-hook-form validation
 * 2. Server Action backend sanitization and validation
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Task title must be at least 3 characters." })
    .max(120, { message: "Task title cannot exceed 120 characters." })
    .trim(),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional()
    .default(""),
  courseId: z
    .string()
    .min(1, { message: "Please select an associated academic course." }),
  priority: TaskPriorityEnum.default("MEDIUM"),
  dueDate: z
    .string()
    .min(1, { message: "A valid due date is required." })
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: "Please enter a valid calendar date.",
    }),
  estimatedMinutes: z
    .coerce
    .number({ invalid_type_error: "Estimated time must be a number." })
    .int({ message: "Must be whole minutes." })
    .min(5, { message: "Estimated time must be at least 5 minutes." })
    .max(720, { message: "Estimated time cannot exceed 12 hours (720 min)." })
    .default(60),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const courseSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Course code must be at least 3 characters (e.g. DJS23AMD302L)." })
    .max(20, { message: "Course code cannot exceed 20 characters." })
    .trim()
    .toUpperCase(),
  title: z
    .string()
    .min(3, { message: "Course title must be at least 3 characters." })
    .max(100, { message: "Course title cannot exceed 100 characters." })
    .trim(),
  description: z
    .string()
    .max(300, { message: "Description cannot exceed 300 characters." })
    .optional()
    .default(""),
  instructor: z
    .string()
    .min(2, { message: "Instructor name must be at least 2 characters." })
    .max(80, { message: "Instructor name cannot exceed 80 characters." })
    .trim(),
  credits: z
    .coerce
    .number()
    .int()
    .min(1, { message: "Course must have at least 1 credit." })
    .max(10, { message: "Credits cannot exceed 10." })
    .default(3),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, { message: "Color must be a valid 6-character hex code (e.g. #3b82f6)." })
    .default("#3b82f6"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
