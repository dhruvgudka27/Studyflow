import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudyTelemetry extends Document {
  userId: string;
  sessionId?: string;
  eventType: string; // e.g. "FOCUS_PULSE", "POMODORO_TICK", "RESOURCE_INTERACTION"
  payload: Record<string, any>; // Arbitrary unstructured telemetry data
  device: {
    os?: string;
    browser?: string;
    screenResolution?: string;
  };
  tags: string[];
  timestamp: Date;
}

const StudyTelemetrySchema = new Schema<IStudyTelemetry>(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, index: true },
    eventType: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    device: {
      os: { type: String },
      browser: { type: String },
      screenResolution: { type: String },
    },
    tags: [{ type: String }],
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    collection: "study_telemetry_events",
  }
);

// Compound index for time-series queries
StudyTelemetrySchema.index({ userId: 1, timestamp: -1 });

export const StudyTelemetry: Model<IStudyTelemetry> =
  mongoose.models.StudyTelemetry ||
  mongoose.model<IStudyTelemetry>("StudyTelemetry", StudyTelemetrySchema);
