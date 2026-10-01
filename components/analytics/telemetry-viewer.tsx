"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Database, Activity, RefreshCw, Send, Sparkles, Terminal, CheckCircle2 } from "lucide-react";

interface TelemetryEvent {
  _id: string;
  userId: string;
  sessionId?: string;
  eventType: string;
  payload: Record<string, any>;
  device?: {
    os?: string;
    browser?: string;
    screenResolution?: string;
  };
  tags: string[];
  timestamp: string;
}

export function TelemetryViewer() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulsing, setPulsing] = useState(false);
  const [dbName, setDbName] = useState<string>("MongoDB via Mongoose");

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telemetry?limit=20");
      const json = await res.json();
      if (res.ok) {
        setEvents(json.data || []);
        if (json.database) setDbName(json.database);
      } else {
        toast.error("Failed to load MongoDB telemetry.");
      }
    } catch {
      toast.error("Error communicating with Mongoose telemetry endpoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleSendPulse = async () => {
    setPulsing(true);
    try {
      const sampleEvents = [
        {
          eventType: "POMODORO_PULSE",
          payload: { focusRatio: 0.94, keystrokes: 142, activeTabDurationSec: 120 },
          tags: ["study_focus", "pomodoro", "aiml_lab"],
        },
        {
          eventType: "NOTEBOOK_EVAL_TRIGGER",
          payload: { modelCheckpoints: 3, lossValue: 0.0412, epoch: 10 },
          tags: ["neural_net", "model_eval", "deep_learning"],
        },
        {
          eventType: "RESOURCE_INTERACTION",
          payload: { resourceType: "SYLLABUS_PDF", readTimeSeconds: 310 },
          tags: ["resource", "reading", "document_stream"],
        },
      ];

      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: randomEvent.eventType,
          sessionId: `sess_${Date.now()}`,
          payload: randomEvent.payload,
          tags: randomEvent.tags,
          device: {
            os: navigator.userAgent.includes("Windows") ? "Windows 11" : "Browser Client",
            browser: "Next.js Chrome/V8",
            screenResolution: `${window.innerWidth}x${window.innerHeight}`,
          },
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(`Recorded ${randomEvent.eventType} in MongoDB!`, {
          description: `Document ID: ${json.documentId}`,
        });
        await fetchTelemetry();
      } else {
        toast.error(json.error || "Failed to persist event.");
      }
    } catch {
      toast.error("Failed to transmit telemetry pulse.");
    } finally {
      setPulsing(false);
    }
  };

  return (
    <Card className="border shadow-xs">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg font-bold">
                Mongoose & MongoDB Telemetry Stream
              </CardTitle>
              <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Live Document Store
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Unstructured time-series focus telemetry recorded in MongoDB object database
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchTelemetry}
              disabled={loading}
              className="h-8 text-xs gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSendPulse}
              disabled={pulsing}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Send className={`h-3.5 w-3.5 ${pulsing ? "animate-pulse" : ""}`} />
              <span>Record Telemetry Pulse</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground p-2 rounded bg-muted/30">
          <span>Target Engine: <strong className="text-foreground">{dbName}</strong></span>
          <span>Collection: <strong className="text-foreground font-mono">study_telemetry_events</strong></span>
          <span>Buffered Records: <strong className="text-foreground">{events.length}</strong></span>
        </div>

        {/* Live stream log console */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No telemetry events recorded yet. Click "Record Telemetry Pulse" to append documents.
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev._id}
                className="p-3 rounded-lg border bg-card/60 hover:bg-muted/40 transition-colors font-mono text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-primary">{ev.eventType}</span>
                    <span className="text-[10px] text-muted-foreground">Doc ID: {ev._id.slice(-6)}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(ev.timestamp).toLocaleTimeString()} • {new Date(ev.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {ev.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* JSON Payload */}
                <div className="p-2 rounded bg-black/40 text-slate-300 text-[11px] overflow-x-auto">
                  <pre>{JSON.stringify(ev.payload, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
