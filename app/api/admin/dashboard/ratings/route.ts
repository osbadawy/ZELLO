import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ratingSelection = {
  dailyUseRating: true,
  reliabilityRating: true,
  qualityRating: true,
  recommendRating: true,
  overallRating: true,
} as const;

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string | null }).role;

    if (role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalActiveProducts,
      ratedProducts,
      ratingAggregate,
      topProducts,
    ] = await Promise.all([
      prisma.product.count({
        where: { isActive: true },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          overallRating: { not: null },
        },
      }),

      prisma.product.aggregate({
        where: { isActive: true },
        _avg: ratingSelection,
      }),

      prisma.product.findMany({
        where: {
          isActive: true,
          overallRating: { not: null },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          ...ratingSelection,
        },
        orderBy: [
          { overallRating: "desc" },
          { name: "asc" },
        ],
        take: 5,
      }),
    ]);

    function toNumber(value: { toString(): string } | null) {
      return value === null ? null : Number(value.toString());
    }

    return NextResponse.json(
      {
        totalActiveProducts,
        ratedProducts,

        averages: {
          dailyUseRating: toNumber(ratingAggregate._avg.dailyUseRating),
          reliabilityRating: toNumber(ratingAggregate._avg.reliabilityRating),
          qualityRating: toNumber(ratingAggregate._avg.qualityRating),
          recommendRating: toNumber(ratingAggregate._avg.recommendRating),
          overallRating: toNumber(ratingAggregate._avg.overallRating),
        },

        topProducts: topProducts.map((product) => ({
          ...product,
          dailyUseRating: toNumber(product.dailyUseRating),
          reliabilityRating: toNumber(product.reliabilityRating),
          qualityRating: toNumber(product.qualityRating),
          recommendRating: toNumber(product.recommendRating),
          overallRating: toNumber(product.overallRating),
        })),
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Product ratings error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve product ratings." },
      { status: 500 },
    );
  }
}