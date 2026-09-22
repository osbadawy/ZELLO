import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        overallRating: { not: null },
      },
      take: 10,
      orderBy: [
        { overallRating: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        currency: true,
        overallRating: true,
        dailyUseRating: true,
        reliabilityRating: true,
        qualityRating: true,
        recommendRating: true,
        categories: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          take: 1,
          orderBy: [
            { isPrimary: "desc" },
            { sortOrder: "asc" },
          ],
          select: {
            id: true,
            altText: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: Number(product.price),
          currency: product.currency,
          overallRating:
            product.overallRating === null
              ? null
              : Number(product.overallRating),
          dailyUseRating:
            product.dailyUseRating === null
              ? null
              : Number(product.dailyUseRating),
          reliabilityRating:
            product.reliabilityRating === null
              ? null
              : Number(product.reliabilityRating),
          qualityRating:
            product.qualityRating === null
              ? null
              : Number(product.qualityRating),
          recommendRating:
            product.recommendRating === null
              ? null
              : Number(product.recommendRating),
          categories: product.categories,
          image: product.images[0]
            ? {
                id: product.images[0].id,
                altText: product.images[0].altText,
                url: `/api/shop/images/${product.images[0].id}`,
              }
            : null,
        })),
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Highest rated products error:", error);

    return NextResponse.json(
      { error: "Unable to load highest rated products." },
      { status: 500 },
    );
  }
}