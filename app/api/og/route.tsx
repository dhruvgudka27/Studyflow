import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "StudyFlow Platform";
    const subtitle =
      searchParams.get("subtitle") ||
      "Student Academic Productivity & Coursework Orchestration";
    const student = searchParams.get("student") || "T.Y. B.Tech AIML";
    const course = searchParams.get("course") || "DJS23AMD302L";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0b0f19",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e1b4b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px 80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                SF
              </div>
              <div style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "-0.02em" }}>
                StudyFlow
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  backgroundColor: "#1e1b4b",
                  border: "1px solid #4338ca",
                  fontSize: "14px",
                  color: "#a5b4fc",
                  fontWeight: 600,
                }}
              >
                {course}
              </div>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  fontSize: "14px",
                  color: "#cbd5e1",
                  fontWeight: 600,
                }}
              >
                {student}
              </div>
            </div>
          </div>

          {/* Central Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "960px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                background: "linear-gradient(90deg, #ffffff, #c7d2fe, #818cf8)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#94a3b8",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "24px",
              borderTop: "1px solid #1e293b",
            }}
          >
            <div style={{ display: "flex", gap: "24px", fontSize: "16px", color: "#64748b" }}>
              <span>Next.js App Router</span>
              <span>•</span>
              <span>React Server Components</span>
              <span>•</span>
              <span>PostgreSQL & Prisma</span>
              <span>•</span>
              <span>MongoDB Telemetry</span>
            </div>

            <div style={{ fontSize: "16px", color: "#818cf8", fontWeight: "bold" }}>
              academic.studyflow.edu
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, {
      status: 500,
    });
  }
}
