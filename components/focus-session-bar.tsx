"use client";

import React, { useEffect } from "react";
import { useStudyFlowStore } from "@/stores/useStudyStore";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Flame, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FocusSessionBar() {
  // Selective Zustand subscriptions to prevent unnecessary re-renders in parent layout
  const focusTaskId = useStudyFlowStore((state) => state.focusTaskId);
  const focusTaskTitle = useStudyFlowStore((state) => state.focusTaskTitle);
  const focusSecondsRemaining = useStudyFlowStore((state) => state.focusSecondsRemaining);
  const isFocusRunning = useStudyFlowStore((state) => state.isFocusRunning);
  const pauseFocusSession = useStudyFlowStore((state) => state.pauseFocusSession);
  const resumeFocusSession = useStudyFlowStore((state) => state.resumeFocusSession);
  const stopFocusSession = useStudyFlowStore((state) => state.stopFocusSession);
  const tickFocusTimer = useStudyFlowStore((state) => state.tickFocusTimer);

  // Active timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isFocusRunning && focusSecondsRemaining > 0) {
      interval = setInterval(() => {
        tickFocusTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusRunning, focusSecondsRemaining, tickFocusTimer]);

  if (!focusTaskId) {
    return null;
  }

  const minutes = Math.floor(focusSecondsRemaining / 60);
  const seconds = focusSecondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-b border-indigo-800/50 px-4 py-2.5 text-white shadow-md animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            {isFocusRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isFocusRunning ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-sm">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Focus Mode Active:</span>
          </div>
          <span className="text-sm font-medium text-slate-200 truncate max-w-xs md:max-w-md">
            {focusTaskTitle}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-black/40 border-indigo-400/40 text-indigo-200 font-mono text-sm px-2.5 py-0.5">
            <Timer className="h-3.5 w-3.5 mr-1.5" />
            {formattedTime}
          </Badge>

          <div className="flex items-center gap-1.5">
            {isFocusRunning ? (
              <Button
                size="sm"
                variant="outline"
                onClick={pauseFocusSession}
                className="h-8 border-indigo-500/50 bg-indigo-900/40 hover:bg-indigo-800 text-white text-xs px-2.5"
                title="Pause Focus Session"
              >
                <Pause className="h-3.5 w-3.5 mr-1" />
                Pause
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={resumeFocusSession}
                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5"
                title="Resume Focus Session"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                Resume
              </Button>
            )}

            <Button
              size="sm"
              variant="destructive"
              onClick={stopFocusSession}
              className="h-8 text-xs px-2.5"
              title="Stop Session"
            >
              <Square className="h-3 w-3 mr-1" />
              Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
