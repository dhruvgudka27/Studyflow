import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ViewMode = "kanban" | "list" | "table";

export interface TaskFilterState {
  searchQuery: string;
  priorityFilter: string; // "ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  statusFilter: string;   // "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED"
  courseFilter: string;   // "ALL" | courseId
}

export interface FocusState {
  focusTaskId: string | null;
  focusTaskTitle: string | null;
  focusSecondsRemaining: number;
  isFocusRunning: boolean;
}

export interface UIPreferenceState {
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  selectedTaskId: string | null; // For task inspection sheet/modal
}

export interface StudyFlowStore extends TaskFilterState, FocusState, UIPreferenceState {
  // Filter actions
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: string) => void;
  setStatusFilter: (status: string) => void;
  setCourseFilter: (courseId: string) => void;
  resetFilters: () => void;

  // Focus actions
  startFocusSession: (taskId: string, title: string, durationMinutes?: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  stopFocusSession: () => void;
  tickFocusTimer: () => void;

  // UI Preference actions
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSelectedTaskId: (id: string | null) => void;
}

export const useStudyFlowStore = create<StudyFlowStore>()(
  persist(
    (set) => ({
      // Initial Filter State
      searchQuery: "",
      priorityFilter: "ALL",
      statusFilter: "ALL",
      courseFilter: "ALL",

      // Initial Focus State (default 25 min pomodoro)
      focusTaskId: null,
      focusTaskTitle: null,
      focusSecondsRemaining: 25 * 60,
      isFocusRunning: false,

      // Initial UI Preference State
      viewMode: "kanban",
      sidebarCollapsed: false,
      selectedTaskId: null,

      // Filter Actions
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setCourseFilter: (courseFilter) => set({ courseFilter }),
      resetFilters: () =>
        set({
          searchQuery: "",
          priorityFilter: "ALL",
          statusFilter: "ALL",
          courseFilter: "ALL",
        }),

      // Focus Actions
      startFocusSession: (taskId, title, durationMinutes = 25) =>
        set({
          focusTaskId: taskId,
          focusTaskTitle: title,
          focusSecondsRemaining: durationMinutes * 60,
          isFocusRunning: true,
        }),
      pauseFocusSession: () => set({ isFocusRunning: false }),
      resumeFocusSession: () => set({ isFocusRunning: true }),
      stopFocusSession: () =>
        set({
          focusTaskId: null,
          focusTaskTitle: null,
          focusSecondsRemaining: 25 * 60,
          isFocusRunning: false,
        }),
      tickFocusTimer: () =>
        set((state) => ({
          focusSecondsRemaining: Math.max(0, state.focusSecondsRemaining - 1),
          isFocusRunning: state.focusSecondsRemaining > 1,
        })),

      // UI Actions
      setViewMode: (viewMode) => set({ viewMode }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
    }),
    {
      name: "studyflow-ui-store-v1",
      storage: createJSONStorage(() => localStorage),
      // Only persist genuine client UI preferences and filter states
      // Do NOT persist active timer ticks across reboots to prevent desync
      partialize: (state) => ({
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
        priorityFilter: state.priorityFilter,
        statusFilter: state.statusFilter,
        courseFilter: state.courseFilter,
      }),
    }
  )
);

// Atomic selector hooks to avoid unnecessary re-renders across components
export const useTaskFilters = () =>
  useStudyFlowStore((state) => ({
    searchQuery: state.searchQuery,
    priorityFilter: state.priorityFilter,
    statusFilter: state.statusFilter,
    courseFilter: state.courseFilter,
    setSearchQuery: state.setSearchQuery,
    setPriorityFilter: state.setPriorityFilter,
    setStatusFilter: state.setStatusFilter,
    setCourseFilter: state.setCourseFilter,
    resetFilters: state.resetFilters,
  }));

export const useViewPreferences = () =>
  useStudyFlowStore((state) => ({
    viewMode: state.viewMode,
    sidebarCollapsed: state.sidebarCollapsed,
    setViewMode: state.setViewMode,
    toggleSidebar: state.toggleSidebar,
  }));

export const useFocusTimer = () =>
  useStudyFlowStore((state) => ({
    focusTaskId: state.focusTaskId,
    focusTaskTitle: state.focusTaskTitle,
    focusSecondsRemaining: state.focusSecondsRemaining,
    isFocusRunning: state.isFocusRunning,
    startFocusSession: state.startFocusSession,
    pauseFocusSession: state.pauseFocusSession,
    resumeFocusSession: state.resumeFocusSession,
    stopFocusSession: state.stopFocusSession,
    tickFocusTimer: state.tickFocusTimer,
  }));

export const useSelectedTaskState = () =>
  useStudyFlowStore((state) => ({
    selectedTaskId: state.selectedTaskId,
    setSelectedTaskId: state.setSelectedTaskId,
  }));
