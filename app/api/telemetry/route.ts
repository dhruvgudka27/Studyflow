import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StudyTelemetry } from "@/models/StudyTelemetry";
import { getRequestSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getRequestSession(request);
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("eventType");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const query: Record<string, any> = {};
    if (session && session.role !== "ADMIN") {
      query.userId = session.userId;
    }
    if (eventType) {
      query.eventType = eventType;
    }

    const events = await StudyTelemetry.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: events.length,
      database: "MongoDB (Mongoose Object Database)",
      data: events,
    });
  } catch (error: any) {
    console.error("❌ Mongoose GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve telemetry stream", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getRequestSession(request);
    const body = await request.json();

    const { eventType, payload, sessionId, device, tags } = body;

    if (!eventType) {
      return NextResponse.json({ error: "Missing required eventType" }, { status: 400 });
    }

    const userId = session?.userId || body.userId || "anonymous-student";

    const telemetryDoc = await StudyTelemetry.create({
      userId,
      sessionId,
      eventType,
      payload: payload || {},
      device: device || {
        os: "Windows 10/11",
        browser: "Next.js Chrome/V8",
      },
      tags: tags || ["academic_telemetry", "focus_metric"],
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        database: "MongoDB (Mongoose Object Database)",
        documentId: telemetryDoc._id,
        event: telemetryDoc,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Mongoose POST error:", error);
    return NextResponse.json(
      { error: "Failed to record telemetry document", details: error.message },
      { status: 500 }
    );
  }
}
