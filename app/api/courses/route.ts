import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/validations/task";
import { Role } from "@prisma/client";

/**
 * Protected Route Handler: GET /api/courses
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { userId: session.userId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch courses", details: error.message }, { status: 500 });
  }
}

/**
 * Protected Route Handler: POST /api/courses
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    if (session.role === Role.GUEST) {
      return NextResponse.json({ error: "Forbidden: Guest accounts are read-only" }, { status: 403 });
    }

    const body = await request.json();
    const validation = courseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, title, description, instructor, credits, color } = validation.data;

    const existing = await prisma.course.findFirst({
      where: { code, userId: session.userId },
    });

    if (existing) {
      return NextResponse.json({ error: `Course ${code} already registered` }, { status: 409 });
    }

    const course = await prisma.course.create({
      data: {
        code,
        title,
        description: description || null,
        instructor,
        credits,
        color,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create course", details: error.message }, { status: 500 });
  }
}
