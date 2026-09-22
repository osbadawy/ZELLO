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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = String(session.user.role ?? "").trim().toLowerCase();

    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalProducts,
      categoriesAvailable,
      ratedProducts,
      ratingAggregate,
      salesAggregate,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.category.count({
        where: { isActive: true },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          overallRating: { not: null },
        },
      }),

      prisma.product.aggregate({
        where: {
          isActive: true,
          overallRating: { not: null },
        },
        _avg: {
          overallRating: true,
        },
      }),

      prisma.orderItem.aggregate({
        where: {
          order: {
            paymentStatus: "PAID",
          },
        },
        _sum: {
          quantity: true,
        },
      }),
    ]);

    const averageRating = ratingAggregate._avg.overallRating;

    return NextResponse.json(
      {
        totalProducts,
        categoriesAvailable,
        ratedProducts,
        unitsSold: salesAggregate._sum.quantity ?? 0,
        averageRating: averageRating === null ? null : Number(averageRating),
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Product overview error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve product overview." },
      { status: 500 },
    );
  }
}