import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    // AUTHENTICATION
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

    // QUERY PARAMETERS
    const params = request.nextUrl.searchParams;

    const search = (params.get("search") ?? "").trim().slice(0, 100);
    const status = params.get("status") ?? "all";
    const sort = params.get("sort") ?? "newest";

    const requestedPage = Number(params.get("page") ?? "1");
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

    // FILTERS
    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
              {
                categories: {
                  some: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
              {
                variants: {
                  some: {
                    sku: { contains: search, mode: "insensitive" as const },
                  },
                },
              },
            ],
          }
        : {}),

      ...(status === "active"
        ? { isActive: true }
        : status === "inactive"
          ? { isActive: false }
          : {}),
    };

    // SORTING
    const orderBy =
      sort === "oldest"
        ? [{ createdAt: "asc" as const }]
        : sort === "name"
          ? [{ name: "asc" as const }]
          : sort === "price-low"
            ? [{ price: "asc" as const }]
            : sort === "price-high"
              ? [{ price: "desc" as const }]
              : sort === "rating"
                ? [{ overallRating: "desc" as const }]
                : [{ createdAt: "desc" as const }];

    // DATABASE QUERIES
    const [total, activeCount, inactiveCount] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,

        price: true,
        currency: true,

        instagramVideoUrl: true,
        isActive: true,

        dailyUseRating: true,
        reliabilityRating: true,
        qualityRating: true,
        recommendRating: true,
        overallRating: true,

        createdAt: true,
        updatedAt: true,

        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          select: {
            id: true,
            fileName: true,
            altText: true,
            isPrimary: true,
            sortOrder: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },

        variants: {
          select: {
            id: true,
            sku: true,
            name: true,
            size: true,
            color: true,
            price: true,
            isActive: true,

            supplierProducts: {
              select: {
                stockQuantity: true,
                isAvailable: true,
                isActive: true,

                supplier: {
                  select: {
                    id: true,
                    name: true,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // RESPONSE
    const formattedProducts = products.map((product) => {
      const variants = product.variants.map((variant) => {
        const availableSuppliers = variant.supplierProducts.filter(
          (item) =>
            item.isActive &&
            item.isAvailable &&
            item.stockQuantity > 0 &&
            item.supplier.isActive,
        );

        return {
          id: variant.id,
          sku: variant.sku,
          name: variant.name,
          size: variant.size,
          color: variant.color,
          price: variant.price === null ? null : Number(variant.price),
          isActive: variant.isActive,

          availableStock: availableSuppliers.reduce(
            (sum, supplier) => sum + supplier.stockQuantity,
            0,
          ),

          suppliers: variant.supplierProducts.map((item) => ({
            id: item.supplier.id,
            name: item.supplier.name,
            stockQuantity: item.stockQuantity,
            isAvailable:
              item.isActive &&
              item.isAvailable &&
              item.supplier.isActive,
          })),
        };
      });

      const activeVariants = variants.filter((variant) => variant.isActive);

      const availableVariants = activeVariants.filter(
        (variant) => variant.availableStock > 0,
      );

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,

        price: Number(product.price),
        currency: product.currency,

        instagramVideoUrl: product.instagramVideoUrl,
        isActive: product.isActive,

        ratings: {
          dailyUse:
            product.dailyUseRating === null
              ? null
              : Number(product.dailyUseRating),

          reliability:
            product.reliabilityRating === null
              ? null
              : Number(product.reliabilityRating),

          quality:
            product.qualityRating === null
              ? null
              : Number(product.qualityRating),

          recommend:
            product.recommendRating === null
              ? null
              : Number(product.recommendRating),

          overall:
            product.overallRating === null
              ? null
              : Number(product.overallRating),
        },

        categories: product.categories,

        images: product.images,

        imageCount: product.images.length,
        variantCount: variants.length,
        activeVariantCount: activeVariants.length,
        availableVariantCount: availableVariants.length,

        variants,

        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(
      {
        products: formattedProducts,

        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
        },

        summary: {
          totalProducts: activeCount + inactiveCount,
          activeProducts: activeCount,
          inactiveProducts: inactiveCount,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Admin products error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve products." },
      { status: 500 },
    );
  }
}