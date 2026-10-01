"use client";

import React, { useMemo } from "react";
import { useStudyFlowStore } from "@/stores/useStudyStore";
import { TaskCard, TaskItem } from "./task-card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ListTodo, Inbox } from "lucide-react";

interface TaskListProps {
  initialTasks: TaskItem[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const router = useRouter();

  // Selective subscriptions to Zustand store
  const searchQuery = useStudyFlowStore((s) => s.searchQuery);
  const priorityFilter = useStudyFlowStore((s) => s.priorityFilter);
  const statusFilter = useStudyFlowStore((s) => s.statusFilter);
  const courseFilter = useStudyFlowStore((s) => s.courseFilter);
  const viewMode = useStudyFlowStore((s) => s.viewMode);

  // Apply filters without re-fetching from server
  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCode = task.course.code.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCode) return false;
      }

      // 2. Priority Filter
      if (priorityFilter !== "ALL" && task.priority !== priorityFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== "ALL" && task.status !== statusFilter) {
        return false;
      }

      // 4. Course Filter
      if (courseFilter !== "ALL" && task.course.id !== courseFilter) {
        return false;
      }

      return true;
    });
  }, [initialTasks, searchQuery, priorityFilter, statusFilter, courseFilter]);

  const onRefresh = () => {
    router.refresh();
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed bg-card/40 space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-lg">No tasks match your criteria</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Try clearing or adjusting your persistent filters, or create a new study task above.
        </p>
      </div>
    );
  }

  // Kanban Board View Mode
  if (viewMode === "kanban") {
    const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
    const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
    const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED");

    const columns = [
      {
        title: "To Do",
        icon: ListTodo,
        tasks: todoTasks,
        badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      },
      {
        title: "In Progress",
        icon: Clock,
        tasks: inProgressTasks,
        badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      },
      {
        title: "Completed",
        icon: CheckCircle2,
        tasks: completedTasks,
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col, idx) => {
          const Icon = col.icon;
          return (
            <div key={idx} className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">{col.title}</span>
                </div>
                <Badge variant="outline" className={`text-xs font-mono ${col.badgeColor}`}>
                  {col.tasks.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[150px] p-2 rounded-xl bg-muted/20 border border-muted-foreground/10">
                {col.tasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No tasks in this lane
                  </div>
                ) : (
                  col.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onRefresh={onRefresh} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Compact List View Mode
  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
