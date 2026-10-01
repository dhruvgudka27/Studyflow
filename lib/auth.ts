import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "studyflow_super_secret_jwt_encryption_key_2026_aiml"
);

export const SESSION_COOKIE_NAME = "studyflow_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  exp?: number;
}

/**
 * Signs a cryptographic session token (JWT) compatible with Edge Middleware and Route Handlers.
 */
export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/**
 * Validates a session token string.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Role,
      name: payload.name as string,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Server Component / Server Action helper to retrieve the current session.
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Route Handler helper to retrieve session from cookie or Bearer header.
 */
export async function getRequestSession(request: Request): Promise<SessionPayload | null> {
  // Check Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return await verifySessionToken(token);
  }

  // Check Cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (match) {
    const token = match.split("=")[1];
    return await verifySessionToken(token);
  }

  return null;
}

/**
 * Role-Based Access Gatekeeper for Server Actions and Endpoints
 */
export async function requireAuth(allowedRoles: Role[] = [Role.ADMIN, Role.MEMBER]): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication required.");
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error(`FORBIDDEN: Insufficient role permissions. Required: ${allowedRoles.join(" | ")}`);
  }
  return session;
}
