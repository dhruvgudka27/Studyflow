"use client";

import React from "react";
import { useStudyFlowStore } from "@/stores/useStudyStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, RotateCcw, Filter, LayoutGrid, List } from "lucide-react";

interface TaskFilterBarProps {
  courses: Array<{ id: string; code: string; title: string }>;
}

export function TaskFilterBar({ courses }: TaskFilterBarProps) {
  // Selective subscriptions to prevent unnecessary re-renders in other slices
  const searchQuery = useStudyFlowStore((s) => s.searchQuery);
  const setSearchQuery = useStudyFlowStore((s) => s.setSearchQuery);

  const priorityFilter = useStudyFlowStore((s) => s.priorityFilter);
  const setPriorityFilter = useStudyFlowStore((s) => s.setPriorityFilter);

  const statusFilter = useStudyFlowStore((s) => s.statusFilter);
  const setStatusFilter = useStudyFlowStore((s) => s.setStatusFilter);

  const courseFilter = useStudyFlowStore((s) => s.courseFilter);
  const setCourseFilter = useStudyFlowStore((s) => s.setCourseFilter);

  const resetFilters = useStudyFlowStore((s) => s.resetFilters);

  const viewMode = useStudyFlowStore((s) => s.viewMode);
  const setViewMode = useStudyFlowStore((s) => s.setViewMode);

  const hasActiveFilters =
    searchQuery !== "" ||
    priorityFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    courseFilter !== "ALL";

  return (
    <div className="p-4 rounded-xl border bg-card/60 backdrop-blur shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border rounded-lg p-0.5 self-end md:self-auto bg-muted/40">
          <Button
            size="sm"
            variant={viewMode === "kanban" ? "default" : "ghost"}
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("kanban")}
            title="Kanban Board View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Board</span>
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("list")}
            title="Compact List View"
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </Button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter by Priority"
          className="h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by Status"
          className="h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Course Filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          aria-label="Filter by Academic Course"
          className="h-8 px-2.5 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring max-w-[180px]"
        >
          <option value="ALL">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 ml-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
