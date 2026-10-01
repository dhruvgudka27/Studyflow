"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useStudyFlowStore } from "@/stores/useStudyStore";
import { updateTaskStatusAction, deleteTaskAction } from "@/app/actions/task-actions";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  ArrowRight,
  Flame,
  Loader2,
} from "lucide-react";
import { TaskStatus, TaskPriority } from "@prisma/client";

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | Date;
  estimatedMinutes: number;
  completedAt?: string | Date | null;
  course: {
    id: string;
    code: string;
    title: string;
    color: string;
  };
}

interface TaskCardProps {
  task: TaskItem;
  onRefresh?: () => void;
}

export function TaskCard({ task, onRefresh }: TaskCardProps) {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startFocusSession = useStudyFlowStore((s) => s.startFocusSession);
  const activeFocusTaskId = useStudyFlowStore((s) => s.focusTaskId);

  const handleCycleStatus = async () => {
    let nextStatus: TaskStatus = TaskStatus.TODO;
    if (currentStatus === TaskStatus.TODO) nextStatus = TaskStatus.IN_PROGRESS;
    else if (currentStatus === TaskStatus.IN_PROGRESS) nextStatus = TaskStatus.COMPLETED;
    else if (currentStatus === TaskStatus.COMPLETED) nextStatus = TaskStatus.TODO;

    // Optimistic UI update
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    setIsUpdating(true);

    try {
      const res = await updateTaskStatusAction(task.id, nextStatus);
      if (!res.success) {
        // Rollback optimistic update
        setCurrentStatus(prevStatus);
        toast.error(res.error || "Failed to update status.");
      } else {
        toast.success(`Task moved to ${nextStatus.replace("_", " ")}`);
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      setCurrentStatus(prevStatus);
      toast.error("Network error during status update.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await deleteTaskAction(task.id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete task.");
      } else {
        toast.success("Task deleted successfully.");
        if (onRefresh) onRefresh();
      }
    } catch {
      toast.error("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartFocus = async () => {
    startFocusSession(task.id, task.title, 25);
    toast.info(`Started 25-minute Pomodoro for: ${task.title}`, {
      description: "Focus timer active in header bar.",
    });

    // Fire non-blocking telemetry event to MongoDB
    try {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "FOCUS_SESSION_START",
          sessionId: `pomodoro_${task.id}_${Date.now()}`,
          payload: {
            taskId: task.id,
            taskTitle: task.title,
            courseCode: task.course.code,
            durationPlannedMinutes: 25,
          },
          tags: ["pomodoro", "study_session", "rsc_telemetry"],
        }),
      }).catch(() => null);
    } catch {
      // Non-fatal
    }
  };

  const priorityBadgeVariant = (priority: TaskPriority) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "default";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "secondary";
    }
  };

  const isFocused = activeFocusTaskId === task.id;

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md border ${
      currentStatus === "COMPLETED" ? "opacity-75 bg-muted/20" : "bg-card"
    } ${isFocused ? "ring-2 ring-indigo-500" : ""}`}>
      {/* Course Color Indicator Strip */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: task.course.color }}
      />

      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="text-[11px] font-mono font-semibold"
            style={{ borderColor: `${task.course.color}66` }}
          >
            {task.course.code}
          </Badge>

          <Badge variant={priorityBadgeVariant(task.priority)} className="text-[10px]">
            {task.priority}
          </Badge>
        </div>

        <h3 className={`font-semibold text-sm leading-snug line-clamp-2 ${
          currentStatus === "COMPLETED" ? "line-through text-muted-foreground" : ""
        }`}>
          {task.title}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-1 pb-3 space-y-2.5">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{task.estimatedMinutes}m est</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t flex items-center justify-between gap-2 bg-muted/10">
        {/* Status Toggle Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCycleStatus}
          disabled={isUpdating}
          className="h-7 text-xs px-2 gap-1.5 font-medium hover:bg-muted"
          title="Click to cycle status"
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : currentStatus === "COMPLETED" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : currentStatus === "IN_PROGRESS" ? (
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="capitalize">{currentStatus.toLowerCase().replace("_", " ")}</span>
        </Button>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {currentStatus !== "COMPLETED" && (
            <Button
              size="sm"
              variant={isFocused ? "default" : "outline"}
              onClick={handleStartFocus}
              className={`h-7 px-2 text-xs gap-1 ${
                isFocused ? "bg-indigo-600 text-white" : ""
              }`}
              title="Start Pomodoro Focus Session"
            >
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span>{isFocused ? "Focused" : "Focus"}</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
