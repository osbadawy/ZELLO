import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;

    const query = (searchParams.get("q") ?? "").trim().slice(0, 100);

    const requestedPage = Number(searchParams.get("page") ?? "1");
    const page =
      Number.isSafeInteger(requestedPage) &&
      requestedPage > 0 &&
      requestedPage <= 100000
        ? requestedPage
        : 1;

    const requestedSort = searchParams.get("sort") ?? "newest";

    const sort = [
      "newest",
      "price-asc",
      "price-desc",
      "rating",
      "name",
    ].includes(requestedSort)
      ? requestedSort
      : "newest";

    const requestedRating = searchParams.get("minRating") ?? "all";

    const minRating =
      requestedRating === "8"
        ? 8
        : requestedRating === "9"
          ? 9
          : null;

    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 },
      );
    }

    const where = {
      isActive: true,

      categories: {
        some: {
          id: category.id,
        },
      },

      ...(query
        ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
              {
                shortDescription: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(minRating !== null
        ? {
            overallRating: {
              gte: minRating,
            },
          }
        : {}),
    };

    const orderBy =
      sort === "price-asc"
        ? [
            { price: "asc" as const },
            { id: "asc" as const },
          ]
        : sort === "price-desc"
          ? [
              { price: "desc" as const },
              { id: "asc" as const },
            ]
          : sort === "rating"
            ? [
                { overallRating: "desc" as const },
                { id: "asc" as const },
              ]
            : sort === "name"
              ? [
                  { name: "asc" as const },
                  { id: "asc" as const },
                ]
              : [
                  { createdAt: "desc" as const },
                  { id: "desc" as const },
                ];

    const [categories, totalProducts, products] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.product.count({
        where,
      }),

      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,

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
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

    return NextResponse.json(
      {
        category,
        categories,

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

          categories: product.categories,

          image: product.images[0]
            ? {
                id: product.images[0].id,
                altText: product.images[0].altText,
                url: `/api/shop/images/${product.images[0].id}`,
              }
            : null,
        })),

        pagination: {
          page,
          pageSize: PAGE_SIZE,
          totalProducts,
          totalPages,
          hasMore: page < totalPages,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Category products error:", error);

    return NextResponse.json(
      { error: "Unable to load category products." },
      { status: 500 },
    );
  }
}