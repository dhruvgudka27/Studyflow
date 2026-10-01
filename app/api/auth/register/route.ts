import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole: Role = role === "ADMIN" ? Role.ADMIN : role === "GUEST" ? Role.GUEST : Role.MEMBER;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      },
    });

    // Auto-create default academic course for student members
    if (assignedRole === Role.MEMBER) {
      await prisma.course.create({
        data: {
          code: "DJS23AMD302L",
          title: "Full Stack Development Using Next.js",
          description: "Default academic workspace course",
          instructor: "Prof. S. R. Mehta",
          credits: 4,
          userId: user.id,
        },
      });
    }

    // Forensic audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: request.headers.get("user-agent"),
        details: { role: assignedRole },
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during account creation." },
      { status: 500 }
    );
  }
}
