import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category")?.trim() || "all";
    const query = request.nextUrl.searchParams.get("q")?.trim() || "";

    const where = {
      isActive: true,

      ...(category !== "all"
        ? {
            categories: {
              some: {
                slug: category,
                isActive: true,
              },
            },
          }
        : {}),

      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { description: { contains: query, mode: "insensitive" as const } },
              { shortDescription: { contains: query, mode: "insensitive" as const } },
              {
                categories: {
                  some: {
                    isActive: true,
                    name: { contains: query, mode: "insensitive" as const },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [categories, totalProducts, products] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: { name: "asc" },
      }),

      prisma.product.count({ where }),

      prisma.product.findMany({
        where,
        take: 4,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          shortDescription: true,
          price: true,
          currency: true,
          overallRating: true,
          categories: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              slug: true,
            },
            orderBy: { name: "asc" },
          },
          images: {
            take: 1,
            orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
            select: {
              id: true,
              altText: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      {
        categories,
        totalProducts,
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: Number(product.price),
          currency: product.currency,
          overallRating:
            product.overallRating === null ? null : Number(product.overallRating),
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
    console.error("Shop products error:", error);

    return NextResponse.json(
      { error: "Unable to load the shop collection." },
      { status: 500 },
    );
  }
}