import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "studyflow_super_secret_jwt_encryption_key_2026_aiml"
);

const SESSION_COOKIE = "studyflow_session";

// Public route matcher
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth",
  "/api/og",
  "/api/webhooks/resend",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static assets and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Allow explicitly public routes
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      sessionPayload = payload;
    } catch {
      // Invalid/expired token
      sessionPayload = null;
    }
  }

  // 3. Admin-Only Guard: /admin and /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!sessionPayload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (sessionPayload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden: Administrative role required to access this resource" },
          { status: 403 }
        );
      }
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "insufficient_permissions");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 4. Authenticated Member / Protected App Routes: /dashboard, /tasks, /courses, /analytics
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/api/tasks") ||
    pathname.startsWith("/api/courses") ||
    pathname.startsWith("/api/telemetry");

  if (isProtectedRoute && !sessionPayload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. If logged in and browsing /login or /register, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && sessionPayload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 6. Enrich downstream requests with security headers
  const response = NextResponse.next();
  if (sessionPayload) {
    response.headers.set("x-user-id", sessionPayload.userId);
    response.headers.set("x-user-role", sessionPayload.role);
    response.headers.set("x-user-email", sessionPayload.email);
  }

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
