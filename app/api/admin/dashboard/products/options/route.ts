import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const role = String(session.user.role ?? "").trim().toLowerCase();

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const [categories, suppliers] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: { name: "asc" },
      }),

      prisma.supplier.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          provider: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json(
      { categories, suppliers },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Product options error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve product options." },
      { status: 500 },
    );
  }
}